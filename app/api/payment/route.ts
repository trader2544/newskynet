import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// IntaSend API credentials
const INTASEND_PUBLIC_KEY = process.env.INTASEND_PUBLIC_KEY || "YOUR_INTASEND_PUBLIC_KEY"
const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY || "YOUR_INTASEND_SECRET_KEY"
// Set to false for live payments
const INTASEND_TEST_MODE = false

export async function POST(request: Request) {
  try {
    const { userId, vpnId, planId, amount, phoneNumber, email, currency = "KES" } = await request.json()

    if (!userId || !vpnId || !planId || !amount) {
      return NextResponse.json({ success: false, message: "Missing required parameters" }, { status: 400 })
    }

    // Create a payment request to IntaSend
    const paymentData = {
      public_key: INTASEND_PUBLIC_KEY,
      amount,
      currency,
      email: email || "",
      phone_number: phoneNumber || "",
      comment: "Skynet VPN Configuration Purchase",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/api/payment/callback`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com"}/dashboard`,
      metadata: {
        user_id: userId,
        vpn_id: vpnId,
        plan_id: planId,
      },
    }

    // Make request to IntaSend API - use live API endpoint
    const response = await fetch(`https://payment.intasend.com/api/v1/checkout/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${INTASEND_SECRET_KEY}`,
      },
      body: JSON.stringify(paymentData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to create payment")
    }

    // Record the pending purchase in the database
    const supabase = createServerClient()

    // Calculate expiry date based on plan
    const { data: planData } = await supabase.from("subscription_plans").select("duration").eq("id", planId).single()

    const expiresAt = new Date()
    if (planData) {
      switch (planData.duration) {
        case "3days":
          expiresAt.setDate(expiresAt.getDate() + 3)
          break
        case "weekly":
          expiresAt.setDate(expiresAt.getDate() + 7)
          break
        case "2weeks":
          expiresAt.setDate(expiresAt.getDate() + 14)
          break
        case "monthly":
          expiresAt.setMonth(expiresAt.getMonth() + 1)
          break
      }
    }

    // Create purchase record
    const { error: purchaseError } = await supabase.from("purchases").insert({
      user_id: userId,
      vpn_id: vpnId,
      plan_id: planId,
      status: "pending",
      expires_at: expiresAt.toISOString(),
      payment_id: data.id || null,
    })

    if (purchaseError) {
      throw purchaseError
    }

    return NextResponse.json({
      success: true,
      paymentUrl: data.checkout_url,
      paymentId: data.id,
    })
  } catch (error: any) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred processing payment" },
      { status: 500 },
    )
  }
}

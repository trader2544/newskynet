import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

// IntaSend API credentials
const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY || "YOUR_INTASEND_SECRET_KEY"

export async function POST(request: Request) {
  try {
    // Verify the request is from IntaSend
    const signature = request.headers.get("X-IntaSend-Signature")

    // In a production environment, you should verify the signature
    // This is a simplified example

    const payload = await request.json()
    const { status, metadata, id: paymentId } = payload

    if (!metadata || !metadata.user_id || !metadata.vpn_id || !metadata.plan_id) {
      return NextResponse.json({ success: false, message: "Invalid metadata" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Update the purchase status based on the payment status
    if (status === "COMPLETE") {
      const { error } = await supabase
        .from("purchases")
        .update({ status: "active", payment_id: paymentId })
        .eq("user_id", metadata.user_id)
        .eq("vpn_id", metadata.vpn_id)
        .eq("plan_id", metadata.plan_id)
        .eq("status", "pending")

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, message: "Payment processed successfully" })
    } else if (status === "FAILED") {
      const { error } = await supabase
        .from("purchases")
        .update({ status: "failed", payment_id: paymentId })
        .eq("user_id", metadata.user_id)
        .eq("vpn_id", metadata.vpn_id)
        .eq("plan_id", metadata.plan_id)
        .eq("status", "pending")

      if (error) {
        throw error
      }

      return NextResponse.json({ success: true, message: "Payment failure recorded" })
    }

    return NextResponse.json({ success: true, message: "Payment notification received" })
  } catch (error: any) {
    console.error("Payment callback error:", error)
    return NextResponse.json(
      { success: false, message: error.message || "An error occurred processing payment callback" },
      { status: 500 },
    )
  }
}

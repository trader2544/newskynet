"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CheckCircle, Shield, AlertCircle, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type VpnProduct = {
  id: string
  name: string
  description: string
  features: string[]
  image_url: string
}

// Default VPN products to use when database isn't initialized
const DEFAULT_VPN_PRODUCTS = [
  {
    id: "http-custom",
    name: "HTTP Custom",
    description: "Fast and reliable connectivity",
    features: ["Optimized for all networks", "Low latency connection", "Regular updates", "Technical support included"],
    image_url: "/images/hc.png",
  },
  {
    id: "http-injector",
    name: "HTTP Injector",
    description: "Powerful and versatile",
    features: [
      "Advanced configuration options",
      "Optimized for streaming",
      "Technical support included",
      "Works on restricted networks",
    ],
    image_url: "/images/hi.png",
  },
  {
    id: "dark-tunnel",
    name: "Dark Tunnel",
    description: "Secure and anonymous",
    features: ["Enhanced privacy features", "Works on restricted networks", "Optimized for gaming", "Regular updates"],
    image_url: "/images/dark.png",
  },
]

// Coming soon VPNs
const COMING_SOON_VPNS = [
  {
    name: "HA Tunnel",
    description: "Coming soon",
    features: ["Enhanced security", "Fast connection", "Regular updates"],
  },
  {
    name: "Netmod",
    description: "Coming soon",
    features: ["Optimized for gaming", "Low latency", "Advanced settings"],
  },
  {
    name: "EV2Ray",
    description: "Coming soon",
    features: ["Privacy focused", "Multiple protocols", "Global servers"],
  },
  {
    name: "Open Tunnel",
    description: "Coming soon",
    features: ["User-friendly interface", "Stable connection", "Technical support"],
  },
  {
    name: "TC Tunnel",
    description: "Coming soon",
    features: ["Optimized for streaming", "Fast speeds", "Regular updates"],
  },
  {
    name: "Psiphon Pro",
    description: "Coming soon",
    features: ["Bypass restrictions", "Secure browsing", "Multiple servers"],
  },
  {
    name: "NVP Tunnel",
    description: "Coming soon",
    features: ["Advanced encryption", "No logs policy", "24/7 support"],
  },
]

export default function PricingPage() {
  const [vpnProducts, setVpnProducts] = useState<VpnProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [dbError, setDbError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [selectedVpn, setSelectedVpn] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchVpnProducts = async () => {
      try {
        // Check if user is logged in
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user) {
          setUserId(session.user.id)

          // Check if user is admin (for showing database initialization message)
          const { data: userData } = await supabase.from("profiles").select("email").eq("id", session.user.id).single()

          // Simple admin check - in a real app, you'd have proper roles
          setIsAdmin(userData?.email === "admin@skynet.com" || userData?.email === "admin@example.com")
        }

        // Try to fetch VPN products
        const { data, error } = await supabase.from("vpn_products").select("*")

        if (error) {
          // If the table doesn't exist, use default products
          if (error.message.includes("does not exist")) {
            setDbError("Database not initialized. Using default products.")
            setVpnProducts(DEFAULT_VPN_PRODUCTS)
          } else {
            throw error
          }
        } else {
          const formattedProducts = data.map((product: any) => ({
            ...product,
            features: Array.isArray(product.features) ? product.features : JSON.parse(product.features || "[]"),
          }))

          setVpnProducts(formattedProducts)
        }
      } catch (error: any) {
        console.error("Error fetching VPN products:", error)
        setDbError("Error loading products. Using default products.")
        setVpnProducts(DEFAULT_VPN_PRODUCTS)
      } finally {
        setLoading(false)
      }
    }

    fetchVpnProducts()
  }, [supabase])

  // Function to handle payment
  const handlePayment = (vpn: any, duration: string, price: number) => {
    // If user is not logged in, redirect to login
    if (!userId) {
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    // Set selected VPN and plan for payment dialog
    setSelectedVpn(vpn)
    setSelectedPlan({
      duration,
      price,
    })
    setPaymentDialogOpen(true)
  }

  // Function to process payment with IntaSend
  const processPayment = async () => {
    if (!userId || !selectedVpn || !selectedPlan) {
      setPaymentError("Missing payment information")
      return
    }

    if (!phoneNumber) {
      setPaymentError("Please enter your phone number for M-Pesa payment")
      return
    }

    setProcessingPayment(true)
    setPaymentError(null)

    try {
      // Find the plan ID
      let planId
      if (!dbError) {
        const { data: plans } = await supabase
          .from("subscription_plans")
          .select("id")
          .eq("vpn_id", selectedVpn.id)
          .eq("duration", selectedPlan.duration)
          .eq("price", selectedPlan.price)

        if (plans && plans.length > 0) {
          planId = plans[0].id
        }
      } else {
        // If database is not initialized, use a placeholder ID
        planId = `${selectedVpn.id}-${selectedPlan.duration}`
      }

      // Get user email
      const { data: userData } = await supabase.from("profiles").select("email").eq("id", userId).single()
      const email = userData?.email || ""

      // Make API request to our payment endpoint
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          vpnId: selectedVpn.id,
          planId,
          amount: selectedPlan.price,
          phoneNumber,
          email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Payment processing failed")
      }

      // Redirect to IntaSend checkout page
      window.location.href = data.paymentUrl
    } catch (error: any) {
      console.error("Payment error:", error)
      setPaymentError(error.message || "Failed to process payment")
    } finally {
      setProcessingPayment(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Remove the SiteHeader component from here */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h1>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works best for you
                </p>
              </div>
            </div>
          </div>
        </section>

        {dbError && isAdmin && (
          <section className="w-full py-4">
            <div className="container px-4 md:px-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {dbError}{" "}
                  <Link href="/admin/init" className="font-medium underline">
                    Initialize database
                  </Link>
                </AlertDescription>
              </Alert>
            </div>
          </section>
        )}

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Available VPN Configurations</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Select your preferred VPN application and subscription period
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              {loading ? (
                <div className="col-span-3 text-center py-12">
                  <p>Loading VPN products...</p>
                </div>
              ) : vpnProducts.length > 0 ? (
                vpnProducts.map((vpn) => (
                  <Card key={vpn.id}>
                    <CardHeader className="text-center">
                      <CardTitle>{vpn.name}</CardTitle>
                      <CardDescription>{vpn.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                      {vpn.name === "HTTP Custom" && (
                        <div className="flex justify-center mb-4">
                          <Image
                            src="/images/hc.png"
                            alt={`${vpn.name} VPN`}
                            width={150}
                            height={150}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      {vpn.name === "HTTP Injector" && (
                        <div className="flex justify-center mb-4">
                          <Image
                            src="/images/hi.png"
                            alt={`${vpn.name} VPN`}
                            width={150}
                            height={150}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      {vpn.name === "Dark Tunnel" && (
                        <div className="flex justify-center mb-4">
                          <Image
                            src="/images/dark.png"
                            alt={`${vpn.name} VPN`}
                            width={150}
                            height={150}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      {vpn.name !== "HTTP Custom" && vpn.name !== "HTTP Injector" && vpn.name !== "Dark Tunnel" && (
                        <div className="flex justify-center mb-4">
                          <Image
                            src={vpn.image_url || "/placeholder.svg"}
                            alt={`${vpn.name} VPN`}
                            width={150}
                            height={150}
                            className="rounded-md"
                          />
                        </div>
                      )}
                      {vpn.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <div>{feature}</div>
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <Tabs defaultValue="monthly" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="3days">3 Days</TabsTrigger>
                          <TabsTrigger value="weekly">Weekly</TabsTrigger>
                          <TabsTrigger value="2weeks">2 Weeks</TabsTrigger>
                          <TabsTrigger value="monthly">Monthly</TabsTrigger>
                        </TabsList>
                        <TabsContent value="3days" className="mt-2">
                          <Button className="w-full" onClick={() => handlePayment(vpn, "3days", 50)}>
                            Buy Now - @50
                          </Button>
                        </TabsContent>
                        <TabsContent value="weekly" className="mt-2">
                          <Button className="w-full" onClick={() => handlePayment(vpn, "weekly", 100)}>
                            Buy Now - @100
                          </Button>
                        </TabsContent>
                        <TabsContent value="2weeks" className="mt-2">
                          <Button className="w-full" onClick={() => handlePayment(vpn, "2weeks", 200)}>
                            Buy Now - @200
                          </Button>
                        </TabsContent>
                        <TabsContent value="monthly" className="mt-2">
                          <Button className="w-full" onClick={() => handlePayment(vpn, "monthly", 300)}>
                            Buy Now - @300
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p>No VPN products available at the moment. Please check back later.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Coming Soon</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our developers are working on configurations for these VPN applications
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {COMING_SOON_VPNS.map((vpn) => (
                <Card key={vpn.name} className="bg-background/50">
                  <CardHeader>
                    <CardTitle>{vpn.name}</CardTitle>
                    <CardDescription>{vpn.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {vpn.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 text-sm">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <div>{feature}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" disabled className="w-full">
                      Coming Soon
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">Frequently Asked Questions</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Answers to common questions about our services
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              {[
                {
                  question: "How do I use the VPN configurations?",
                  answer:
                    "After purchase, you'll receive a configuration file that you can import into your chosen VPN application. We provide detailed setup instructions for each application.",
                },
                {
                  question: "Do you offer refunds?",
                  answer:
                    "We offer a 24-hour money-back guarantee if you're not satisfied with our service. Please contact our customer support team for assistance.",
                },
                {
                  question: "How often are configurations updated?",
                  answer:
                    "We regularly update our configurations to ensure optimal performance. Updates are typically released weekly or as needed based on network changes.",
                },
                {
                  question: "Can I use the same configuration on multiple devices?",
                  answer:
                    "Each configuration is licensed for use on one device at a time. If you need to use the service on multiple devices simultaneously, you'll need to purchase additional configurations.",
                },
                {
                  question: "What payment methods do you accept?",
                  answer:
                    "We accept mobile money transfers, including M-Pesa, as well as bank transfers. Contact our customer support for payment details.",
                },
                {
                  question: "How do I get technical support?",
                  answer:
                    "Our customer support team is available 24/7. You can reach us through our contact page, social media channels, or email.",
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="flex justify-center">
              <Button className="gap-1" asChild>
                <Link href="/support">
                  <ArrowRight className="h-4 w-4" />
                  Contact Support for More Questions
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Skynet</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} Skynet. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>

      {/* Payment Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              {selectedVpn && selectedPlan ? (
                <>
                  {selectedVpn.name} -{" "}
                  {selectedPlan.duration === "3days"
                    ? "3 Days"
                    : selectedPlan.duration === "weekly"
                      ? "Weekly"
                      : selectedPlan.duration === "2weeks"
                        ? "2 Weeks"
                        : "Monthly"}{" "}
                  (KSH {selectedPlan.price})
                </>
              ) : (
                "Enter your payment details"
              )}
            </DialogDescription>
          </DialogHeader>

          {paymentError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{paymentError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="col-span-4">
                Phone Number (for M-Pesa)
              </Label>
              <Input
                id="phone"
                placeholder="e.g. 254712345678"
                className="col-span-4"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-sm text-muted-foreground col-span-4">
                Enter your phone number in international format (e.g., 254712345678) for M-Pesa STK push.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processPayment} disabled={processingPayment}>
              {processingPayment ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay Now"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

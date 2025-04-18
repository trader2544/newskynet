"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CheckCircle, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type VpnProduct = {
  id: string
  name: string
  description: string
  features: string[]
  image_url: string
}

type SubscriptionPlan = {
  id: string
  duration: string
  price: number
}

export default function PurchasePage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<VpnProduct | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true)

      try {
        // Check if user is logged in
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          router.push(`/login?redirect=/purchase/${params.id}`)
          return
        }

        // Fetch product details
        const { data: productData, error: productError } = await supabase
          .from("vpn_products")
          .select("*")
          .eq("id", params.id)
          .single()

        if (productError) throw productError

        // Fetch subscription plans
        const { data: plansData, error: plansError } = await supabase
          .from("subscription_plans")
          .select("*")
          .eq("vpn_id", params.id)
          .order("price", { ascending: true })

        if (plansError) throw plansError

        setProduct({
          ...productData,
          features: Array.isArray(productData.features)
            ? productData.features
            : JSON.parse(productData.features || "[]"),
        })
        setPlans(plansData)

        if (plansData.length > 0) {
          setSelectedPlan(plansData[0].id)
        }
      } catch (error: any) {
        console.error("Error fetching product details:", error)
        setError(error.message || "Failed to load product details")
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [params.id, router, supabase])

  const handlePurchase = async () => {
    if (!selectedPlan) {
      setError("Please select a subscription plan")
      return
    }

    setPurchasing(true)
    setError(null)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      // Get selected plan details
      const plan = plans.find((p) => p.id === selectedPlan)

      if (!plan) {
        throw new Error("Selected plan not found")
      }

      // Calculate expiry date based on plan duration
      const expiresAt = new Date()
      switch (plan.duration) {
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
        default:
          expiresAt.setMonth(expiresAt.getMonth() + 1)
      }

      // Create purchase record
      const { error: purchaseError } = await supabase.from("purchases").insert({
        user_id: session.user.id,
        vpn_id: params.id,
        plan_id: selectedPlan,
        status: "pending",
        expires_at: expiresAt.toISOString(),
      })

      if (purchaseError) throw purchaseError

      setSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 2000)
    } catch (error: any) {
      console.error("Error making purchase:", error)
      setError(error.message || "Failed to complete purchase")
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Product Not Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p>The requested VPN product could not be found.</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <a href="/pricing">Browse Available VPNs</a>
              </Button>
            </CardFooter>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {success ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Purchase Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-primary" />
              </div>
              <p className="mb-4">
                Thank you for your purchase. Your configuration will be available in your dashboard once it's ready.
              </p>
              <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <p className="text-muted-foreground mb-6">{product.description}</p>

              <div className="flex justify-center mb-6">
                <Image
                  src={
                    product.image_url ||
                    (product.name === "HTTP Custom"
                      ? "/images/hc.png"
                      : product.name === "HTTP Injector"
                        ? "/images/hi.png"
                        : product.name === "Dark Tunnel"
                          ? "/images/dark.png"
                          : "/placeholder.svg")
                  }
                  alt={product.name}
                  width={200}
                  height={200}
                  className="rounded-md"
                />
              </div>

              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <ul className="space-y-2 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Complete Your Purchase</CardTitle>
                  <CardDescription>Select a subscription plan to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  {error && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Select Subscription Period</h3>
                      <Tabs
                        defaultValue={plans.length > 0 ? plans[0].id : undefined}
                        onValueChange={setSelectedPlan}
                        value={selectedPlan || undefined}
                      >
                        <TabsList className="grid grid-cols-4">
                          {plans.map((plan) => (
                            <TabsTrigger key={plan.id} value={plan.id}>
                              {plan.duration === "3days"
                                ? "3 Days"
                                : plan.duration === "weekly"
                                  ? "Weekly"
                                  : plan.duration === "2weeks"
                                    ? "2 Weeks"
                                    : "Monthly"}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {plans.map((plan) => (
                          <TabsContent key={plan.id} value={plan.id} className="mt-4">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  {plan.duration === "3days"
                                    ? "3 Days"
                                    : plan.duration === "weekly"
                                      ? "Weekly"
                                      : plan.duration === "2weeks"
                                        ? "2 Weeks"
                                        : "Monthly"}{" "}
                                  Subscription
                                </CardTitle>
                                <CardDescription>KSH {plan.price}</CardDescription>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">
                                  {plan.duration === "3days"
                                    ? "Perfect for a quick trial or weekend use."
                                    : plan.duration === "weekly"
                                      ? "Great for short-term needs."
                                      : plan.duration === "2weeks"
                                        ? "Ideal for extended use."
                                        : "Our most popular option for regular users."}
                                </p>
                              </CardContent>
                            </Card>
                          </TabsContent>
                        ))}
                      </Tabs>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Payment Method</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        For demo purposes, we'll simulate the payment process. In a real application, you would
                        integrate with a payment provider here.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handlePurchase} disabled={purchasing || !selectedPlan}>
                    {purchasing
                      ? "Processing..."
                      : `Complete Purchase - KSH ${selectedPlan ? plans.find((p) => p.id === selectedPlan)?.price || 0 : 0}`}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

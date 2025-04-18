"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Download, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSupabaseBrowserClient } from "@/lib/supabase"

type Purchase = {
  id: string
  vpn_name: string
  duration: string
  price: number
  status: string
  config_file_url: string | null
  purchased_at: string
  expires_at: string | null
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      setUser(session.user)

      // Fetch user's purchases
      const { data, error } = await supabase
        .from("purchases")
        .select(`
          id,
          status,
          config_file_url,
          purchased_at,
          expires_at,
          vpn_products(name),
          subscription_plans(duration, price)
        `)
        .eq("user_id", session.user.id)
        .order("purchased_at", { ascending: false })

      if (data) {
        const formattedPurchases = data.map((item: any) => ({
          id: item.id,
          vpn_name: item.vpn_products?.name || "Unknown VPN",
          duration: item.subscription_plans?.duration || "Unknown",
          price: item.subscription_plans?.price || 0,
          status: item.status,
          config_file_url: item.config_file_url,
          purchased_at: new Date(item.purchased_at).toLocaleDateString(),
          expires_at: item.expires_at ? new Date(item.expires_at).toLocaleDateString() : null,
        }))

        setPurchases(formattedPurchases)
      }

      setLoading(false)
    }

    checkAuth()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center">
          <p>Loading...</p>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard</h1>
            <p className="text-muted-foreground">Manage your VPN configurations and account</p>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Configurations</TabsTrigger>
              <TabsTrigger value="history">Purchase History</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {purchases.filter((p) => p.status === "active").length > 0 ? (
                  purchases
                    .filter((p) => p.status === "active")
                    .map((purchase) => (
                      <Card key={purchase.id}>
                        <CardHeader>
                          <CardTitle>{purchase.vpn_name}</CardTitle>
                          <CardDescription>{purchase.duration} subscription</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Expires: {purchase.expires_at || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-primary" />
                            <span className="text-sm">Status: {purchase.status}</span>
                          </div>
                        </CardContent>
                        <CardFooter>
                          {purchase.config_file_url ? (
                            <Button className="w-full" variant="outline" asChild>
                              <a href={purchase.config_file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="mr-2 h-4 w-4" />
                                Download Config
                              </a>
                            </Button>
                          ) : (
                            <Button className="w-full" disabled>
                              Awaiting Configuration
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No active configurations</h3>
                    <p className="text-muted-foreground mb-4">You don't have any active VPN configurations yet.</p>
                    <Button asChild>
                      <a href="/pricing">Browse VPN Packages</a>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              {purchases.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>VPN</div>
                    <div>Plan</div>
                    <div>Date</div>
                    <div>Status</div>
                    <div>Action</div>
                  </div>
                  {purchases.map((purchase) => (
                    <div key={purchase.id} className="grid grid-cols-5 p-4 border-b last:border-0">
                      <div>{purchase.vpn_name}</div>
                      <div>
                        {purchase.duration} (KSH {purchase.price})
                      </div>
                      <div>{purchase.purchased_at}</div>
                      <div>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            purchase.status === "active"
                              ? "bg-green-100 text-green-800"
                              : purchase.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </div>
                      <div>
                        {purchase.config_file_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={purchase.config_file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-3 w-3" />
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No purchase history</h3>
                  <p className="text-muted-foreground mb-4">You haven't purchased any VPN configurations yet.</p>
                  <Button asChild>
                    <a href="/pricing">Browse VPN Packages</a>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="account" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details and hardware ID</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Email</p>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Hardware ID (HWID)</p>
                    <p className="text-muted-foreground">{user?.hwid || "Not set"}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button>Update Account Information</Button>
                  <Button variant="outline" asChild>
                    <a href="/pricing">Browse VPN Packages</a>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

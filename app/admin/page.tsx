"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Upload,
  Users,
  Package,
  AlertCircle,
  BarChart,
  PieChart,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  CheckCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { checkAdminAccess } from "@/lib/admin-auth"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Purchase = {
  id: string
  user_email: string
  user_hwid: string
  vpn_name: string
  duration: string
  price: number
  status: string
  config_file_url: string | null
  purchased_at: string
  expires_at: string | null
}

type User = {
  id: string
  email: string
  hwid: string
  created_at: string
  is_admin?: boolean
}

type AnalyticsData = {
  totalUsers: number
  totalPurchases: number
  pendingConfigs: number
  activeSubs: number
  revenue: number
  usersByMonth: { month: string; count: number }[]
  purchasesByVpn: { vpn: string; count: number }[]
  purchasesByPlan: { plan: string; count: number }[]
}

export default function AdminDashboardPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedPurchase, setSelectedPurchase] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [configFile, setConfigFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    totalPurchases: 0,
    pendingConfigs: 0,
    activeSubs: 0,
    revenue: 0,
    usersByMonth: [],
    purchasesByVpn: [],
    purchasesByPlan: [],
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
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

      // Check if user is admin
      const isAdmin = await checkAdminAccess()
      setIsAdmin(isAdmin)

      if (!isAdmin) {
        router.push("/dashboard")
        return
      }

      await fetchData()
    }

    checkAuth()
  }, [router, supabase])

  const fetchData = async () => {
    setLoading(true)

    try {
      // Fetch all purchases with user info
      const { data: purchasesData } = await supabase
        .from("purchases")
        .select(`
          id,
          status,
          config_file_url,
          purchased_at,
          expires_at,
          user_id,
          vpn_products(id, name),
          subscription_plans(duration, price)
        `)
        .order("purchased_at", { ascending: false })

      if (purchasesData) {
        // Get user details for each purchase
        const purchasesWithUserInfo = await Promise.all(
          purchasesData.map(async (purchase: any) => {
            const { data: userData } = await supabase
              .from("profiles")
              .select("email, hwid")
              .eq("id", purchase.user_id)
              .single()

            return {
              id: purchase.id,
              user_id: purchase.user_id,
              user_email: userData?.email || "Unknown",
              user_hwid: userData?.hwid || "Not set",
              vpn_name: purchase.vpn_products?.name || "Unknown VPN",
              vpn_id: purchase.vpn_products?.id,
              duration: purchase.subscription_plans?.duration || "Unknown",
              price: purchase.subscription_plans?.price || 0,
              status: purchase.status,
              config_file_url: purchase.config_file_url,
              purchased_at: new Date(purchase.purchased_at).toLocaleDateString(),
              purchased_at_raw: purchase.purchased_at,
              expires_at: purchase.expires_at ? new Date(purchase.expires_at).toLocaleDateString() : null,
            }
          }),
        )

        setPurchases(purchasesWithUserInfo)

        // Calculate analytics
        const now = new Date()
        const activeSubscriptions = purchasesWithUserInfo.filter(
          (p) => p.status === "active" && p.expires_at && new Date(p.expires_at) > now,
        )

        const totalRevenue = purchasesWithUserInfo.reduce((sum, p) => sum + p.price, 0)

        // Group purchases by month
        const purchasesByMonth: Record<string, number> = {}
        purchasesWithUserInfo.forEach((p) => {
          const date = new Date(p.purchased_at_raw)
          const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
          purchasesByMonth[monthYear] = (purchasesByMonth[monthYear] || 0) + 1
        })

        // Group purchases by VPN
        const vpnCounts: Record<string, number> = {}
        purchasesWithUserInfo.forEach((p) => {
          vpnCounts[p.vpn_name] = (vpnCounts[p.vpn_name] || 0) + 1
        })

        // Group purchases by plan
        const planCounts: Record<string, number> = {}
        purchasesWithUserInfo.forEach((p) => {
          planCounts[p.duration] = (planCounts[p.duration] || 0) + 1
        })

        // Format for charts
        const usersByMonthData = Object.entries(purchasesByMonth)
          .map(([month, count]) => ({
            month,
            count,
          }))
          .sort((a, b) => {
            const [aMonth, aYear] = a.month.split("/")
            const [bMonth, bYear] = b.month.split("/")
            return (
              new Date(Number(aYear), Number(aMonth) - 1).getTime() -
              new Date(Number(bYear), Number(bMonth) - 1).getTime()
            )
          })

        const purchasesByVpnData = Object.entries(vpnCounts).map(([vpn, count]) => ({
          vpn,
          count,
        }))

        const purchasesByPlanData = Object.entries(planCounts).map(([plan, count]) => ({
          plan,
          count,
        }))

        setAnalytics({
          totalUsers: new Set(purchasesWithUserInfo.map((p) => p.user_id)).size,
          totalPurchases: purchasesWithUserInfo.length,
          pendingConfigs: purchasesWithUserInfo.filter((p) => p.status === "pending").length,
          activeSubs: activeSubscriptions.length,
          revenue: totalRevenue,
          usersByMonth: usersByMonthData,
          purchasesByVpn: purchasesByVpnData,
          purchasesByPlan: purchasesByPlanData,
        })
      }

      // Fetch all users
      const { data: usersData } = await supabase
        .from("profiles")
        .select("id, email, hwid, created_at, is_admin")
        .order("created_at", { ascending: false })

      if (usersData) {
        setUsers(
          usersData.map((user: any) => ({
            id: user.id,
            email: user.email,
            hwid: user.hwid || "Not set",
            created_at: new Date(user.created_at).toLocaleDateString(),
            is_admin: user.is_admin || false,
          })),
        )
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setConfigFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPurchase || !configFile) {
      setUploadError("Please select a purchase and upload a file")
      return
    }

    setUploadError(null)
    setUploadSuccess(false)

    try {
      // Upload file to Supabase Storage
      const fileName = `${selectedPurchase}_${configFile.name}`
      const { data, error } = await supabase.storage.from("config-files").upload(fileName, configFile, {
        upsert: true,
      })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage.from("config-files").getPublicUrl(fileName)

      // Update purchase with file URL
      const { error: updateError } = await supabase
        .from("purchases")
        .update({
          config_file_url: urlData.publicUrl,
          status: "active",
        })
        .eq("id", selectedPurchase)

      if (updateError) throw updateError

      setUploadSuccess(true)

      // Refresh data
      await fetchData()

      // Reset form
      setSelectedPurchase(null)
      setConfigFile(null)
    } catch (error: any) {
      setUploadError(error.message || "Error uploading file")
    }
  }

  const handleReplaceFile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser || !configFile) {
      setUploadError("Please select a user and upload a file")
      return
    }

    setUploadError(null)
    setUploadSuccess(false)

    try {
      // Find active purchases for this user
      const userPurchases = purchases.filter(
        (p) =>
          p.user_id === selectedUser && p.status === "active" && p.expires_at && new Date(p.expires_at) > new Date(),
      )

      if (userPurchases.length === 0) {
        throw new Error("No active purchases found for this user")
      }

      // Use the most recent purchase
      const purchase = userPurchases.sort(
        (a, b) => new Date(b.purchased_at_raw).getTime() - new Date(a.purchased_at_raw).getTime(),
      )[0]

      // Upload file to Supabase Storage
      const fileName = `${purchase.id}_${configFile.name}`
      const { data, error } = await supabase.storage.from("config-files").upload(fileName, configFile, {
        upsert: true,
      })

      if (error) throw error

      // Get public URL
      const { data: urlData } = supabase.storage.from("config-files").getPublicUrl(fileName)

      // Update purchase with file URL
      const { error: updateError } = await supabase
        .from("purchases")
        .update({
          config_file_url: urlData.publicUrl,
        })
        .eq("id", purchase.id)

      if (updateError) throw updateError

      setUploadSuccess(true)

      // Refresh data
      await fetchData()

      // Reset form
      setSelectedUser(null)
      setConfigFile(null)
    } catch (error: any) {
      setUploadError(error.message || "Error replacing file")
    }
  }

  const filteredPurchases = purchases.filter((purchase) => {
    const matchesSearch =
      purchase.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.vpn_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      purchase.user_hwid.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === "all" || purchase.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.hwid.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to access the admin dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <a href="/dashboard">Go to User Dashboard</a>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-8">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage users, purchases, and configurations</p>
            </div>
            <Button onClick={fetchData} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{users.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Package className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{purchases.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Active Subscriptions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">{analytics.activeSubs}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart className="h-8 w-8 text-primary mr-2" />
                  <span className="text-3xl font-bold">KSH {analytics.revenue}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="analytics">
            <TabsList className="grid grid-cols-4 md:w-auto w-full">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="upload">Upload Config</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="mt-4 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      User Growth by Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-end gap-2">
                      {analytics.usersByMonth.map((item, index) => (
                        <div key={index} className="relative flex-1 flex flex-col items-center">
                          <div
                            className="w-full bg-primary rounded-t-md"
                            style={{
                              height: `${(item.count / Math.max(...analytics.usersByMonth.map((i) => i.count))) * 200}px`,
                            }}
                          ></div>
                          <span className="text-xs mt-2 text-muted-foreground">{item.month}</span>
                          <span className="text-xs font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Purchases by VPN Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="grid grid-cols-1 gap-4 w-full">
                        {analytics.purchasesByVpn.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-32 text-sm">{item.vpn}</div>
                            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{
                                  width: `${(item.count / Math.max(...analytics.purchasesByVpn.map((i) => i.count))) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-10 text-sm font-medium text-right">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart className="h-5 w-5 text-primary" />
                      Purchases by Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 flex items-center justify-center">
                      <div className="grid grid-cols-1 gap-4 w-full">
                        {analytics.purchasesByPlan.map((item, index) => (
                          <div key={index} className="flex items-center gap-4">
                            <div className="w-32 text-sm">
                              {item.plan === "3days"
                                ? "3 Days"
                                : item.plan === "weekly"
                                  ? "Weekly"
                                  : item.plan === "2weeks"
                                    ? "2 Weeks"
                                    : "Monthly"}
                            </div>
                            <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{
                                  width: `${(item.count / Math.max(...analytics.purchasesByPlan.map((i) => i.count))) * 100}%`,
                                }}
                              ></div>
                            </div>
                            <div className="w-10 text-sm font-medium text-right">{item.count}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      Pending Configurations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 overflow-auto">
                      {purchases.filter((p) => p.status === "pending").length > 0 ? (
                        <div className="space-y-4">
                          {purchases
                            .filter((p) => p.status === "pending")
                            .map((purchase) => (
                              <div key={purchase.id} className="flex items-center justify-between border-b pb-2">
                                <div>
                                  <p className="font-medium">{purchase.user_email}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {purchase.vpn_name} - {purchase.duration}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Purchased: {purchase.purchased_at}</p>
                                </div>
                                <Button size="sm" onClick={() => setSelectedPurchase(purchase.id)}>
                                  Upload Config
                                </Button>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <CheckCircle className="h-12 w-12 text-primary mb-4" />
                          <p className="text-muted-foreground">No pending configurations</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users by email or HWID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-5 p-4 font-medium border-b">
                    <div>Email</div>
                    <div>HWID</div>
                    <div>Joined</div>
                    <div>Purchases</div>
                    <div>Actions</div>
                  </div>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div key={user.id} className="grid grid-cols-5 p-4 border-b last:border-0">
                        <div className="truncate">
                          {user.email}
                          {user.is_admin && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="truncate">{user.hwid}</div>
                        <div>{user.created_at}</div>
                        <div>{purchases.filter((p) => p.user_id === user.id).length}</div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedUser(user.id)}>
                            Replace Config
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No users found</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="purchases" className="mt-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search purchases by email, VPN, or HWID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border">
                  <div className="grid grid-cols-6 p-4 font-medium border-b">
                    <div>User</div>
                    <div>HWID</div>
                    <div>VPN</div>
                    <div>Plan</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {filteredPurchases.length > 0 ? (
                    filteredPurchases.map((purchase) => (
                      <div key={purchase.id} className="grid grid-cols-6 p-4 border-b last:border-0">
                        <div className="truncate">{purchase.user_email}</div>
                        <div className="truncate">{purchase.user_hwid}</div>
                        <div>{purchase.vpn_name}</div>
                        <div>
                          {purchase.duration} (KSH {purchase.price})
                        </div>
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
                        <div className="flex gap-2">
                          {purchase.config_file_url ? (
                            <>
                              <Button size="sm" variant="outline" asChild>
                                <a href={purchase.config_file_url} target="_blank" rel="noopener noreferrer">
                                  <Download className="h-3 w-3 mr-1" />
                                  Download
                                </a>
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setSelectedPurchase(purchase.id)}>
                                Replace
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" onClick={() => setSelectedPurchase(purchase.id)}>
                              Upload Config
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">No purchases found</div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="upload" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Configuration File</CardTitle>
                    <CardDescription>Select a purchase and upload the configuration file for the user</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {uploadError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertDescription>{uploadError}</AlertDescription>
                      </Alert>
                    )}

                    {uploadSuccess && (
                      <Alert className="mb-4">
                        <AlertDescription>Configuration file uploaded successfully!</AlertDescription>
                      </Alert>
                    )}

                    <form onSubmit={handleUpload} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="purchase">Select Purchase</Label>
                        <select
                          id="purchase"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedPurchase || ""}
                          onChange={(e) => setSelectedPurchase(e.target.value)}
                          required
                        >
                          <option value="">Select a purchase</option>
                          {purchases
                            .filter((p) => p.status === "pending")
                            .map((purchase) => (
                              <option key={purchase.id} value={purchase.id}>
                                {purchase.user_email} - {purchase.vpn_name} ({purchase.duration})
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="config-file">Configuration File</Label>
                        <Input id="config-file" type="file" onChange={handleFileChange} required />
                      </div>

                      <Button type="submit" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Configuration
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Replace User Configuration</CardTitle>
                    <CardDescription>
                      Replace a configuration file for a user with an active subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleReplaceFile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="user">Select User</Label>
                        <select
                          id="user"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={selectedUser || ""}
                          onChange={(e) => setSelectedUser(e.target.value)}
                          required
                        >
                          <option value="">Select a user</option>
                          {users
                            .map((user) => {
                              // Check if user has active purchases
                              const hasActivePurchases = purchases.some(
                                (p) =>
                                  p.user_id === user.id &&
                                  p.status === "active" &&
                                  p.expires_at &&
                                  new Date(p.expires_at) > new Date(),
                              )

                              if (hasActivePurchases) {
                                return (
                                  <option key={user.id} value={user.id}>
                                    {user.email}
                                  </option>
                                )
                              }
                              return null
                            })
                            .filter(Boolean)}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="replacement-file">New Configuration File</Label>
                        <Input id="replacement-file" type="file" onChange={handleFileChange} required />
                      </div>

                      <Button type="submit" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Replace Configuration
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

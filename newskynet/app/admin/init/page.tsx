"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
import { initializeDatabase } from "@/app/actions/init-database"
import { checkAdminAccess } from "@/lib/admin-auth"
import { useRouter } from "next/navigation"
import { Shield, Database, CheckCircle } from "lucide-react"

export default function InitDatabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true)
      const isAdmin = await checkAdminAccess()
      setIsAdmin(isAdmin)

      if (!isAdmin) {
        router.push("/login")
      }
      setCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  const handleInitDatabase = async () => {
    setLoading(true)
    try {
      const result = await initializeDatabase()
      setResult(result)
    } catch (error: any) {
      setResult({ success: false, message: error.message || "An error occurred" })
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <p>Checking authorization...</p>
        </main>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-destructive" />
                Access Denied
              </CardTitle>
              <CardDescription>
                You don't have permission to access this page. Please log in with an admin account.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => router.push("/login")} className="w-full">
                Go to Login
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
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <CardTitle>Initialize Database</CardTitle>
            </div>
            <CardDescription>
              This will create the necessary tables and initial data for the Skynet VPN application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result && (
              <Alert variant={result.success ? "default" : "destructive"} className="mb-4">
                {result.success && <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">This process will:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                <li>Create the profiles table to store user information</li>
                <li>Create the vpn_products table to store VPN configurations</li>
                <li>Create the subscription_plans table for pricing options</li>
                <li>Create the purchases table to track user purchases</li>
                <li>Add initial data for the available VPN products</li>
              </ul>
              <p className="text-sm font-medium text-amber-600">
                Note: This should only be done once when setting up the application.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleInitDatabase} disabled={loading || result?.success === true} className="w-full">
              {loading ? "Initializing..." : result?.success ? "Database Initialized" : "Initialize Database"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

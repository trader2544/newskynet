"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Shield, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { SiteHeader } from "@/components/site-header"

// This is a secure token that should be changed in a real application
// In production, this should be stored in an environment variable
const ADMIN_REGISTRATION_TOKEN = "skynet-admin-secure-token-2024"

export default function AdminRegisterPage() {
  const [email, setEmail] = useState("patrickkamande10455@gmail.com")
  const [password, setPassword] = useState("37738722")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [validToken, setValidToken] = useState(false)
  const [checkingToken, setCheckingToken] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Check if token is valid
    const token = searchParams.get("token")
    if (token === ADMIN_REGISTRATION_TOKEN) {
      setValidToken(true)
    }
    setCheckingToken(false)
  }, [searchParams])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      // Register the admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Create profile with admin flag
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: authData.user.id,
            email,
            is_admin: true,
          },
        ])

        if (profileError) throw profileError

        // Update admin auth middleware to check for this flag
        await supabase.auth.signOut()
        router.push("/admin/register/success")
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during registration")
    } finally {
      setLoading(false)
    }
  }

  if (checkingToken) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <p>Validating token...</p>
        </main>
      </div>
    )
  }

  if (!validToken) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center text-destructive">Invalid Token</CardTitle>
              <CardDescription className="text-center">
                You need a valid admin registration token to access this page.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="secondary" onClick={() => router.push("/")} className="w-full">
                Go to Homepage
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
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Create Admin Account</CardTitle>
            <CardDescription className="text-center">Enter your details to create an admin account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@skynet.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Alert className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Make sure to remember this password. You will use it to access the admin dashboard.
                  </AlertDescription>
                </Alert>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating admin account..." : "Create admin account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

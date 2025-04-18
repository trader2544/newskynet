"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Shield, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SiteHeader } from "@/components/site-header"
import { authenticateAdmin } from "@/lib/admin-auth"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("patrickkamande10455@gmail.com")
  const [password, setPassword] = useState("37738722")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await authenticateAdmin(email, password)

      if (!result.success) {
        throw new Error(result.error || "Invalid admin credentials")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
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
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login to Admin Dashboard"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="flex items-center text-sm text-muted-foreground">
              <Lock className="h-3 w-3 mr-1" />
              Secure admin access only
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

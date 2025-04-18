"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AdminRegisterSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Admin Account Created!</CardTitle>
            <CardDescription className="text-center">Your admin account has been successfully created.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p>You can now log in with your admin credentials to access the admin dashboard.</p>
            <p className="text-sm text-muted-foreground">
              Remember to initialize the database after logging in if you haven't already.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

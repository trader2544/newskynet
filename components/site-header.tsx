"use client"

import Link from "next/link"
import { Shield } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/mobile-nav"
import { getSupabaseBrowserClient } from "@/lib/supabase"
import { useEffect, useState } from "react"

export function SiteHeader() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth error:", error)
          setIsLoggedIn(false)
        } else {
          setIsLoggedIn(!!data.session)
        }
      } catch (err) {
        console.error("Failed to check auth status:", err)
        setIsLoggedIn(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Mobile Logo and Title */}
        <div className="flex items-center md:hidden">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="font-bold">Skynet</span>
          </Link>
        </div>

        {/* Desktop Logo and Navigation */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">Skynet</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-foreground/80 ${pathname === "/" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className={`transition-colors hover:text-foreground/80 ${pathname === "/pricing" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`transition-colors hover:text-foreground/80 ${pathname === "/about" ? "text-foreground" : "text-muted-foreground"}`}
            >
              About
            </Link>
            <Link
              href="/support"
              className={`transition-colors hover:text-foreground/80 ${pathname === "/support" ? "text-foreground" : "text-muted-foreground"}`}
            >
              Support
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden ml-auto">
          <MobileNav />
        </div>

        {/* Desktop Auth Buttons */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:flex hidden">
          <nav className="flex items-center">
            {isLoading ? (
              <div className="h-9 w-16 bg-muted rounded animate-pulse"></div>
            ) : isLoggedIn ? (
              <>
                <Link href="/dashboard" className="mr-2">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Button onClick={handleLogout}>Log out</Button>
              </>
            ) : (
              <>
                <Link href="/login" className="mr-2">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

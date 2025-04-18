"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Tag, LayoutDashboard, User } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export function MobileBottomNav() {
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

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/pricing", label: "Pricing", icon: <Tag className="h-5 w-5" /> },
    ...(isLoggedIn ? [{ href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> }] : []),
    {
      href: isLoggedIn ? "/dashboard" : "/login",
      label: isLoggedIn ? "Account" : "Login",
      icon: <User className="h-5 w-5" />,
    },
  ]

  if (isLoading) {
    return (
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden">
        <div className="grid h-full grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-muted animate-pulse"></div>
              <div className="h-3 w-12 mt-1 rounded bg-muted animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden">
      <div className="grid h-full grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center ${
              pathname === item.href ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

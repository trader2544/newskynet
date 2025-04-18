"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, Shield, Home, Tag, Info, HeadphonesIcon, LogOut, LogIn, UserPlus, LayoutDashboard } from "lucide-react"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { getSupabaseBrowserClient } from "@/lib/supabase"

export function MobileNav() {
  const [open, setOpen] = useState(false)
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
      setOpen(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navItems = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/pricing", label: "Pricing", icon: <Tag className="h-5 w-5" /> },
    { href: "/about", label: "About", icon: <Info className="h-5 w-5" /> },
    { href: "/support", label: "Support", icon: <HeadphonesIcon className="h-5 w-5" /> },
  ]

  const authItems = isLoading
    ? []
    : isLoggedIn
      ? [
          { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
          { onClick: handleLogout, label: "Log out", icon: <LogOut className="h-5 w-5" /> },
        ]
      : [
          { href: "/login", label: "Log in", icon: <LogIn className="h-5 w-5" /> },
          { href: "/register", label: "Sign up", icon: <UserPlus className="h-5 w-5" /> },
        ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0">
        <div className="border-b p-4 flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Skynet</span>
        </div>

        <div className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-base transition-all hover:bg-accent ${
                  pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t p-4">
          <div className="grid gap-2">
            {isLoading ? (
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            ) : (
              authItems.map((item, index) =>
                item.onClick ? (
                  <Button
                    key={item.label}
                    variant={index === authItems.length - 1 ? "default" : "outline"}
                    className="justify-start gap-2"
                    onClick={item.onClick}
                  >
                    {item.icon}
                    {item.label}
                  </Button>
                ) : (
                  <Button
                    key={item.label}
                    variant={index === authItems.length - 1 ? "default" : "outline"}
                    className="justify-start gap-2"
                    asChild
                  >
                    <Link href={item.href} onClick={() => setOpen(false)}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </Button>
                ),
              )
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

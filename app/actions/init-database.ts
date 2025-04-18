"use server"

import { createServerClient } from "@/lib/supabase"

export async function initializeDatabase() {
  const supabase = createServerClient()

  try {
    // Create profiles table with is_admin column
    const { error: profilesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID REFERENCES auth.users ON DELETE CASCADE,
        email TEXT,
        username TEXT,
        hwid TEXT,
        is_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        PRIMARY KEY (id)
      )
    `)

    if (profilesError) throw profilesError

    // Create VPN products table
    const { error: vpnProductsError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS vpn_products (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        features JSONB,
        image_url TEXT,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      )
    `)

    if (vpnProductsError) throw vpnProductsError

    // Create subscription plans table
    const { error: plansError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        vpn_id UUID REFERENCES vpn_products(id) ON DELETE CASCADE,
        duration TEXT NOT NULL,
        price INTEGER NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
      )
    `)

    if (plansError) throw plansError

    // Create purchases table
    const { error: purchasesError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID REFERENCES auth.users ON DELETE CASCADE,
        vpn_id UUID REFERENCES vpn_products(id),
        plan_id UUID REFERENCES subscription_plans(id),
        status TEXT DEFAULT 'pending',
        config_file_url TEXT,
        purchased_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
        expires_at TIMESTAMP WITH TIME ZONE
      )
    `)

    if (purchasesError) throw purchasesError

    // Insert initial data for VPN products
    const { error: insertVpnError } = await supabase.from("vpn_products").insert([
      {
        name: "HTTP Custom",
        description: "Fast and reliable connectivity",
        features: [
          "Optimized for all networks",
          "Low latency connection",
          "Regular updates",
          "Technical support included",
        ],
        image_url: "/images/hc.png",
        is_available: true,
      },
      {
        name: "HTTP Injector",
        description: "Powerful and versatile",
        features: [
          "Advanced configuration options",
          "Optimized for streaming",
          "Technical support included",
          "Works on restricted networks",
        ],
        image_url: "/images/hi.png",
        is_available: true,
      },
      {
        name: "Dark Tunnel",
        description: "Secure and anonymous",
        features: [
          "Enhanced privacy features",
          "Works on restricted networks",
          "Optimized for gaming",
          "Regular updates",
        ],
        image_url: "/images/dark.png",
        is_available: true,
      },
    ])

    if (insertVpnError) throw insertVpnError

    // Get VPN product IDs
    const { data: vpnProducts, error: getVpnError } = await supabase.from("vpn_products").select("id, name")

    if (getVpnError) throw getVpnError

    // Insert subscription plans for each VPN product
    for (const vpn of vpnProducts) {
      const { error: insertPlansError } = await supabase.from("subscription_plans").insert([
        { vpn_id: vpn.id, duration: "3days", price: 50 },
        { vpn_id: vpn.id, duration: "weekly", price: 100 },
        { vpn_id: vpn.id, duration: "2weeks", price: 200 },
        { vpn_id: vpn.id, duration: "monthly", price: 300 },
      ])

      if (insertPlansError) throw insertPlansError
    }

    return { success: true, message: "Database initialized successfully" }
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return { success: false, message: error.message || "Failed to initialize database" }
  }
}

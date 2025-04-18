import { createClient } from "@supabase/supabase-js"

// Supabase URL and anon key - these should be available as environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vyrbeqdhxeowxvdbmdkp.supabase.co"
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5cmJlcWRoeGVvd3h2ZGJtZGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNDA0NzgsImV4cCI6MjA1OTgxNjQ3OH0.NWgVMTh8MD4880C8ZJliH81-X1eY92fXjLhUh_92BjM"

// Create a singleton instance for the browser
let browserClient: ReturnType<typeof createClient> | null = null

export const getSupabaseBrowserClient = () => {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return browserClient
}

// Server-side client (for server components and server actions)
export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vyrbeqdhxeowxvdbmdkp.supabase.co"
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

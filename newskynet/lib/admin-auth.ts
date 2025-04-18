import { getSupabaseBrowserClient } from "@/lib/supabase"

// Admin credentials
const ADMIN_EMAIL = "patrickkamande10455@gmail.com"
const ADMIN_PASSWORD = "37738722"

export async function checkAdminAccess() {
  const supabase = getSupabaseBrowserClient()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return false
  }

  // Check if the email matches our admin email
  if (data.session.user.email === ADMIN_EMAIL) {
    return true
  }

  // Fallback to checking the database for admin flag
  try {
    const { data: profileData } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", data.session.user.id)
      .single()

    return profileData?.is_admin === true
  } catch (error) {
    return false
  }
}

// Function to directly authenticate admin
export async function authenticateAdmin(email: string, password: string) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const supabase = getSupabaseBrowserClient()

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      return { success: true, user: data.user }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return { success: false, error: "Invalid admin credentials" }
}

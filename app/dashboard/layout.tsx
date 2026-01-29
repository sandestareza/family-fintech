import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { DashboardHeader } from "@/components/dashboard/Header"
import { SidebarProvider } from "@/components/dashboard/sidebar-context"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let userProfile = null
  if (user) {
      const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url, email")
          .eq("id", user.id)
          .single()
      
      if (profile) {
          userProfile = {
              name: profile.full_name,
              email: profile.email || user.email, // Fallback to auth email
              avatarUrl: profile.avatar_url
          }
      } else {
        // Fallback if no profile yet (shouldn't happen often)
        userProfile = {
            name: user.email?.split('@')[0] || "User",
            email: user.email || "",
            avatarUrl: null
        }
      }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <DashboardSidebar user={userProfile || undefined} />
        <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 p-4 md:p-8 pt-6">
              {children}
            </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

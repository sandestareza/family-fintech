import { createClient } from "@/lib/supabase/server"
import { InviteCodeCard } from "@/components/settings/InviteCodeCard"
import { HouseholdSettings } from "@/components/settings/HouseholdSettings"
import { MemberList } from "@/components/settings/MemberList"
import { ProfileSettings } from "@/components/settings/ProfileSettings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProfile } from "@/lib/actions/profile"

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  // Fetch household data with member role
  const { data: memberData } = await supabase
    .from("household_members")
    .select("role, households (id, name, invite_code)")
    .eq("user_id", user.id)
    .single()
    
  const household = memberData?.households as unknown as { id: string; name: string; invite_code: string }
  const inviteCode = household?.invite_code || "ERROR"
  const householdName = household?.name || "Keluarga"
  const userRole = memberData?.role || "istri"
  
  // Get profile data
  const profile = await getProfile()

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Pengaturan</h2>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="household">Keluarga</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings 
            initialData={{
              full_name: profile?.full_name || "",
              email: user.email || ""
            }}
          />
        </TabsContent>
        
        <TabsContent value="household" className="space-y-6">
          <HouseholdSettings 
            householdId={household?.id || ""}
            householdName={householdName}
            userRole={userRole}
          />
          <InviteCodeCard code={inviteCode} />
          <MemberList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

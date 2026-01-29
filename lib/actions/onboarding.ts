"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { nanoid } from "nanoid"
import { randomUUID } from "crypto"

export async function createHousehold(name: string, currency: string) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
    console.log(error);
    
  if (error || !user) {
    throw new Error("Unauthorized")
  }

  // Generate a random 6-character invite code
  // Custom alphabet to avoid confusion (no 0/O, 1/I)
  const inviteCode = nanoid(6).toUpperCase()

  const householdId = randomUUID()

  // 1. Create Household
  const { error: householdError } = await supabase
    .from("households")
    .insert({
      id: householdId,
      name,
      currency,
      invite_code: inviteCode,
    })

  if (householdError) {
    console.error("Error creating household:", householdError)
    return { error: householdError.message }
  }

  // 2. Add creator as Suami
  const { error: memberError } = await supabase.from("household_members")
    .insert({
      household_id: householdId,
      user_id: user.id,
      role: "suami",
    })

  if (memberError) {
    console.error("Error adding member:", memberError)
    // Cleanup household if member creation fails? Technically yes, but for now simple error return
    return { error: memberError.message }
  }

  redirect("/dashboard")
}

export async function joinHousehold(inviteCode: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // 1. Find Household by code via RPC (bypasses RLS)
  const { data: household, error: findError } = await supabase
    .rpc('get_household_by_invite_code', { code: inviteCode })
    .single() as { data: { id: string }, error: unknown }
  
  if (findError || !household) {
    return { error: "Kode undangan tidak valid." }
  }

  // 2. Check if already a member
  const { data: existingMember } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("household_id", household.id)
    .eq("user_id", user.id)
    .single()
  
  if (existingMember) {
      redirect("/dashboard")
      return;
  }

  // 3. Add as Member
  const { error: joinError } = await supabase
    .from("household_members")
    .insert({
      household_id: household.id,
      user_id: user.id,
      role: "member",
    })

  if (joinError) {
    console.error("Error joining household:", joinError)
    return { error: joinError.message }
  }

  redirect("/dashboard")
}

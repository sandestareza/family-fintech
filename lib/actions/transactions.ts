"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"


export async function createTransaction(data: {
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  walletId: string
  description?: string
  date: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get User's Household
  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) {
    throw new Error("No household found")
  }

  const { error } = await supabase.from("transactions").insert({
    household_id: member.household_id,
    user_id: user.id,
    wallet_id: data.walletId,
    category_id: data.categoryId,
    amount: data.amount,
    type: data.type,
    description: data.description,
    date: data.date,
  })

  if (error) {
    console.error("Error creating transaction:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/transactions")
}

export async function getCategories() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("household_id", member.household_id)
    .order('name')

  return categories || []
}

export async function deleteTransaction(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from("transactions").delete().eq("id", id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/transactions")
}

export async function updateTransaction(id: string, data: {
  amount: number
  type: 'income' | 'expense'
  categoryId: string
  walletId: string
  description?: string
  date: string
}) {
    
  const supabase = await createClient()
  const { error } = await supabase
    .from("transactions")
    .update({
      amount: data.amount,
      type: data.type,
      category_id: data.categoryId,
      wallet_id: data.walletId,
      description: data.description,
      date: data.date,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/transactions")
}

export async function createCategory(data: {
  name: string
  type: 'income' | 'expense'
  icon?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get User's Household
  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) {
    throw new Error("No household found")
  }

  const { error } = await supabase.from("categories").insert({
    household_id: member.household_id,
    name: data.name,
    type: data.type,
    icon: data.icon,
  })

  if (error) {
    console.error("Error creating category:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/transactions")
}

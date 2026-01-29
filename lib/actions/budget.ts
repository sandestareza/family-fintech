"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBudget(data: {
  categoryId: string
  amount: number
  period: 'monthly' | 'yearly'
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) throw new Error("No household found")

  // Check if budget already exists for this category
  const { data: existing } = await supabase
    .from("budgets")
    .select("id")
    .eq("household_id", member.household_id)
    .eq("category_id", data.categoryId)
    .single()

  if (existing) {
      // Update instead of insert if exists
      const { error } = await supabase
        .from("budgets")
        .update({ amount: data.amount, period: data.period })
        .eq("id", existing.id)
      
      if (error) return { error: error.message }
  } else {
      const { error } = await supabase.from("budgets").insert({
        household_id: member.household_id,
        category_id: data.categoryId,
        amount: data.amount,
        period: data.period,
      })

      if (error) return { error: error.message }
  }

  revalidatePath("/dashboard/budget")
}

export interface BudgetProgress {
    id: string
    categoryName: string
    categoryIcon?: string
    amount: number
    spent: number
    percentage: number
    period: string
}

export async function getBudgets(): Promise<BudgetProgress[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  // 1. Get Budgets with Category info
  const { data: budgets } = await supabase
    .from("budgets")
    .select(`
      id,
      amount,
      period,
      categories (
        id,
        name,
        icon
      )
    `)
    .eq("household_id", member.household_id)

  if (!budgets) return []

  // 2. Calculate spent amount for each budget (Current Month)
  // Simplified: fetching all transactions for the category for this month
  // In prod: aggregations on DB side are better
  
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0,0,0,0) // Start of current month

  const budgetProgress: BudgetProgress[] = []

  for (const b of budgets) {
      if (!b.categories) continue
      
      const categoryId = (b.categories as unknown as { id: string }).id

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount")
        .eq("household_id", member.household_id)
        .eq("category_id", categoryId)
        .eq("type", "expense")
        .gte("date", startOfMonth.toISOString())
      
      const spent = transactions?.reduce((sum, t) => sum + Number(t.amount), 0) || 0
      
      budgetProgress.push({
          id: b.id,
          categoryName: (b.categories as unknown as { name: string }).name,
          categoryIcon: (b.categories as unknown as { icon: string }).icon,
          amount: Number(b.amount),
          spent,
          percentage: Math.min((spent / Number(b.amount)) * 100, 100),
          period: b.period || 'monthly'
      })
  }

  return budgetProgress.sort((a, b) => b.percentage - a.percentage)
}

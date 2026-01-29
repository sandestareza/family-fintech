"use server"

import { createClient } from "@/lib/supabase/server"

export interface MonthlyStats {
  name: string
  income: number
  expense: number
}

export async function getMonthlyStats(): Promise<MonthlyStats[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  // Fetch transactions for the current year (simplified)
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("household_id", member.household_id)
    .order('date', { ascending: true })

  if (!transactions) return []

  // Aggregate by month
  const monthlyData: Record<string, { income: number; expense: number }> = {}
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleString('default', { month: 'short' })
      monthlyData[monthName] = { income: 0, expense: 0 }
  }

  transactions.forEach(t => {
      const date = new Date(t.date)
      const monthName = date.toLocaleString('default', { month: 'short' })
      // Only process if it's in our initialized months (or just add it dynamic)
      // For simplicity let's stick to last 6 months window logic in a real app
      // Here we just map what we have if it matches
      if (monthlyData[monthName]) {
          if (t.type === 'income') {
              monthlyData[monthName].income += Number(t.amount)
          } else {
              monthlyData[monthName].expense += Number(t.amount)
          }
      }
  })

  return Object.entries(monthlyData).map(([name, stats]) => ({
      name,
      income: stats.income,
      expense: stats.expense
  }))
}

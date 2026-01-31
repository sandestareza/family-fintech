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

  // Get current year date range
  const now = new Date()
  const currentYear = now.getFullYear()
  const startOfYear = new Date(currentYear, 0, 1).toISOString().split('T')[0]
  const endOfYear = new Date(currentYear, 11, 31).toISOString().split('T')[0]

  // Fetch transactions for the current year only
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("household_id", member.household_id)
    .gte("date", startOfYear)
    .lte("date", endOfYear)
    .order('date', { ascending: true })

  if (!transactions) return []

  // Aggregate by month - initialize all 12 months
  const monthlyData: Record<string, { income: number; expense: number }> = {}
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  
  // Initialize all months up to current month
  for (let i = 0; i <= now.getMonth(); i++) {
      monthlyData[monthNames[i]] = { income: 0, expense: 0 }
  }

  transactions.forEach(t => {
      const date = new Date(t.date)
      const monthIndex = date.getMonth()
      const monthName = monthNames[monthIndex]
      
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

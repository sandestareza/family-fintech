"use server"

import { createClient } from "@/lib/supabase/server"

export interface ExpenseByCategory {
  category: string
  amount: number
  icon?: string
}

export async function getMonthlyTrend() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: member } = await supabase.from("household_members").select("household_id").eq("user_id", user.id).single()
  if (!member) return []

  // Fetch all transactions for now (optimize with date range later)
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type, date")
    .eq("household_id", member.household_id)
    .order('date', { ascending: true })

  if (!transactions) return []

  // Initialize last 6 months
  const monthlyData: Record<string, { name: string; income: number; expense: number }> = {}
  for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = d.toISOString().slice(0, 7) // YYYY-MM
      const name = d.toLocaleString('default', { month: 'short' })
      monthlyData[key] = { name, income: 0, expense: 0 }
  }

  transactions.forEach(t => {
      const key = t.date.slice(0, 7)
      if (monthlyData[key]) {
          if (t.type === 'income') monthlyData[key].income += t.amount
          else monthlyData[key].expense += t.amount
      }
  })

  return Object.values(monthlyData)
}

export async function getExpensesByCategory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: member } = await supabase.from("household_members").select("household_id").eq("user_id", user.id).single()
  if (!member) return []

  // Fetch expenses joined with categories
  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
        amount,
        categories (name)
    `)
    .eq("household_id", member.household_id)
    .eq("type", "expense")

  if (!transactions) return []

  const categoryStats: Record<string, number> = {}

  transactions.forEach(t => {
      // Cast to expected shape from join
      const cat = t.categories as unknown as { name: string } | null
      const catName = cat ? cat.name : "Uncategorized"
      categoryStats[catName] = (categoryStats[catName] || 0) + t.amount
  })

  return Object.entries(categoryStats)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

export async function getWalletUsageStats() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
  
    const { data: member } = await supabase.from("household_members").select("household_id").eq("user_id", user.id).single()
    if (!member) return []
  
    // Fetch expenses joined with wallets
    // Note: transactions has wallet_id. Need to join wallets to get name.
    const { data: transactions } = await supabase
      .from("transactions")
      .select(`
          amount,
          type,
          wallets (name)
      `)
      .eq("household_id", member.household_id)
      // .eq("type", "expense") // User wants "History", maybe both income/expense? let's separate or show net flow?
      // "Pengeluaran per dompet" usually means expense.
      // But "History Dompet" might imply activity.
      // Let's stick to Expense for the "Usage" chart to see which wallet is used most.
      .eq("type", "expense")
  
    if (!transactions) return []
  
    const walletStats: Record<string, number> = {}
  
    transactions.forEach(t => {
        const wallet = t.wallets as unknown as { name: string } | null
        const walletName = wallet ? wallet.name : "Unknown Wallet"
        walletStats[walletName] = (walletStats[walletName] || 0) + t.amount
    })
  
    return Object.entries(walletStats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
}

export async function getMonthlySummaryStats() {
    // Reusing existing logic or simplified
    const trend = await getMonthlyTrend()
    const currentMonth = trend[trend.length - 1] || { income: 0, expense: 0 }
    
    // We can also calc savings rate
    return {
        income: currentMonth.income,
        expense: currentMonth.expense,
        savings: currentMonth.income - currentMonth.expense,
        savingsRate: currentMonth.income > 0 ? ((currentMonth.income - currentMonth.expense) / currentMonth.income) * 100 : 0
    }
}

export async function getRecentTransactionsExpanded() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []
  
    const { data: member } = await supabase.from("household_members").select("household_id").eq("user_id", user.id).single()
    if (!member) return []
  
    // Fetch detailed transactions
    const { data: transactions } = await supabase
      .from("transactions")
      .select(`
        id,
        amount,
        type,
        description,
        date,
        wallet_id,
        wallets (name),
        categories (name, icon)
      `)
      .eq("household_id", member.household_id)
      .order('date', { ascending: false })
      .limit(10)
  
    if (!transactions) return []
    
    return transactions.map(t => {
      const walletName = Array.isArray(t.wallets) ? t.wallets[0]?.name : (t.wallets as { name: string })?.name
      const categoryData = Array.isArray(t.categories) ? t.categories[0] : (t.categories as { name: string; icon: string })
      
      return {
        ...t,
        wallets: walletName ? { name: walletName } : null,
        categories: categoryData ? { name: categoryData.name, icon: categoryData.icon } : null
      }
    })
}

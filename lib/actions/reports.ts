"use server"

import { createClient } from "@/lib/supabase/server"

export interface LedgerTransaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  wallet_name: string
  category_name: string
}

export async function getTransactionsLedger({
    walletId,
    startDate,
    endDate
}: {
    walletId?: string
    startDate?: string
    endDate?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  let query = supabase
    .from("transactions")
    .select(`
      id,
      date,
      description,
      amount,
      type,
      wallets (name),
      categories (name)
    `)
    .eq("household_id", member.household_id)
    .order('date', { ascending: false }) // Newest first

  if (walletId && walletId !== "all") {
    query = query.eq("wallet_id", walletId)
  }

  if (startDate) {
      query = query.gte("date", startDate)
  }

  if (endDate) {
      query = query.lte("date", endDate)
  }

  const { data: transactions, error } = await query

  if (error) {
      console.error("Error fetching ledger:", error)
      return []
  }

  return transactions.map(t => {
      const walletName = Array.isArray(t.wallets) ? t.wallets[0]?.name : (t.wallets as { name: string })?.name
      const categoryName = Array.isArray(t.categories) ? t.categories[0]?.name : (t.categories as { name: string })?.name
      
      return {
        id: t.id,
        date: t.date,
        description: t.description || "Tanpa Keterangan",
        amount: t.amount,
        type: t.type,
        wallet_name: walletName || "Unknown",
        category_name: categoryName || "Uncategorized"
      }
  }) as LedgerTransaction[]
}

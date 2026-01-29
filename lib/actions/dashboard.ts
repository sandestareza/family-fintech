"use server"

import { createClient } from "@/lib/supabase/server"

export interface DashboardStats {
  income: number
  expense: number
  totalAssets: number
  savings: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { income: 0, expense: 0, totalAssets: 0, savings: 0 }

  // 1. Get User's Household
  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return { income: 0, expense: 0, totalAssets: 0, savings: 0 }

  // 2. Aggregate Transactions for current month (Simplified for now: All Time)
  const { data: transactions } = await supabase
    .from("transactions")
    .select("amount, type")
    .eq("household_id", member.household_id)

  // 3. Get Total Assets from Wallets
  const { data: wallets } = await supabase
    .from("wallets")
    .select("balance")
    .eq("household_id", member.household_id)

  const totalAssets = wallets?.reduce((acc, curr) => acc + Number(curr.balance), 0) || 0

  if (!transactions) return { income: 0, expense: 0, totalAssets, savings: 0 }

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => acc + Number(curr.amount), 0)

  return {
    income,
    expense,
    totalAssets,
    savings: income - expense
  }
}

export interface Transaction {
  id: string
  amount: number
  type: 'income' | 'expense'
  description: string
  date: string
  walletId: string // Added walletId
  category?: {
    name: string
    icon: string
  }
}

export async function getRecentTransactions(): Promise<Transaction[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  const { data: transactions } = await supabase
    .from("transactions")
    .select(`
      id,
      amount,
      type,
      description,
      date,
      wallet_id,
      categories (
        name,
        icon
      )
    `)
    .eq("household_id", member.household_id)
    .order('date', { ascending: false })
    .limit(5)

  if (!transactions) return []

  // Map to cleaner interface
  return transactions.map(t => ({
    id: t.id,
    amount: Number(t.amount),
    type: t.type as 'income' | 'expense',
    description: t.description || 'Tanpa keterangan',
    date: t.date,
    walletId: t.wallet_id, // Map wallet_id
    category: t.categories ? {
        name: (t.categories as unknown as { name: string }).name,
        icon: (t.categories as unknown as { icon: string }).icon
    } : undefined
  }))
}

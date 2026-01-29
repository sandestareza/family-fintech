"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { randomUUID } from "crypto"

export async function getWallets() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  const { data: wallets } = await supabase
    .from("wallets")
    .select("*")
    .eq("household_id", member.household_id)
    .order('created_at', { ascending: true })

  return wallets || []
}

export async function createWallet(data: {
  name: string
  type: string
  initialBalance: number
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

  const walletId = randomUUID()

  // 1. Create Wallet
  const { error } = await supabase.from("wallets").insert({
    id: walletId,
    household_id: member.household_id,
    name: data.name,
    type: data.type,
    balance: 0, // Set to 0, let the transaction trigger update it
  })

  if (error) {
    console.error("Error creating wallet:", error)
    return { error: error.message }
  }

  // Optional: If initial balance > 0, should we record it as a transaction? 
  // For 'Opening Balance', usually yes, but for simplicity let's just set the balance.
  // If we want strict accounting, we should create a transaction 'Opening Balance'.
  // Let's do it if balance > 0
  if (data.initialBalance > 0) {
      // Find or create 'Adjustment' category? Or just null category.
      await supabase.from("transactions").insert({
          household_id: member.household_id,
          user_id: user.id,
          wallet_id: walletId,
          amount: data.initialBalance,
          type: 'income',
          description: 'Saldo Awal',
          date: new Date().toISOString()
      })
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wallets")
}

export async function transferFunds(data: {
    fromWalletId: string
    toWalletId: string
    amount: number
    date: string
    description?: string
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

    const transferId = randomUUID()

    // 1. Outgoing Transaction (Expense)
    const { error: errorOut } = await supabase.from("transactions").insert({
        household_id: member.household_id,
        user_id: user.id,
        wallet_id: data.fromWalletId,
        amount: data.amount, // Positive amount, but type is expense so it reduces balance
        type: 'expense',
        description: `Transfer ke ${data.description || 'Dompet Lain'}`,
        date: data.date,
        transfer_id: transferId
    })

    if (errorOut) return { error: errorOut.message }

    // 2. Incoming Transaction (Income)
    const { error: errorIn } = await supabase.from("transactions").insert({
        household_id: member.household_id,
        user_id: user.id,
        wallet_id: data.toWalletId,
        amount: data.amount,
        type: 'income',
        description: `Transfer dari ${data.description || 'Dompet Lain'}`,
        date: data.date,
        transfer_id: transferId
    })

    if (errorIn) return { error: errorIn.message }

    // 3. Update Wallets Balances
    // Note: In a real app we might rely on triggers or recalculation. 
    // Here we manually update for immediate feedback, assuming no race conditions for this scale.
    
    // Decrement Source
    await supabase.rpc('decrement_wallet_balance', { 
        w_id: data.fromWalletId, 
        amount: data.amount 
    }) // We might need to create this RPC or just use update. Update is risky for concurrency.
    // Let's use simple update for now, but really we should use a Postgres function or pure SQL update with increment.
    
    // Since we don't have the RPC yet, let's just let the UI/Dashboard recalculate?
    // No, the table 'wallets' has a 'balance' column. We must maintain it.
    // Let's create a quick SQL function to safely increment/decrement? 
    // Or just "update wallets set balance = balance - X where id = Y".
    // Supabase JS doesn't support "balance = balance - X" syntax directly in .update().
    // So we need an RPC.
    
    // Actually, let's rely on a trigger to update wallet balance whenever a transaction is inserted?
    // That's the most robust way.
    // BUT for now, I will NOT update the balance column manually in this function if I implement a trigger.
    // Let's implement a trigger in the next step. It's safer.
    
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/wallets")
}

export async function updateWallet(id: string, data: { name: string; type: string }) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("wallets")
    .update({
      name: data.name,
      type: data.type,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wallets")
}

export async function deleteWallet(id: string) {
  const supabase = await createClient()
  
  // Optional: Check conflicts or handle related transactions.
  // Schema has ON DELETE SET NULL for transactions.wallet_id, so it's safeish.
  
  const { error } = await supabase.from("wallets").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/wallets")
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { BillValues } from "@/lib/validations/bills"

export async function getBills() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) return []

  // Fetch bills with category name
  const { data: bills } = await supabase
    .from("bills")
    .select(`
      *,
      categories (name, icon)
    `)
    .eq("household_id", member.household_id)
    .order('due_date', { ascending: true })

  return bills || []
}

export async function createBill(data: BillValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single()

  if (!member) throw new Error("No household found")

  const { error } = await supabase.from("bills").insert({
    household_id: member.household_id,
    name: data.name,
    amount: data.amount,
    due_date: data.dueDate,
    frequency: data.frequency,
    category_id: data.category,
    status: 'unpaid'
  })

  if (error) {
    console.error("Error creating bill:", error)
    return { error: error.message }
  }

  revalidatePath("/dashboard/bills")
}

export async function updateBill(id: string, data: BillValues) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from("bills")
    .update({
      name: data.name,
      amount: data.amount,
      due_date: data.dueDate,
      frequency: data.frequency,
      category_id: data.category,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/bills")
}

export async function deleteBill(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("bills").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/bills")
}

export async function markBillAsPaid(id: string, walletId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")
  
  // 1. Get current bill details
  const { data: bill, error: fetchError } = await supabase
    .from("bills")
    .select("*")
    .eq("id", id)
    .single()

  if (fetchError || !bill) {
    return { error: fetchError?.message || "Bill not found" }
  }

  // 2. Mark as paid
  const { error: updateError } = await supabase
    .from("bills")
    .update({ status: 'paid' })
    .eq("id", id)

  if (updateError) {
    return { error: updateError.message }
  }

  // 3. Create Transaction
  const { error: transactionError } = await supabase.from("transactions").insert({
    household_id: bill.household_id,
    user_id: user.id,
    wallet_id: walletId,
    category_id: bill.category_id,
    amount: bill.amount, // Expense triggers wallet deduction
    type: 'expense',
    description: `Bayar Tagihan: ${bill.name}`,
    date: new Date().toISOString()
  })

  // 4. Handle recurring logic
  if (bill.frequency !== 'one_time') {
    const currentDueDate = new Date(bill.due_date)
    let nextDueDate = new Date(currentDueDate)

    if (bill.frequency === 'monthly') {
      nextDueDate.setMonth(nextDueDate.getMonth() + 1)
    } else if (bill.frequency === 'yearly') {
      nextDueDate.setFullYear(nextDueDate.getFullYear() + 1)
    }

    const { error: createError } = await supabase.from("bills").insert({
      household_id: bill.household_id,
      name: bill.name,
      amount: bill.amount,
      due_date: nextDueDate.toISOString().split('T')[0], // YYYY-MM-DD
      frequency: bill.frequency,
      category_id: bill.category_id,
      status: 'unpaid'
    })

    if (createError) {
      console.error("Error creating next recurring bill:", createError)
    }
  }

  revalidatePath("/dashboard/bills")
  revalidatePath("/dashboard") // Update wallet balance in overview
}

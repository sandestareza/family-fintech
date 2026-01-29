import { getRecentTransactions } from "@/lib/actions/dashboard" 
import { getCategories } from "@/lib/actions/transactions"
import { getWallets } from "@/lib/actions/wallets"
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog"
import { TransactionList } from "@/components/transactions/TransactionList"

export default async function TransactionsPage() {
    const transactions = await getRecentTransactions() 
    const categories = await getCategories()
    const wallets = await getWallets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transaksi</h2>
        <AddTransactionDialog categories={categories} wallets={wallets} />
      </div>

      <div className="grid gap-4">
        <TransactionList transactions={transactions} categories={categories} wallets={wallets} />
      </div>
    </div>
  )
}

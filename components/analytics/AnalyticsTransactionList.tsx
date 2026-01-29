"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp } from "lucide-react"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { formatCurrency, formatDate } from "@/lib/utils"

interface Transaction {
    id: string
    amount: number
    type: 'income' | 'expense'
    description: string
    date: string
    wallet_id: string
    wallets?: {
        name: string
    } | null
    categories?: {
        name: string
        icon: string
    } | null
}

export function AnalyticsTransactionList({ transactions }: { transactions: Transaction[] }) {
    // Group transactions by wallet name
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const walletName = transaction.wallets?.name || 'Unknown Wallet'
        if (!groups[walletName]) {
            groups[walletName] = []
        }
        groups[walletName].push(transaction)
        return groups
    }, {} as Record<string, Transaction[]>)

    // Sort wallet names alphabetically or by some other criteria if needed
    const walletNames = Object.keys(groupedTransactions).sort()

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-7">
      <CardHeader>
        <CardTitle>Riwayat Mutasi (Per Dompet)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
            {transactions.length === 0 ? (
                <p className="text-sm text-zinc-500">Belum ada transaksi.</p>
            ) : (
                walletNames.map((walletName) => (
                    <div key={walletName} className="space-y-3">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                             <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                             {walletName}
                        </h3>
                        <div className="space-y-3 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                            {groupedTransactions[walletName].map((t) => (
                                <div key={t.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${t.type === 'income' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-red-200 bg-red-50 text-red-600'}`}>
                                            {t.type === 'income' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">{t.description}</p>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <span>{t.categories?.name || 'Uncategorized'}</span>
                                                <span>•</span>
                                                <span>{formatDate(t.date, "dd MMMM yyyy")}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`font-medium text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
      </CardContent>
    </Card>
  )
}

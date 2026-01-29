import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction } from "@/lib/actions/dashboard"
import { ArrowDown, ArrowUp } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Transaksi Terakhir</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
            {transactions.length === 0 ? (
                <p className="text-sm text-zinc-500">Belum ada transaksi.</p>
            ) : (
                transactions.map((t) => (
                    <div key={t.id} className="flex items-center">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${t.type === 'income' ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-900/30' : 'border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-900/30'}`}>
                            {t.type === 'income' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{t.description}</p>
                            <p className="text-xs text-zinc-500">{t.category?.name || 'Uncategorized'} • {t.date}</p>
                        </div>
                        <div className={`ml-auto font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </div>
                    </div>
                ))
            )}
        </div>
      </CardContent>
    </Card>
  )
}

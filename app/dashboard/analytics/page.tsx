import { getExpensesByCategory, getMonthlyTrend, getWalletUsageStats, getRecentTransactionsExpanded } from "@/lib/actions/analytics"
import { ExpensePieChart } from "@/components/analytics/ExpensePieChart"
import { TrendChart } from "@/components/analytics/TrendChart"
import { WalletExpenseChart } from "@/components/analytics/WalletExpenseChart"
import { AnalyticsTransactionList } from "@/components/analytics/AnalyticsTransactionList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AnalyticsPage() {
  const expenseData = await getExpensesByCategory()
  const trendData = await getMonthlyTrend()
  const walletData = await getWalletUsageStats()
  const recentTransactions = await getRecentTransactionsExpanded()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      
      {/* Top Row: Trend */}
      <div className="grid gap-4 md:grid-cols-1">
        <TrendChart data={trendData} />
      </div>

      {/* Middle Row: Breakdown */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ExpensePieChart data={expenseData} />
        <WalletExpenseChart data={walletData} />
      </div>

      {/* Insight Section (Simple Text) */}
      <div className="grid gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Insight Singkat</CardTitle>
                <CardDescription>Berdasarkan data transaksi Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <li>Kategori pengeluaran terbesar Anda adalah <strong>{expenseData[0]?.name || "-"}</strong>.</li>
                    <li>Dompet yang paling sering digunakan untuk pengeluaran adalah <strong>{walletData[0]?.name || "-"}</strong>.</li>
                </ul>
            </CardContent>
        </Card>
      </div>

      {/* Mutation List */}
      <div className="grid gap-4">
        <AnalyticsTransactionList transactions={recentTransactions} />
      </div>
    </div>
  )
}

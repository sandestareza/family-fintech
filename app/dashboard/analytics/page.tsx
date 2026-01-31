import { getExpensesByCategory, getMonthlyTrend, getWalletUsageStats, getRecentTransactionsExpanded } from "@/lib/actions/analytics"
import { ExpensePieChart } from "@/components/analytics/ExpensePieChart"
import { TrendChart } from "@/components/analytics/TrendChart"
import { WalletExpenseChart } from "@/components/analytics/WalletExpenseChart"
import { AnalyticsTransactionList } from "@/components/analytics/AnalyticsTransactionList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default async function AnalyticsPage() {
  const expenseData = await getExpensesByCategory()
  const trendData = await getMonthlyTrend()
  const walletData = await getWalletUsageStats()
  const recentTransactions = await getRecentTransactionsExpanded()

  // Calculate total expenses for percentage
  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0)
  const topCategory = expenseData[0]
  const topCategoryPercentage = totalExpense > 0 && topCategory 
    ? ((topCategory.value / totalExpense) * 100).toFixed(1) 
    : 0

  // Calculate wallet stats
  const topWallet = walletData[0]

  // Get current month data from trend
  const currentMonthData = trendData[trendData.length - 1]
  const prevMonthData = trendData[trendData.length - 2]
  
  // Calculate expense change
  const expenseChange = currentMonthData && prevMonthData 
    ? currentMonthData.expense - prevMonthData.expense 
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>

      {/* Mutation List */}
      <div className="grid gap-4">
        <AnalyticsTransactionList transactions={recentTransactions} />
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

      {/* Insight Section */}
      <div className="grid gap-4">
        <Card>
            <CardHeader>
                <CardTitle>Insight Singkat</CardTitle>
                <CardDescription>Berdasarkan data transaksi bulan ini.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {topCategory ? (
                      <li>
                        Kategori pengeluaran terbesar adalah <strong>{topCategory.name}</strong> sebesar{" "}
                        <strong className="text-red-600">{formatCurrency(topCategory.value)}</strong>{" "}
                        ({topCategoryPercentage}% dari total pengeluaran).
                      </li>
                    ) : (
                      <li>Belum ada data kategori pengeluaran.</li>
                    )}
                    
                    {topWallet ? (
                      <li>
                        Dompet <strong>{topWallet.name}</strong> paling banyak digunakan untuk pengeluaran sebesar{" "}
                        <strong className="text-red-600">{formatCurrency(topWallet.value)}</strong>.
                      </li>
                    ) : (
                      <li>Belum ada data penggunaan dompet.</li>
                    )}
                    
                    {currentMonthData && prevMonthData && (
                      <li>
                        Pengeluaran bulan ini{" "}
                        {expenseChange > 0 ? (
                          <span className="text-red-600 font-medium">
                            naik {formatCurrency(expenseChange)}
                          </span>
                        ) : expenseChange < 0 ? (
                          <span className="text-emerald-600 font-medium">
                            turun {formatCurrency(Math.abs(expenseChange))}
                          </span>
                        ) : (
                          <span>sama</span>
                        )}{" "}
                        dibanding bulan lalu.
                      </li>
                    )}
                    
                    {totalExpense > 0 && (
                      <li>
                        Total pengeluaran tercatat: <strong>{formatCurrency(totalExpense)}</strong> dari{" "}
                        <strong>{expenseData.length}</strong> kategori.
                      </li>
                    )}
                </ul>
            </CardContent>
        </Card>
      </div>

      
    </div>
  )
}


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/lib/actions/dashboard"
import { TrendingUp, TrendingDown } from "lucide-react"

export function FinancialOverview({ stats }: { stats: DashboardStats }) {
  const total = stats.income + stats.expense || 1 // Avoid division by zero
  const incomePercentage = (stats.income / total) * 100
  const expensePercentage = (stats.expense / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="font-medium">Pemasukan</span>
            </div>
            <span className="font-semibold text-emerald-600">
              {incomePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-emerald-600 transition-all"
              style={{ width: `${incomePercentage}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="font-medium">Pengeluaran</span>
            </div>
            <span className="font-semibold text-red-600">
              {expensePercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full bg-red-600 transition-all"
              style={{ width: `${expensePercentage}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500">
              Rasio Pengeluaran
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${stats.expense / stats.income > 0.7 ? 'text-red-600' : 'text-emerald-600'}`}>
                {stats.income > 0 ? ((stats.expense / stats.income) * 100).toFixed(1) : 0}%
              </span>
              {stats.expense / stats.income > 0.7 && (
                <span className="text-xs text-red-600">⚠️ Tinggi</span>
              )}
            </div>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            {stats.expense / stats.income > 0.7 
              ? "Pengeluaran Anda cukup tinggi. Pertimbangkan untuk menghemat."
              : "Keuangan Anda dalam kondisi baik!"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

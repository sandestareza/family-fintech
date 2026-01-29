import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet, HandCoins } from "lucide-react";
import { DashboardStats } from "@/lib/actions/dashboard";
import { formatCurrency } from "@/lib/utils";

export function SummaryCards({ stats }: { stats: DashboardStats }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
          <Wallet className="h-4 w-4 text-zinc-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalAssets)}
          </div>
          <p className="text-xs text-zinc-500">Total semua dompet</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pemasukan</CardTitle>
          <div className="h-4 w-4 rounded-full bg-emerald-100 p-0.5 text-emerald-600 dark:bg-emerald-900/30">
            <ArrowUp className="h-3 w-3" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            {formatCurrency(stats.income)}
          </div>
          <p className="text-xs text-zinc-500">Total masuk (Semua Waktu)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pengeluaran</CardTitle>
          <div className="h-4 w-4 rounded-full bg-red-100 p-0.5 text-red-600 dark:bg-red-900/30">
            <ArrowDown className="h-3 w-3" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.expense)}
          </div>
          <p className="text-xs text-zinc-500">Total keluar (Semua Waktu)</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sisa / Tabungan</CardTitle>
          <HandCoins className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${stats.savings >= 0 ? "text-blue-600" : "text-red-600"}`}
          >
            {formatCurrency(stats.savings)}
          </div>
          <p className="text-xs text-zinc-500">Selisih Masuk - Keluar</p>
        </CardContent>
      </Card>
    </div>
  );
}

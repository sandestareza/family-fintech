"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Wallet, TrendingUp, Eye, EyeOff } from "lucide-react";
import { DashboardStats } from "@/lib/actions/dashboard";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

// Get current month name in Indonesian
const getCurrentMonthName = () => {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return months[new Date().getMonth()];
};

export function SummaryCards({ stats }: { stats: DashboardStats }) {
  const currentMonth = getCurrentMonthName();
  const [showAssets, setShowAssets] = useState(true);
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAssets(!showAssets)}
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              aria-label={showAssets ? "Sembunyikan saldo" : "Tampilkan saldo"}
            >
              {showAssets ? (
                <Eye className="h-4 w-4" />
              ) : (
                <EyeOff className="h-4 w-4" />
              )}
            </button>
            <Wallet className="h-4 w-4 text-zinc-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {showAssets ? formatCurrency(stats.totalAssets) : "Rp ••••••••"}
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
          <p className="text-xs text-zinc-500">Bulan {currentMonth}</p>
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
          <p className="text-xs text-zinc-500">Bulan {currentMonth}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Selisih</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${stats.savings >= 0 ? "text-blue-600" : "text-red-600"}`}
          >
            {formatCurrency(stats.savings)}
          </div>
          <p className="text-xs text-zinc-500">Pemasukan - Pengeluaran</p>
        </CardContent>
      </Card>
    </div>
  );
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MonthlySummaryStats {
    income: number
    expense: number
    savings: number
    savingsRate: number
    earnings?: number // Optional if sometimes referred to as earnings
}

export function MonthlySummary({ stats }: { stats: MonthlySummaryStats }) {

    
  return (
    <div className="grid gap-4 md:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{stats.income > 0 ? "+" + ((stats.earnings || stats.income) / 1000) + "k" : "Data Kurang"}</div>
                 <p className="text-xs text-muted-foreground">Snapshot status bulan berjalan</p>
            </CardContent>
        </Card>
        {/* Placeholder for more summary cards */}
    </div>
  )
}

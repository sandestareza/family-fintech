"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TrendData {
    name: string
    income: number
    expense: number
}

export function TrendChart({ data }: { data: TrendData[] }) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Tren Keuangan (6 Bulan Terakhir)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `Rp${value / 1000}k`}
                />
                <Tooltip 
                    formatter={(value: number | undefined) => value ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value) : "Rp 0"}
                    cursor={{fill: 'transparent'}}
                />
                <Legend />
                <Bar dataKey="income" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

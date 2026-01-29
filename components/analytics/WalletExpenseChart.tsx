"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface ChartData {
  name: string
  value: number
  [key: string]: string | number
}

export function WalletExpenseChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Pengeluaran per Dompet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                    dataKey="name" 
                    type="category" 
                    width={100} 
                    fontSize={12} 
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip 
                    cursor={{fill: 'transparent'}}
                    formatter={(value: number | undefined) => formatCurrency(value || 0)}
                />
                <Bar dataKey="value" fill="#f59e0b" radius={[0, 4, 4, 0]}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#f59e0b" : "#d97706"} />
                    ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

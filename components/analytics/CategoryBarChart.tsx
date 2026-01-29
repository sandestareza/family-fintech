"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpenseByCategory } from "@/lib/actions/analytics"

export function CategoryBarChart({ data }: { data: ExpenseByCategory[] }) {
  // Sort data 
  const sortedData = [...data].sort((a, b) => b.amount - a.amount)

  return (
    <Card className="col-span-4 lg:col-span-4">
      <CardHeader>
        <CardTitle>Analisis Kategori (Detail)</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
                tick={{fontSize: 12}} 
                interval={0}
              />
              <Tooltip 
                formatter={(value: number | undefined) => value ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value) : "Rp 0"}
                cursor={{fill: 'transparent'}}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={20} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

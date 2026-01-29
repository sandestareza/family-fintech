"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

interface ChartData {
  name: string
  value: number
  [key: string]: string | number // Index signature for recharts
}

export function ExpensePieChart({ data }: { data: ChartData[] }) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Kategori Pengeluaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    if (!midAngle || !percent || percent <= 0.05) return null;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                  
                    return (
                      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value || 0)} />
                <Legend />
            </PieChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

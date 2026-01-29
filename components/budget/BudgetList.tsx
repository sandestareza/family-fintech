"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BudgetProgress } from "@/lib/actions/budget"
import { formatCurrency } from "@/lib/utils"

export function BudgetList({ budgets }: { budgets: BudgetProgress[] }) {

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {budgets.map((budget) => (
        <Card key={budget.id} className={budget.percentage >= 100 ? "border-red-500" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{budget.categoryName}</CardTitle>
            <span className="text-xs text-muted-foreground font-mono">
                {budget.percentage.toFixed(0)}%
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
                {formatCurrency(budget.spent)}
                <span className="text-sm font-normal text-muted-foreground"> / {formatCurrency(budget.amount)}</span>
            </div>
            <Progress 
                value={budget.percentage} 
                className={`mt-3 h-2 ${budget.percentage >= 90 ? "bg-red-100 [&>div]:bg-red-600" : ""}`} 
            />
            {budget.percentage >= 100 && (
                <p className="text-xs text-red-600 mt-2 font-medium">Over Budget!</p>
            )}
          </CardContent>
        </Card>
      ))}
      {budgets.length === 0 && (
          <div className="col-span-full text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
              Belum ada budget yang diatur.
          </div>
      )}
    </div>
  )
}

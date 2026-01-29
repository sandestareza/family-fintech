import { getCategories } from "@/lib/actions/transactions"
import { getBudgets } from "@/lib/actions/budget"
import { CreateBudgetDialog } from "@/components/budget/CreateBudgetDialog"
import { BudgetList } from "@/components/budget/BudgetList"

export default async function BudgetPage() {
  const categories = await getCategories()
  const budgets = await getBudgets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Budget Planner</h2>
            <p className="text-zinc-500">Pantau pengeluaran agar tetap hemat.</p>
        </div>
        <CreateBudgetDialog categories={categories} />
      </div>

      <BudgetList budgets={budgets} />
    </div>
  )
}

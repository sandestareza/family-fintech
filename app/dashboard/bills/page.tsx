import { AddBillDialog } from "@/components/bills/AddBillDialog"
import { BillList } from "@/components/bills/BillList"
import { getBills } from "@/lib/actions/bills"
import { getCategories } from "@/lib/actions/transactions"

import { getWallets } from "@/lib/actions/wallets"

export default async function BillsPage() {
  const bills = await getBills()
  const categories = await getCategories()
  const wallets = await getWallets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tagihan</h2>
        <AddBillDialog categories={categories} />
      </div>
      
      <BillList bills={bills} categories={categories} wallets={wallets} />
    </div>
  )
}

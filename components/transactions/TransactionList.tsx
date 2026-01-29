"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Transaction } from "@/lib/actions/dashboard"
import { ArrowDown, ArrowUp, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { deleteTransaction } from "@/lib/actions/transactions"
import { EditTransactionDialog } from "./EditTransactionDialog"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"

interface Category {
  id: string
  name: string
  type: string
}

interface Wallet {
  id: string
  name: string
  balance: number
}

export function TransactionList({ 
  transactions, 
  categories, 
  wallets, // Added wallets prop
  currency = "IDR" 
}: { 
  transactions: Transaction[]
  categories: Category[]
  wallets: Wallet[]
  currency?: string 
}) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const handleDelete = async (id: string) => {
        if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
            const result = await deleteTransaction(id)
            if (result?.error) {
                console.log(result.error);
                toast.error(result.error);
                return;
            }
            toast.success("Transaksi berhasil dihapus");
        }
    }

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction)
        setIsEditOpen(true)
    }

  return (
    <>
    <Card>
      <CardHeader>
        <CardTitle>Daftar Transaksi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
            {transactions.length === 0 ? (
                <p className="text-sm text-zinc-500">Belum ada transaksi.</p>
            ) : (
                transactions.map((t) => (
                    <div key={t.id} className="flex items-center group">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${t.type === 'income' ? 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900 dark:bg-emerald-900/30' : 'border-red-200 bg-red-50 text-red-600 dark:border-red-900 dark:bg-red-900/30'}`}>
                            {t.type === 'income' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                        </div>
                        <div className="ml-4 space-y-1 flex-1">
                            <p className="text-sm font-medium leading-none">{t.description}</p>
                            <p className="text-xs text-zinc-500">{t.category?.name || 'Uncategorized'} • {t.date}</p>
                        </div>
                        <div className={`mr-4 font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </div>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(t)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(t.id)}>
                                    <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))
            )}
        </div>
      </CardContent>
    </Card>

    <EditTransactionDialog 
        transaction={editingTransaction} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen}
        categories={categories}
        wallets={wallets}
    />
    </>
  )
}

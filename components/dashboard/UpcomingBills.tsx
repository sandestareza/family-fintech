"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Bill {
  id: string
  name: string
  amount: number
  due_date: string
  status: 'unpaid' | 'paid'
  categories?: {
      name: string
  }
}

import { PayBillDialog } from "@/components/bills/PayBillDialog"
import { useState } from "react"
import { CheckCircle } from "lucide-react"

interface Wallet {
  id: string
  name: string
  balance: number
}

export function UpcomingBills({ bills, wallets }: { bills: Bill[], wallets: Wallet[] }) {
  const [payBill, setPayBill] = useState<Bill | null>(null)
  const [isPayOpen, setIsPayOpen] = useState(false)

  // Filter for unpaid bills
  const unpaidBills = bills.filter(b => b.status === 'unpaid')
  
  // Sort by due date
  unpaidBills.sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())

  // Get upcoming (next 7 days) or overdue
  const today = new Date()
  today.setHours(0,0,0,0)
  
  const relevantBills = unpaidBills.filter(bill => {
      const dueDate = new Date(bill.due_date)
      dueDate.setHours(0,0,0,0)
      
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = diffTime / (1000 * 60 * 60 * 24)
      
      // Show overdue or due in next 7 days
      return diffDays <= 7
  }).slice(0, 5) // Limit to 5 items

  const getDayStatus = (dateString: string) => {
      const dueDate = new Date(dateString)
      dueDate.setHours(0,0,0,0)
      
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays < 0) return { text: `Telat ${Math.abs(diffDays)} hari`, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30", diff: diffDays }
      if (diffDays === 0) return { text: "Hari ini", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", diff: diffDays }
      if (diffDays === 1) return { text: "Besok", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30", diff: diffDays }
      return { text: `${diffDays} hari lagi`, color: "text-zinc-500", bg: "bg-zinc-100 dark:bg-zinc-800", diff: diffDays }
  }

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <CardTitle>Tagihan Mendatang</CardTitle>
        <CardDescription>
          Tagihan yang harus segera dibayar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {relevantBills.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground text-sm">
                    Tidak ada tagihan mendesak.
                </div>
            ) : (
                relevantBills.map(bill => {
                    const status = getDayStatus(bill.due_date)
                    // Show Pay button if overdue, today, or tomorrow (diff <= 1)
                    // Logic: status.diff <= 1 matches "Besok atau lebih [dekat/lewat]"
                    const showPayButton = status.diff <= 1

                    return (
                        <div key={bill.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${status.bg}`}>
                                    {status.color.includes('red') ? 
                                        <AlertCircle className={`h-4 w-4 ${status.color}`} /> : 
                                        <Clock className={`h-4 w-4 ${status.color}`} />
                                    }
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{bill.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatDate(bill.due_date)} • {bill.categories?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-bold">{formatCurrency(Number(bill.amount))}</p>
                                    <p className={`text-xs ${status.color} font-medium`}>{status.text}</p>
                                </div>
                                {showPayButton && (
                                    <Button 
                                        size="xs" 
                                        variant="outline" 
                                        className="h-8 w-8 p-0 rounded-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 dark:border-emerald-800 dark:hover:bg-emerald-950"
                                        onClick={() => {
                                            setPayBill(bill)
                                            setIsPayOpen(true)
                                        }}
                                        title="Bayar Sekarang"
                                    >
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )
                })
            )}
            
            <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard/bills">Lihat Semua Tagihan</Link>
            </Button>
        </div>

        <PayBillDialog 
            bill={payBill} 
            wallets={wallets} 
            open={isPayOpen} 
            onOpenChange={setIsPayOpen} 
        />
      </CardContent>
    </Card>
  )
}

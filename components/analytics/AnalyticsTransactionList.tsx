"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDown, ArrowUp, Wallet } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"
import { useState, useMemo } from "react"

interface Transaction {
    id: string
    amount: number
    type: 'income' | 'expense'
    description: string
    date: string
    wallet_id: string
    wallets?: {
        name: string
    } | null
    categories?: {
        name: string
        icon: string
    } | null
}

export function AnalyticsTransactionList({ transactions }: { transactions: Transaction[] }) {
    const [selectedWallet, setSelectedWallet] = useState<string>("all")

    // Get unique wallet names for filter
    const walletOptions = useMemo(() => {
        const wallets = new Set<string>()
        transactions.forEach(t => {
            const walletName = t.wallets?.name || 'Unknown Wallet'
            wallets.add(walletName)
        })
        return Array.from(wallets).sort()
    }, [transactions])

    // Filter transactions based on selected wallet
    const filteredTransactions = useMemo(() => {
        if (selectedWallet === "all") return transactions
        return transactions.filter(t => (t.wallets?.name || 'Unknown Wallet') === selectedWallet)
    }, [transactions, selectedWallet])

    // Group transactions by wallet name
    const groupedTransactions = useMemo(() => {
        return filteredTransactions.reduce((groups, transaction) => {
            const walletName = transaction.wallets?.name || 'Unknown Wallet'
            if (!groups[walletName]) {
                groups[walletName] = []
            }
            groups[walletName].push(transaction)
            return groups
        }, {} as Record<string, Transaction[]>)
    }, [filteredTransactions])

    // Calculate totals per wallet
    const walletTotals = useMemo(() => {
        const totals: Record<string, { income: number; expense: number; net: number }> = {}
        Object.keys(groupedTransactions).forEach(walletName => {
            const walletTransactions = groupedTransactions[walletName]
            const income = walletTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0)
            const expense = walletTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
            totals[walletName] = { income, expense, net: income - expense }
        })
        return totals
    }, [groupedTransactions])

    // Grand totals
    const grandTotals = useMemo(() => {
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, net: income - expense }
    }, [filteredTransactions])

    const walletNames = Object.keys(groupedTransactions).sort()

    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-7">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Riwayat Mutasi</CardTitle>
                <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                    <SelectTrigger className="w-[180px]">
                        <Wallet className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Pilih dompet" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Dompet</SelectItem>
                        {walletOptions.map(wallet => (
                            <SelectItem key={wallet} value={wallet}>
                                {wallet}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent>
                {/* Grand Total Summary */}
                <div className="mb-6 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 border">
                    <h4 className="text-sm font-medium text-zinc-500 mb-3">Total Keseluruhan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-zinc-500">Pemasukan</p>
                            <p className="text-lg font-bold text-emerald-600">+{formatCurrency(grandTotals.income)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Pengeluaran</p>
                            <p className="text-lg font-bold text-red-600">-{formatCurrency(grandTotals.expense)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500">Selisih</p>
                            <p className={`text-lg font-bold ${grandTotals.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                {formatCurrency(grandTotals.net)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {filteredTransactions.length === 0 ? (
                        <p className="text-sm text-zinc-500">Belum ada transaksi.</p>
                    ) : (
                        walletNames.map((walletName) => (
                            <div key={walletName} className="space-y-3">
                                <div className="flex md:flex-row flex-col justify-between">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                        {walletName}
                                    </h3>
                                    {/* Wallet Totals */}
                                    <div className="flex items-center gap-1 text-sm">
                                        <span className="text-xs text-zinc-500 font-medium">Saldo :</span>
                                        <span className={`font-medium ${(walletTotals[walletName]?.net || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                             {formatCurrency(walletTotals[walletName]?.net || 0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-3 pl-4 border-l-2 border-slate-100 dark:border-slate-800 ml-1">
                                    {groupedTransactions[walletName].map((t) => (
                                        <div key={t.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${t.type === 'income' ? 'border-emerald-200 bg-emerald-50 text-emerald-600' : 'border-red-200 bg-red-50 text-red-600'}`}>
                                                    {t.type === 'income' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-medium leading-none">{t.description}</p>
                                                    <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                        <span>{t.categories?.name || 'Uncategorized'}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(t.date, "dd MMMM yyyy")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-medium text-sm ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

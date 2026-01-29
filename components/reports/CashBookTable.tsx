"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { LedgerTransaction } from "@/lib/actions/reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

export function CashBookTable({ transactions }: { transactions: LedgerTransaction[] }) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buku Kas</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada data transaksi.
            </div>
          ) : (
            transactions.map((t) => (
              <Card key={t.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">{t.category_name}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(t.date)}</div>
                    </div>
                    <div className={`flex items-center gap-1 font-semibold ${t.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.type === 'income' ? (
                        <ArrowUpCircle className="h-4 w-4" />
                      ) : (
                        <ArrowDownCircle className="h-4 w-4" />
                      )}
                      <span>{formatCurrency(t.amount)}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Dompet:</span>
                      <span>{t.wallet_name}</span>
                    </div>
                    {t.description && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Keterangan:</span>
                        <span className="text-right">{t.description}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Dompet</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead className="text-right text-emerald-600">Masuk (Debit)</TableHead>
                <TableHead className="text-right text-red-600">Keluar (Kredit)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Tidak ada data transaksi.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell>{formatDate(t.date)}</TableCell>
                    <TableCell>{t.wallet_name}</TableCell>
                    <TableCell>{t.category_name}</TableCell>
                    <TableCell>{t.description}</TableCell>
                    <TableCell className="text-right font-medium text-emerald-600">
                      {t.type === 'income' ? formatCurrency(t.amount) : '-'}
                    </TableCell>
                    <TableCell className="text-right font-medium text-red-600">
                       {t.type === 'expense' ? formatCurrency(t.amount) : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { formatCurrency } from "@/lib/utils"
import { useState } from "react"
import { markBillAsPaid } from "@/lib/actions/bills"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface Bill {
  id: string
  name: string
  amount: number
}

interface Wallet {
  id: string
  name: string
  balance: number
}

interface PayBillDialogProps {
  bill: Bill | null
  wallets: Wallet[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PayBillDialog({ bill, wallets, open, onOpenChange }: PayBillDialogProps) {
  const [selectedWalletId, setSelectedWalletId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handlePay = async () => {
    if (!bill || !selectedWalletId) return

    setIsLoading(true)
    const result = await markBillAsPaid(bill.id, selectedWalletId)
    setIsLoading(false)

    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("Tagihan berhasil dibayar")
      onOpenChange(false)
      setSelectedWalletId("") // Reset
    }
  }

  if (!bill) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Bayar Tagihan</DialogTitle>
          <DialogDescription>
            Konfirmasi pembayaran untuk tagihan <strong>{bill.name}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center border-b pb-4">
            <span className="text-sm text-muted-foreground">Jumlah Tagihan</span>
            <span className="font-bold text-lg">{formatCurrency(bill.amount)}</span>
          </div>

          <div className="grid gap-2">
            <Label>Pilih Sumber Dana (Dompet)</Label>
            <Select onValueChange={setSelectedWalletId} value={selectedWalletId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih dompet" />
              </SelectTrigger>
              <SelectContent>
                {wallets.map((wallet) => (
                  <SelectItem key={wallet.id} value={wallet.id}>
                    {wallet.name} ({formatCurrency(wallet.balance)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handlePay} disabled={!selectedWalletId || isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Bayar Sekarang
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

import * as z from "zod"

export const walletSchema = z.object({
  name: z.string().min(1, "Nama dompet wajib diisi"),
  type: z.enum(["cash", "bank", "ewallet", "credit_card", "investment", "other"]),
  initialBalance: z.number().min(0, "Saldo awal tidak boleh negatif"),
})

export type WalletValues = z.infer<typeof walletSchema>

export const transferSchema = z.object({
  fromWalletId: z.string().min(1, "Dompet asal wajib dipilih"),
  toWalletId: z.string().min(1, "Dompet tujuan wajib dipilih"),
  amount: z.number().min(1, "Jumlah transfer minimal 1"),
  date: z.string(),
  description: z.string().optional(),
})

export type TransferValues = z.infer<typeof transferSchema>

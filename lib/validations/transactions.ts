import * as z from "zod"

export const transactionSchema = z.object({
  amount: z.number().min(1, { message: "Jumlah harus lebih besar dari 0" }),
  type: z.enum(["income", "expense"], {
    message: "Pilih tipe transaksi",
  }),
  categoryId: z.string().min(1, { message: "Pilih kategori" }),
  walletId: z.string().min(1, { message: "Pilih dompet" }),
  description: z.string().optional(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
})

export type TransactionValues = z.infer<typeof transactionSchema>

import * as z from "zod"

export const budgetSchema = z.object({
  categoryId: z.string().min(1, { message: "Pilih kategori" }),
  amount: z.number().min(1, { message: "Jumlah harus lebih besar dari 0" }),
  period: z.enum(["monthly", "yearly"]),
})

export type BudgetValues = z.infer<typeof budgetSchema>

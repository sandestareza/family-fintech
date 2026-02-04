import * as z from "zod"

export const billSchema = z.object({
  name: z.string().min(1, { message: "Nama tagihan harus diisi" }),
  amount: z.number().min(1, { message: "Jumlah harus lebih besar dari 0" }),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Format tanggal tidak valid",
  }),
  category: z.string().min(1, { message: "Pilih kategori" }),
  frequency: z.enum(["one_time", "monthly", "yearly"], {
    message: "Pilih frekuensi pembayaran",
  }),
})

export type BillValues = z.infer<typeof billSchema>

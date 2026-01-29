import * as z from "zod"

export const profileSchema = z.object({
  full_name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }).optional(),
})

export type ProfileValues = z.infer<typeof profileSchema>

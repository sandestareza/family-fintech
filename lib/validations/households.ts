import { z } from "zod"

export const updateHouseholdSchema = z.object({
  name: z
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .trim(),
})

export type UpdateHouseholdValues = z.infer<typeof updateHouseholdSchema>

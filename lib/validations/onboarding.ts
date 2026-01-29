import * as z from "zod"

export const createHouseholdSchema = z.object({
  name: z.string().min(2, { message: "Nama keluarga minimal 2 karakter" }),
  currency: z.string(),
})

export const joinHouseholdSchema = z.object({
  inviteCode: z.string().length(6, { message: "Kode undangan harus 6 karakter" }),
})

export type CreateHouseholdValues = z.infer<typeof createHouseholdSchema>
export type JoinHouseholdValues = z.infer<typeof joinHouseholdSchema>

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createHouseholdSchema, CreateHouseholdValues } from "@/lib/validations/onboarding"
import { createHousehold } from "@/lib/actions/onboarding"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function CreateHouseholdForm() {
  const [isLoading, setIsLoading] = useState(false)
  
  const form = useForm<CreateHouseholdValues>({
    resolver: zodResolver(createHouseholdSchema),
    defaultValues: {
      name: "",
      currency: "IDR",
    },
  })

  async function onSubmit(data: CreateHouseholdValues) {
    setIsLoading(true)
    const result = await createHousehold(data.name, data.currency)
    if (result?.error) {
       // Ideally show toast
       console.error(result.error)
       setIsLoading(false)
    }
    // Redirect handles success state, but if we stay here:
    // setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Keluarga</FormLabel>
              <FormControl>
                <Input placeholder="Keluarga Cemara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Buat Dompet
        </Button>
      </form>
    </Form>
  )
}

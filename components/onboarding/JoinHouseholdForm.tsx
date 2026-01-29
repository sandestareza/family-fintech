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
import { joinHouseholdSchema, JoinHouseholdValues } from "@/lib/validations/onboarding"
import { joinHousehold } from "@/lib/actions/onboarding"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function JoinHouseholdForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const form = useForm<JoinHouseholdValues>({
    resolver: zodResolver(joinHouseholdSchema),
    defaultValues: {
      inviteCode: "",
    },
  })

  async function onSubmit(data: JoinHouseholdValues) {
    setIsLoading(true)
    setErrorMessage("")
    const result = await joinHousehold(data.inviteCode)
    
    if (result?.error) {
       setErrorMessage(result.error)
       setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="inviteCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode Undangan (6 Digit)</FormLabel>
              <FormControl>
                <Input placeholder="ABC123" {...field} className="uppercase" maxLength={6} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {errorMessage && (
            <div className="text-sm font-medium text-red-500">{errorMessage}</div>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Gabung
        </Button>
      </form>
    </Form>
  )
}

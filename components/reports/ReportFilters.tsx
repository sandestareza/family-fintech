"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn, formatDate } from "@/lib/utils"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarIcon, FilterX, Printer } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { DateRange } from "react-day-picker"

interface Wallet {
    id: string
    name: string
}

export function ReportFilters({ wallets }: { wallets: Wallet[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [date, setDate] = useState<DateRange | undefined>(() => {
      const start = searchParams.get("startDate")
      const end = searchParams.get("endDate")
      if (start && end) {
          return {
              from: new Date(start),
              to: new Date(end)
          }
      }
      return undefined
  })

  // Update URL when date changes
  useEffect(() => {
    if (date?.from) {
        const params = new URLSearchParams(searchParams)
        params.set("startDate", formatDate(date.from, "yyyy-MM-dd"))
        if (date.to) {
            params.set("endDate", formatDate(date.to, "yyyy-MM-dd"))
        } else {
            params.delete("endDate")
        }
        router.push(`/dashboard/reports?${params.toString()}`)
    }
  }, [date, router, searchParams])

  const currentWallet = searchParams.get("walletId") || "all"

  const handleWalletChange = (value: string) => {
      const params = new URLSearchParams(searchParams)
      if (value === "all") {
          params.delete("walletId")
      } else {
          params.set("walletId", value)
      }
      router.push(`/dashboard/reports?${params.toString()}`)
  }
  
  const handleReset = () => {
      setDate(undefined)
      router.push("/dashboard/reports")
  }

  const handlePrint = () => {
      window.print()
  }

  return (
    <div className="flex flex-col gap-3 mb-6 w-full print:hidden">
        {/* Wallet and Date Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Select value={currentWallet} onValueChange={handleWalletChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Semua Dompet" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Semua Dompet</SelectItem>
                    {wallets.map((w) => (
                        <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                    "w-full sm:w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                    date.to ? (
                        <>
                        {formatDate(date.from, "dd LLL y")} -{" "}
                        {formatDate(date.to, "dd LLL y")}
                        </>
                    ) : (
                        formatDate(date.from, "dd LLL y")
                    )
                    ) : (
                    <span>Pilih Tanggal</span>
                    )}
                </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 2}
                    locale={id}
                />
                </PopoverContent>
            </Popover>

            {(currentWallet !== "all" || date) && (
                <Button variant="ghost" size="icon" onClick={handleReset} title="Reset Filter" className="shrink-0">
                    <FilterX className="h-4 w-4" />
                </Button>
            )}
        </div>

        {/* Print Button Row */}
        <div className="flex justify-end">
             <Button variant="outline" onClick={handlePrint} className="gap-2 w-full sm:w-auto">
                 <Printer className="h-4 w-4" />
                 <span className="sm:inline">Cetak</span>
             </Button>
        </div>
    </div>
  )
}

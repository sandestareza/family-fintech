"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: number
  onValueChange?: (value: number) => void
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value = 0, onValueChange, ...props }, ref) => {
    // Format number with thousand separators
    const formatNumber = (num: number): string => {
      if (isNaN(num) || num === 0) return ""
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    // Parse formatted string back to number
    const parseNumber = (str: string): number => {
      const cleaned = str.replace(/\./g, "")
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? 0 : parsed
    }

    // Always show formatted value
    const displayValue = formatNumber(value || 0)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      // Only allow numbers and dots
      const cleaned = inputValue.replace(/[^\d]/g, "")
      
      // Parse to number and update immediately with formatting
      const numValue = parseNumber(cleaned)
      onValueChange?.(numValue)
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
          Rp.
        </span>
        <Input
          type="text"
          inputMode="numeric"
          className={cn("pl-10", className)}
          value={displayValue}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }

"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useSidebar } from "./sidebar-context"

interface DashboardHeaderProps {
    householdName?: string
}

export function DashboardHeader({ householdName }: DashboardHeaderProps) {
  const { toggle } = useSidebar()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 dark:bg-black dark:border-zinc-800 md:px-8">
      <div className="flex items-center gap-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={toggle}>
           <Menu className="h-5 w-5" />
        </Button>
      </div>
      <span className="font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">{householdName}</span>
      <div className="ml-auto flex items-center gap-4">
        <ModeToggle />
      </div>
    </header>
  )
}

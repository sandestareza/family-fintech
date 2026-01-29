"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Wallet, 
  PieChart, 
  Settings, 
  LogOut,
  BarChart,
  ArrowLeftRight,
  ChevronUp,
  FileText
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSidebar } from "./sidebar-context"

const sidebarItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Wallets",
    href: "/dashboard/wallets",
    icon: Wallet,
  },
  {
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowLeftRight,
  },
  {
    title: "Budget",
    href: "/dashboard/budget",
    icon: PieChart,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
]

interface DashboardSidebarProps {
    user?: {
        name: string | null
        email: string | null
        avatarUrl: string | null
    }
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isOpen, close } = useSidebar()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/login")
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const sidebarContent = (
    <>
      <div className="flex h-16 items-center border-b px-6 dark:border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <span className="rounded-lg bg-blue-600 p-1 text-white">FF</span>
          <span>FamilyFintech</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
      <div className="border-t p-4 dark:border-zinc-800">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 h-auto py-3 px-2 focus:outline-none focus-visible:ring-0">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl || ""} alt={user?.name || "User"} />
                        <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start gap-0.5 overflow-hidden text-left flex-1">
                        <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-50">
                            {user?.name || "User"}
                        </span>
                        <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                            {user?.email || ""}
                        </span>
                    </div>
                    <ChevronUp className="h-4 w-4 text-zinc-500 ml-auto" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56" side="top">
                <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link href="/dashboard/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={close}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 flex-col border-r bg-white dark:bg-black dark:border-zinc-800 transition-transform duration-300 md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden w-64 flex-col border-r bg-white dark:bg-black dark:border-zinc-800 md:flex">
        {sidebarContent}
      </aside>
    </>
  )
}

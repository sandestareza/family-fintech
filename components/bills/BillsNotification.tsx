"use client"

import { useBillNotifications } from "@/hooks/use-bill-notifications"
import { useEffect } from "react"

interface Bill {
    id: string
    name: string
    amount: number
    due_date: string
    status: 'unpaid' | 'paid'
}

export function BillsNotification({ bills }: { bills: Bill[] }) {
    const { checkAndNotify } = useBillNotifications(bills)

    useEffect(() => {
        checkAndNotify()
    }, [bills, checkAndNotify])

    return null
}

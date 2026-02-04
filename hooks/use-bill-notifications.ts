"use client"

import { useEffect, useState } from "react"

interface Bill {
    id: string
    name: string
    amount: number
    due_date: string
    status: 'unpaid' | 'paid'
}

export function useBillNotifications(bills: Bill[]) {
    const [permission, setPermission] = useState<NotificationPermission>('default')

    useEffect(() => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            setPermission(Notification.permission)
        }
    }, [])

    useEffect(() => {
        if (permission === 'default' && typeof window !== 'undefined' && 'Notification' in window) {
            // Request permission once
            // But usually better to request on user interaction. 
            // For now, let's request on mount if features is active.
            // Or maybe just don't auto-request to avoid being annoying.
            // Let's only prompt if we actually have bills due? 
            // But we need permission "default" to even ask.
            // If "granted", we just send.
        }
    }, [permission])

    const requestPermission = async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
            const result = await Notification.requestPermission()
            setPermission(result)
            return result
        }
        return 'denied'
    }

    const checkAndNotify = async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) return

        let currentPermission = permission
        if (currentPermission === 'default') {
            currentPermission = await requestPermission()
        }

        if (currentPermission !== 'granted') return

        const today = new Date()
        today.setHours(0,0,0,0)
        
        const tomorrow = new Date(today)
        tomorrow.setDate(today.getDate() + 1)

        const dueBills = bills.filter(b => {
             if (b.status === 'paid') return false
             const dueDate = new Date(b.due_date)
             dueDate.setHours(0,0,0,0)
             
             return dueDate.getTime() === today.getTime() || dueDate.getTime() === tomorrow.getTime()
        })

        if (dueBills.length > 0) {
            // Check if we already notified today? 
            // Using localStorage to prevent spamming on every refresh
            const lastNotified = localStorage.getItem('last_bill_notification')
            const now = new Date().toDateString()

            if (lastNotified !== now) {
                new Notification("Tagihan Jatuh Tempo!", {
                    body: `Halo! Ada ${dueBills.length} tagihan yang harus dibayar hari ini atau besok.`,
                    icon: "/icons/icon-192x192.png" // if available or default
                })
                localStorage.setItem('last_bill_notification', now)
            }
        }
    }

    return { requestPermission, checkAndNotify, permission }
}

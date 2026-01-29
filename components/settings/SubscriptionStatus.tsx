"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"

export function SubscriptionStatus() {
  // Mock data
  const currentPlan = "Free"
  const features = [
    "Unlimited transactions",
    "Basic budgeting",
    "2 household members",
  ]

  const premiumFeatures = [
    "Everything in Free",
    "Advanced analytics",
    "Unlimited members",
    "Export to CSV/PDF",
    "Priority support",
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Paket Saat Ini</CardTitle>
            <Badge>{currentPlan}</Badge>
          </div>
          <CardDescription>Anda menggunakan paket gratis</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="border-emerald-500">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Family Premium</CardTitle>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              Rp 49.000/bulan
            </Badge>
          </div>
          <CardDescription>Kelola keuangan keluarga dengan lebih baik</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {premiumFeatures.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default">
            Upgrade ke Premium
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

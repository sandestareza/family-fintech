"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, ArrowLeft } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreateHouseholdForm } from "@/components/onboarding/CreateHouseholdForm"
import { JoinHouseholdForm } from "@/components/onboarding/JoinHouseholdForm"

export default function OnboardingPage() {
  const [mode, setMode] = useState<'selection' | 'create' | 'join'>('selection')

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {mode === 'selection' && "Selamat Datang!"}
          {mode === 'create' && "Buat Dompet Baru"}
          {mode === 'join' && "Gabung Keluarga"}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {mode === 'selection' && "Bagaimana Anda ingin memulai perjalanan finansial Anda?"}
            {mode === 'create' && "Mulai atur keuangan keluarga Anda dari nol."}
            {mode === 'join' && "Masukkan kode undangan untuk bergabung."}
        </p>
      </div>
      
      {mode === 'selection' && (
        <div className="grid gap-4">
          <Card className="cursor-pointer transition-all hover:border-blue-500 hover:shadow-md" onClick={() => setMode('create')}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">Saya Kepala Keluarga</CardTitle>
                <CardDescription>Buat dompet keluarga baru & undang pasangan.</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer transition-all hover:border-blue-500 hover:shadow-md" onClick={() => setMode('join')}>
            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <UserPlus className="h-6 w-6" />
              </div>
               <div className="space-y-1">
                <CardTitle className="text-base">Saya Ingin Bergabung</CardTitle>
                <CardDescription>Gabung ke dompet keluarga yang sudah ada.</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      {mode === 'create' && (
        <div className="space-y-4">
             <CreateHouseholdForm />
             <Button variant="ghost" className="w-full" onClick={() => setMode('selection')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
             </Button>
        </div>
      )}

      {mode === 'join' && (
        <div className="space-y-4">
             <JoinHouseholdForm />
             <Button variant="ghost" className="w-full" onClick={() => setMode('selection')}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
             </Button>
        </div>
      )}
    </div>
  )
}

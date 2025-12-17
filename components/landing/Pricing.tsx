import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const plans = [
  {
    name: "Free",
    price: "Rp 0",
    description: "Untuk pasangan yang baru memulai.",
    features: ["Pencatatan Manual", "1 Dompet Bersama", "Laporan Bulanan Sederhana"],
    cta: "Mulai Gratis",
    variant: "outline" as const
  },
  {
    name: "Family Premium",
    price: "Rp 49rb",
    period: "/bulan",
    description: "Fitur lengkap untuk keluarga modern.",
    features: ["Sync Bank Otomatis", "Unlimited Dompet", "Budgeting Cerdas", "Laporan Mendalam"],
    cta: "Coba Gratis 14 Hari",
    variant: "default" as const,
    popular: true
  }
]

export function Pricing() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
          Pilihan Paket
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`relative flex flex-col rounded-3xl border p-8 shadow-sm ${plan.popular ? 'border-blue-600 dark:border-blue-500 scale-105' : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-medium text-white">
                  Most Popular
                </div>
              )}
              <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">{plan.name}</h3>
              <div className="mb-4 flex items-end gap-1">
                <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{plan.price}</span>
                {plan.period && <span className="mb-1 text-zinc-600 dark:text-zinc-400">{plan.period}</span>}
              </div>
              <p className="mb-6 text-zinc-600 dark:text-zinc-400">{plan.description}</p>
              <ul className="mb-8 space-y-4 flex-1">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} variant={plan.variant}>
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

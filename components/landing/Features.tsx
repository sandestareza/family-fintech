import { Wallet, ChartBar, PieChart } from 'lucide-react'

const features = [
  {
    icon: Wallet,
    title: "Shared Wallet",
    description: "Kelola dompet bersama untuk pengeluaran rumah tangga dengan transparan."
  },
  {
    icon: PieChart,
    title: "Budgeting",
    description: "Buat anggaran bulanan dan pantau pengeluaran agar tetap on track."
  },
  {
    icon: ChartBar,
    title: "Analytics",
    description: "Dapatkan wawasan tentang kebiasaan pengeluaran Anda dan buat keputusan yang lebih baik."
  }
]

export function Features() {
  return (
    <section className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-4xl">
          Fitur Utama
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, i) => (
            <div key={i} className="flex flex-col items-center text-center rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-50">{feature.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

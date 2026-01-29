import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden py-20 text-center md:py-32">
      <div className="z-10 px-4 md:px-6">
        <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm text-zinc-800 backdrop-blur-sm dark:border-zinc-800 dark:bg-black/50 dark:text-zinc-200">
          <span className="mr-2 flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Family Fintech v1.0
        </div>
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-6xl lg:text-7xl">
          Atur Keuangan Rumah Tangga, <br className="hidden md:block" />
          <span className="bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Tanpa Drama
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
          Transparansi, kemudahan input, dan kolaborasi untuk pasangan modern.
          Mulai perjalanan finansial keluarga Anda hari ini.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button size="lg" className="h-12 w-full px-8 text-lg sm:w-auto" asChild>
            <Link href="/register">
              Coba Gratis 14 Hari
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-12 w-full px-8 text-lg sm:w-auto" asChild>
            <Link href="/login">
              Masuk
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[100px]"></div>
      <div className="absolute top-0 right-0 -z-10 h-[300px] w-[300px] bg-indigo-500/20 blur-[100px]"></div>
    </section>
  )
}

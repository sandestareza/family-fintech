import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/30">
          <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Cek Email Kamu</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Kami telah mengirimkan link verifikasi ke{' '}
          <span className="font-medium text-zinc-900 dark:text-zinc-100">
            {email || 'alamat email kamu'}
          </span>
          .
        </p>
      </div>
      <div className="space-y-4">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Klik link di email tersebut untuk mengaktifkan akunmu, lalu login.
        </p>
        <Button asChild className="w-full">
            <Link href={`/login?email=${encodeURIComponent(email || '')}`}>
                Ke Halaman Login
            </Link>
        </Button>
      </div>
    </div>
  )
}

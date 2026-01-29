import Link from "next/link"
import { RegisterForm } from "@/components/auth/RegisterForm"

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Buat Akun Baru</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Mulai atur keuangan keluarga Anda hari ini.
        </p>
      </div>
      <RegisterForm />
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Masuk
        </Link>
      </div>
    </div>
  )
}

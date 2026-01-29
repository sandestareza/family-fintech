import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Masuk untuk mengelola keuangan Anda.
        </p>
      </div>
      <LoginForm />
      <div className="text-center text-sm text-zinc-500 dark:text-zinc-400">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400">
          Daftar
        </Link>
      </div>
    </div>
  )
}

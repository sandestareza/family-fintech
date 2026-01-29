export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
      <main className="w-full max-w-md space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-zinc-100 dark:bg-black dark:border-zinc-800">
        {children}
      </main>
    </div>
  )
}

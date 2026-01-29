import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose text-zinc-600 dark:text-zinc-400 md:text-left">
            Built by Family Fintech. The source code is available on{" "}
            <Link href="https://github.com/sandestareza/family-fintech" className="font-medium underline underline-offset-4">GitHub</Link>.
          </p>
        </div>
        <div className="flex gap-4">
            <Link href="#" className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400">Privacy Policy</Link>
            <Link href="#" className="text-sm text-zinc-600 underline-offset-4 hover:underline dark:text-zinc-400">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}

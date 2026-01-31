function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4"
        >
          <div className="h-4 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="mt-3 h-6 w-32 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default SummaryCardsSkeleton;

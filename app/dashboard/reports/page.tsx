import { getTransactionsLedger } from "@/lib/actions/reports";
import { getWallets } from "@/lib/actions/wallets"; // We need this for the filter
import { CashBookTable } from "@/components/reports/CashBookTable";
import { ReportFilters } from "@/components/reports/ReportFilters";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Await searchParams before accessing properties
  const params = await Promise.resolve(searchParams);

  // Extract filters
  const walletId =
    typeof params.walletId === "string" ? params.walletId : undefined;
  const startDate =
    typeof params.startDate === "string" ? params.startDate : undefined;
  const endDate =
    typeof params.endDate === "string" ? params.endDate : undefined;

  const transactions = await getTransactionsLedger({
    walletId,
    startDate,
    endDate,
  });

  const wallets = await getWallets();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h2>
        <p className="text-muted-foreground">
          Buku kas detail transaksi pemasukan dan pengeluaran.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <ReportFilters wallets={wallets} />
      </div>

      <CashBookTable transactions={transactions} />
    </div>
  );
}

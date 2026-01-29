import { AddWalletDialog } from "@/components/wallets/AddWalletDialog"
import { TransferDialog } from "@/components/wallets/TransferDialog"
import { WalletList } from "@/components/wallets/WalletList"
import { getWallets } from "@/lib/actions/wallets"

export default async function WalletsPage() {
  const wallets = await getWallets()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Dompet Saya</h2>
            <p className="text-muted-foreground">Kelola berbagai akun dan saldo Anda.</p>
        </div>
        <div className="flex gap-2">
            <TransferDialog wallets={wallets} />
            <AddWalletDialog />
        </div>
      </div>

      <WalletList wallets={wallets} />
    </div>
  )
}

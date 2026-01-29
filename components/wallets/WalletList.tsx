"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wallet,
  CreditCard,
  Banknote,
  Building2,
  PiggyBank,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { EditWalletDialog } from "./EditWalletDialog";
import { deleteWallet } from "@/lib/actions/wallets";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

interface WalletItem {
  id: string;
  name: string;
  type: string;
  balance: number;
}

const getIcon = (type: string) => {
  switch (type) {
    case "cash":
      return <Banknote className="h-5 w-5" />;
    case "bank":
      return <Building2 className="h-5 w-5" />;
    case "ewallet":
      return <Wallet className="h-5 w-5" />;
    case "credit_card":
      return <CreditCard className="h-5 w-5" />;
    case "investment":
      return <PiggyBank className="h-5 w-5" />;
    default:
      return <Wallet className="h-5 w-5" />;
  }
};

export function WalletList({ wallets }: { wallets: WalletItem[] }) {
  const [editingWallet, setEditingWallet] = useState<WalletItem | null>(null);

  const handleDelete = async (id: string) => {
    if (
      confirm(
        "Apakah Anda yakin ingin menghapus dompet ini? Transaksi terkait tidak akan terhapus, namun tidak akan memiliki dompet.",
      )
    ) {
      const result = await deleteWallet(id);
      if (result?.error) {
        console.log(result.error);
        toast.error(result.error);
        return;
      }
      toast.success("Dompet berhasil dihapus");
    }
  };

  if (wallets.length === 0) {
    return (
      <div className="text-center py-10 border rounded-lg bg-zinc-50 dark:bg-zinc-900 border-dashed">
        <p className="text-zinc-500">Belum ada dompet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {wallets.map((wallet) => (
          <Card
            key={wallet.id}
            className="hover:border-blue-500 transition-colors relative group"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {wallet.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="text-zinc-500">{getIcon(wallet.type)}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 -mr-2"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingWallet(wallet)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => handleDelete(wallet.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(wallet.balance)}
              </div>
              <p className="text-xs text-muted-foreground capitalize">
                {wallet.type.replace("_", " ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {editingWallet && (
        <EditWalletDialog
          wallet={editingWallet}
          open={!!editingWallet}
          onOpenChange={(open) => !open && setEditingWallet(null)}
        />
      )}
    </>
  );
}

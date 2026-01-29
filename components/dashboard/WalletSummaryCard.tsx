"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export function WalletSummaryCard({ wallets }: { wallets: Wallet[] }) {
  const totalBalance = wallets.reduce(
    (acc, curr) => acc + Number(curr.balance),
    0,
  );

  return (
    <Card className="col-span-3 lg:col-span-3">
      <CardHeader>
        <CardTitle>Total Saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-4">
          {formatCurrency(totalBalance)}
        </div>
        <div className="space-y-4">
          {wallets.map((wallet) => (
            <div key={wallet.id} className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {wallet.name}
                </p>
                {/* <p className="text-sm text-muted-foreground">Example User</p> */}
              </div>
              <div className="ml-auto font-medium">
                {formatCurrency(wallet.balance)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

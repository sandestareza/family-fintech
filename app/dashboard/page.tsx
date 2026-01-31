import {
  getDashboardStats,
  getRecentTransactions,
  getRecentTransactionsByLimit,
} from "@/lib/actions/dashboard";
import { getMonthlyStats } from "@/lib/actions/chart";
import { getCategories } from "@/lib/actions/transactions";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { OverviewChart } from "@/components/dashboard/OverviewChart";
import { AddTransactionDialog } from "@/components/transactions/AddTransactionDialog";
import { getWallets } from "@/lib/actions/wallets";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single();

  if (!member) {
    redirect("/onboarding");
  }

  const stats = await getDashboardStats();
  const transactions = await getRecentTransactionsByLimit(5);
  const monthlyStats = await getMonthlyStats();
  const categories = await getCategories();

  const wallets = await getWallets();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <AddTransactionDialog categories={categories} wallets={wallets} />
      </div>
      <SummaryCards stats={stats} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RecentTransactions transactions={transactions} />
        <div className="col-span-4 lg:col-span-4 rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6">
            <h3 className="font-semibold leading-none tracking-tight mb-4">
              Financial Overview
            </h3>
            <OverviewChart data={monthlyStats} />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  Edit,
  MoreVertical,
  Trash,
  Repeat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { deleteBill } from "@/lib/actions/bills";
import { toast } from "sonner";
import { EditBillDialog } from "./EditBillDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Bill {
  id: string;
  name: string;
  amount: number;
  due_date: string;
  status: "unpaid" | "paid";
  frequency: "one_time" | "monthly" | "yearly";
  category_id: string;
  categories?: {
    name: string;
    icon: string;
  };
}

interface Category {
  id: string;
  name: string;
  type: string;
}

import { PayBillDialog } from "./PayBillDialog";

interface Wallet {
  id: string;
  name: string;
  balance: number;
}

export function BillList({
  bills,
  categories,
  wallets,
}: {
  bills: Bill[];
  categories: Category[];
  wallets: Wallet[];
}) {
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [payBill, setPayBill] = useState<Bill | null>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const unpaidBills = bills.filter((b) => b.status === "unpaid");
  const paidBills = bills.filter((b) => b.status === "paid");

  // Sort unpaid by due date (soonest first)
  unpaidBills.sort(
    (a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime(),
  );

  // Sort paid by due date (newest first)
  paidBills.sort(
    (a, b) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime(),
  );

  const handleDelete = async () => {
    if (!deletingId) return;
    const result = await deleteBill(deletingId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Tagihan dihapus");
    }
    setDeletingId(null);
  };

  const getDayDifference = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderBillCard = (bill: Bill) => {
    const daysLeft = getDayDifference(bill.due_date);
    const isOverdue = daysLeft < 0 && bill.status === "unpaid";
    const isDueSoon =
      daysLeft >= 0 && daysLeft <= 3 && bill.status === "unpaid";

    return (
      <div
        key={bill.id}
        className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2 rounded-full ${
              bill.status === "paid"
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30"
                : isOverdue
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800"
            }`}
          >
            {bill.status === "paid" ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <Clock className="h-5 w-5" />
            )}
          </div>
          <div>
            <h4 className="font-semibold">{bill.name}</h4>
            <div className="flex items-center w-full gap-2 text-sm text-muted-foreground">
              <span
                className={`${isOverdue ? "text-red-500 font-medium" : ""}`}
              >
                {formatDate(bill.due_date)}
              </span>
              {bill.frequency !== "one_time" && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">
                    <Repeat className="h-3 w-3" />
                    {bill.frequency === "monthly" ? "Bulanan" : "Tahunan"}
                  </span>
                </>
              )}
            </div>
            {bill.categories?.name && (
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                {bill.categories.name}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="font-bold">{formatCurrency(Number(bill.amount))}</p>
            {bill.status === "unpaid" ? (
              <p
                className={`text-xs ${isOverdue ? "text-red-500" : isDueSoon ? "text-amber-500" : "text-muted-foreground"}`}
              >
                {isOverdue
                  ? `Telat ${Math.abs(daysLeft)} hari`
                  : daysLeft === 0
                    ? "Hari ini"
                    : `${daysLeft} hari lagi`}
              </p>
            ) : (
              <p className="text-xs w-fit ml-auto bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded dark:bg-emerald-900/30 dark:text-emerald-400">
                Lunas
              </p>
            )}
          </div>

          {bill.status === "unpaid" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    setPayBill(bill);
                    setIsPayOpen(true);
                  }}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />
                  Tandai Lunas
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setEditingBill(bill);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={() => setDeletingId(bill.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Unpaid Bills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          Belum Dibayar
          <span className="text-sm font-normal text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            {unpaidBills.length}
          </span>
        </h3>
        {unpaidBills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border rounded-lg border-dashed">
            Tidak ada tagihan yang belum dibayar.
          </div>
        ) : (
          <div className="grid gap-3">{unpaidBills.map(renderBillCard)}</div>
        )}
      </div>

      {/* Paid Bills */}
      {paidBills.length > 0 && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-lg font-semibold text-muted-foreground">
            Riwayat Tagihan
          </h3>
          <div className="grid gap-3 opacity-75">
            {paidBills.map(renderBillCard)}
          </div>
        </div>
      )}

      <PayBillDialog
        bill={payBill}
        wallets={wallets}
        open={isPayOpen}
        onOpenChange={setIsPayOpen}
      />

      <EditBillDialog
        bill={editingBill}
        categories={categories}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => !open && setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tagihan ini akan dihapus permanen. Tindakan ini tidak dapat
              dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

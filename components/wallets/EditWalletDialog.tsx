"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { updateWallet } from "@/lib/actions/wallets";
import * as z from "zod";
import { toast } from "sonner";

const editWalletSchema = z.object({
  name: z.string().min(1, "Nama dompet wajib diisi"),
  type: z.enum([
    "cash",
    "bank",
    "ewallet",
    "credit_card",
    "investment",
    "other",
  ]),
});

type EditWalletValues = z.infer<typeof editWalletSchema>;

interface Wallet {
  id: string;
  name: string;
  type: string;
  balance: number;
}

interface EditWalletDialogProps {
  wallet: Wallet;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWalletDialog({
  wallet,
  open,
  onOpenChange,
}: EditWalletDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditWalletValues>({
    resolver: zodResolver(editWalletSchema),
    defaultValues: {
      name: wallet.name,
      type: wallet.type as EditWalletValues["type"],
    },
  });

  async function onSubmit(data: EditWalletValues) {
    setIsLoading(true);
    const result = await updateWallet(wallet.id, data);
    setIsLoading(false);

    if (result?.error) {
      console.log(result.error);
      toast.error(result.error);
    } else {
      onOpenChange(false);
      toast.success("Dompet berhasil diperbarui");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dompet</DialogTitle>
          <DialogDescription>Ubah nama atau tipe dompet.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Dompet</FormLabel>
                  <FormControl>
                    <Input placeholder="Contoh: BCA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="cash">Tunai</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="ewallet">E-Wallet</SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                      <SelectItem value="investment">Investasi</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

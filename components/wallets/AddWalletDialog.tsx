"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Loader2, Plus } from "lucide-react";
import { createWallet } from "@/lib/actions/wallets";
import { walletSchema, WalletValues } from "@/lib/validations/wallets";
import { toast } from "sonner";

export function AddWalletDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WalletValues>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      name: "",
      type: "cash",
      initialBalance: 0,
    },
  });

  async function onSubmit(data: WalletValues) {
    setIsLoading(true);
    const result = await createWallet(data);
    setIsLoading(false);

    if (result?.error) {
      console.log(result.error);
      toast.error(result.error);
    } else {
      setOpen(false);
      form.reset();
      toast.success("Dompet berhasil ditambahkan");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Dompet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Dompet Baru</DialogTitle>
          <DialogDescription>
            Buat dompet baru untuk memisahkan pos keuangan Anda.
          </DialogDescription>
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
                    <Input placeholder="Contoh: BCA, Dompet Saku" {...field} />
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
                      <SelectItem value="ewallet">
                        E-Wallet (OVO, GoPay, dll)
                      </SelectItem>
                      <SelectItem value="credit_card">Kartu Kredit</SelectItem>
                      <SelectItem value="investment">Investasi</SelectItem>
                      <SelectItem value="other">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="initialBalance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Saldo Awal</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder="0"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Simpan
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

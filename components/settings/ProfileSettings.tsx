"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileValues } from "@/lib/validations/profile";
import { updateProfile } from "@/lib/actions/profile";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ProfileSettingsProps {
  initialData: {
    full_name: string;
    email: string;
  };
}

export function ProfileSettings({ initialData }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData.full_name || "",
      email: initialData.email || "",
    },
  });

  async function onSubmit(data: ProfileValues) {
    setIsLoading(true);
    const result = await updateProfile({ full_name: data.full_name });
    setIsLoading(false);

    if (!result?.error) {
      toast.success("Profil berhasil diperbarui");
      router.refresh();
      return;
    }
    toast.error(result?.error);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Pengguna</CardTitle>
        <CardDescription>Kelola informasi pribadi Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Lengkap</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" disabled {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">
                    Email tidak bisa diubah untuk keamanan
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

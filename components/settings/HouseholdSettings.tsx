"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Pencil, Check, X, Loader2 } from "lucide-react";
import { updateHouseholdName } from "@/lib/actions/onboarding";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateHouseholdSchema } from "@/lib/validations/households";

interface HouseholdSettingsProps {
  householdId: string;
  householdName: string;
  userRole: string;
}

export function HouseholdSettings({
  householdId,
  householdName,
  userRole,
}: HouseholdSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(householdName);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isOwner = userRole === "suami";

  const handleSave = async () => {
    // Validate
    const result = updateHouseholdSchema.safeParse({ name });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    const response = await updateHouseholdName(householdId, name);
    setIsLoading(false);

    if (response?.error) {
      toast.error(response.error);
    } else {
      toast.success("Nama keluarga berhasil diubah");
      setIsEditing(false);
      router.refresh();
    }
  };

  const handleCancel = () => {
    setName(householdName);
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informasi Keluarga</CardTitle>
        <CardDescription>Kelola informasi keluarga Anda</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            Nama Keluarga
          </label>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama keluarga"
                disabled={isLoading}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-1 px-3 py-2 bg-muted rounded-md">
                {householdName}
              </div>
              {isOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

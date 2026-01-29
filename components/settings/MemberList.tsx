import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export async function MemberList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: member } = await supabase
    .from("household_members")
    .select("household_id")
    .eq("user_id", user.id)
    .single();

  if (!member) return null;

  // Fetch members with profiles
  const { data: fetchedMembers } = await supabase
    .from("household_members")
    .select(
      `
            user_id,
            role,
            profiles (
                full_name,
                avatar_url,
                email
            )
        `,
    )
    .eq("household_id", member.household_id);

  const members = fetchedMembers;

  interface MemberWithProfile {
    user_id: string;
    role: string;
    profiles: {
      full_name: string | null;
      avatar_url: string | null;
      email: string | null;
    } | null; // Singular because of relationship, though usually 'profiles' implies array, Supabase returns object if singular foreign key
    // Actually Supabase returns array usually unless .single(), but here it's joined.
    // Based on usage m.profiles.full_name, it seems it is an object (single).
  }

  // Actually simpler to just cast inside the map to avoid complex type definition matching Supabase return exactly
  // Calculate contributions
  // Ideally use a DB aggregation, but for < 10 members this is fine.
  const memberStats = await Promise.all(
    (members || []).map(async (m: unknown) => {
      // Cast 'm' to MemberWithProfile
      const memberItem = m as MemberWithProfile;

      const { data: transactions } = await supabase
        .from("transactions")
        .select("amount, type")
        .eq("user_id", memberItem.user_id)
        .eq("household_id", member.household_id);

      const income =
        transactions
          ?.filter((t) => t.type === "income")
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      const expense =
        transactions
          ?.filter((t) => t.type === "expense")
          .reduce((sum, t) => sum + Number(t.amount), 0) || 0;

      return {
        ...memberItem,
        income,
        expense,
      };
    }),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anggota Keluarga</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        {memberStats.map((m, i) => (
          <div
            key={i}
            className="flex items-center justify-between space-x-4 border-b pb-4 last:border-0 last:pb-0"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={m.profiles?.avatar_url || ""} />
                <AvatarFallback>
                  {m.profiles?.full_name?.[0] || "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">
                    {m.profiles?.full_name}
                  </p>
                  <Badge
                    variant={m.role === "suami" ? "default" : "outline"}
                    className="text-[10px] h-5"
                  >
                    {m.role === "suami" ? "Suami" : "Istri"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {m.profiles?.email}
                </p>
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="text-emerald-600">
                +{formatCurrency(m.income)}
              </div>
              <div className="text-red-600">-{formatCurrency(m.expense)}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

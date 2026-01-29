-- 1. Helper Function: Security Definer to bypass RLS recursion
create or replace function public.get_my_household_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select household_id
  from public.household_members
  where user_id = auth.uid();
$$;

-- 2. Household Members Policy
-- Allow users to see:
-- a) Their own membership row (Direct check)
-- b) Members of households they belong to (Via helper function)

drop policy if exists "Members can view other members in the same household" on public.household_members;
drop policy if exists "Users can view own membership" on public.household_members; -- Clean up if any

create policy "Detailed Access to Household Members" on public.household_members
  for select using (
    -- Case A: It's me
    auth.uid() = user_id
    OR
    -- Case B: It's someone in my household (uses helper to avoid recursion)
    household_id in (select public.get_my_household_ids())
  );

-- 3. Households Policy (Ensure this is also correct)
drop policy if exists "Households are viewable by members" on public.households;

create policy "Households are viewable by members" on public.households
  for select using (
    id in (select public.get_my_household_ids())
  );

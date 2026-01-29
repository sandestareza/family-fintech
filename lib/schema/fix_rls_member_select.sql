-- Ensure members can view other members in the same household
drop policy if exists "Members can view other members in the same household" on public.household_members;

create policy "Members can view other members in the same household" on public.household_members
  for select using (
    household_id in (
      select household_id 
      from public.household_members as hm
      where hm.user_id = auth.uid()
    )
  );

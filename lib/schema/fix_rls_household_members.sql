-- Allow users to insert themselves into household_members
-- This is necessary for creating a new household (user becomes suami) 
-- or joining one (user becomes istri)
create policy "Users can join households" on public.household_members
  for insert with check (auth.uid() = user_id);

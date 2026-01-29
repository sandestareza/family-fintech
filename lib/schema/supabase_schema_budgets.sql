-- Create budgets table
create table public.budgets (
  id uuid not null default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  amount numeric not null,
  period text default 'monthly', -- monthly, yearly
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id),
  unique(household_id, category_id) -- One budget per category per household
);

alter table public.budgets enable row level security;

create policy "Budgets Viewable by Household Members" on public.budgets
  for select using (
    exists (
      select 1 from public.household_members
      where household_members.household_id = budgets.household_id
      and household_members.user_id = auth.uid()
    )
  );

create policy "Budgets Insertable/Updatable by Household Members" on public.budgets
  for all using (
    exists (
      select 1 from public.household_members
      where household_members.household_id = budgets.household_id
      and household_members.user_id = auth.uid()
    )
  );

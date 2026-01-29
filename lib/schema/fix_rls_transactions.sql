-- Enable RLS for all financial tables
alter table public.wallets enable row level security;
alter table public.categories enable row level security;
alter table public.transactions enable row level security;

-- Wallets Policies
drop policy if exists "Wallets viewable by household members" on public.wallets;
create policy "Wallets viewable by household members" on public.wallets
  for select using (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Wallets insertable by household members" on public.wallets;
create policy "Wallets insertable by household members" on public.wallets
  for insert with check (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Wallets updatable by household members" on public.wallets;
create policy "Wallets updatable by household members" on public.wallets
  for update using (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Wallets deletable by household members" on public.wallets;
create policy "Wallets deletable by household members" on public.wallets
  for delete using (household_id in (select public.get_auth_user_household_ids()));

-- Categories Policies
drop policy if exists "Categories viewable by household members" on public.categories;
create policy "Categories viewable by household members" on public.categories
  for select using (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Categories insertable by household members" on public.categories;
create policy "Categories insertable by household members" on public.categories
  for insert with check (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Categories updatable by household members" on public.categories;
create policy "Categories updatable by household members" on public.categories
  for update using (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Categories deletable by household members" on public.categories;
create policy "Categories deletable by household members" on public.categories
  for delete using (household_id in (select public.get_auth_user_household_ids()));

-- Transactions Policies
drop policy if exists "Transactions viewable by household members" on public.transactions;
create policy "Transactions viewable by household members" on public.transactions
  for select using (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Transactions insertable by household members" on public.transactions;
create policy "Transactions insertable by household members" on public.transactions
  for insert with check (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Transactions updatable by household members" on public.transactions;
create policy "Transactions updatable by household members" on public.transactions
  for update using (household_id in (select public.get_auth_user_household_ids()));

drop policy if exists "Transactions deletable by household members" on public.transactions;
create policy "Transactions deletable by household members" on public.transactions
  for delete using (household_id in (select public.get_auth_user_household_ids()));

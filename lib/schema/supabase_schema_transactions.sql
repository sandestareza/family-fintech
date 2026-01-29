-- Create categories table
create table public.categories (
  id uuid not null default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  type text check (type in ('income', 'expense')) not null,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.categories enable row level security;

create policy "Categories Viewable by Household Members" on public.categories
  for select using (
    exists (
      select 1 from public.household_members
      where household_members.household_id = categories.household_id
      and household_members.user_id = auth.uid()
    )
  );

create policy "Categories Insertable by Household Members" on public.categories
  for insert with check (
    exists (
      select 1 from public.household_members
      where household_members.household_id = categories.household_id
      and household_members.user_id = auth.uid()
    )
  );

-- Create transactions table
create table public.transactions (
  id uuid not null default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  category_id uuid references public.categories(id) on delete set null,
  amount numeric not null,
  type text check (type in ('income', 'expense')) not null,
  description text,
  date date not null default CURRENT_DATE,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  primary key (id)
);

alter table public.transactions enable row level security;

create policy "Transactions Viewable by Household Members" on public.transactions
  for select using (
    exists (
      select 1 from public.household_members
      where household_members.household_id = transactions.household_id
      and household_members.user_id = auth.uid()
    )
  );

create policy "Transactions Insertable by Household Members" on public.transactions
  for insert with check (
    exists (
      select 1 from public.household_members
      where household_members.household_id = transactions.household_id
      and household_members.user_id = auth.uid()
    )
  );

-- Insert Default Categories (Optional Helper Function)
create or replace function public.add_default_categories(target_household_id uuid)
returns void as $$
begin
  insert into public.categories (household_id, name, type, icon) values
  (target_household_id, 'Gaji', 'income', 'briefcase'),
  (target_household_id, 'Investasi', 'income', 'trending-up'),
  (target_household_id, 'Makanan', 'expense', 'utensils'),
  (target_household_id, 'Transportasi', 'expense', 'bus'),
  (target_household_id, 'Tempat Tinggal', 'expense', 'home'),
  (target_household_id, 'Hiburan', 'expense', 'tv');
end;
$$ language plpgsql security definer;

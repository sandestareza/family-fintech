-- Create Bills Table
create table public.bills (
  id uuid not null default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  amount numeric not null,
  due_date date not null,
  status text check (status in ('unpaid', 'paid')) default 'unpaid',
  frequency text check (frequency in ('one_time', 'monthly', 'yearly')) default 'one_time',
  category_id uuid references public.categories(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Enable RLS
alter table public.bills enable row level security;

-- Policies
create policy "Bills Viewable by Household Members" on public.bills
  for select using (
    household_id in (select public.get_auth_user_household_ids())
  );

create policy "Bills Insertable by Household Members" on public.bills
  for insert with check (
    household_id in (select public.get_auth_user_household_ids())
  );

create policy "Bills Editable by Household Members" on public.bills
  for update using (
    household_id in (select public.get_auth_user_household_ids())
  );

create policy "Bills Deletable by Household Members" on public.bills
  for delete using (
    household_id in (select public.get_auth_user_household_ids())
  );

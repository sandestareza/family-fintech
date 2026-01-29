-- 1. Create Wallets Table
create table public.wallets (
  id uuid not null default gen_random_uuid(),
  household_id uuid not null references public.households(id) on delete cascade,
  name text not null,
  type text check (type in ('cash', 'bank', 'ewallet', 'credit_card', 'investment', 'other')) default 'cash',
  balance numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Enable RLS
alter table public.wallets enable row level security;

-- Policies for Wallets
create policy "Wallets Viewable by Household Members" on public.wallets
  for select using (
    household_id in (select public.get_my_household_ids())
  );

create policy "Wallets Insertable by Household Members" on public.wallets
  for insert with check (
    household_id in (select public.get_my_household_ids())
  );

create policy "Wallets Editable by Household Members" on public.wallets
  for update using (
    household_id in (select public.get_my_household_ids())
  );
  
create policy "Wallets Deletable by Household Members" on public.wallets
  for delete using (
    household_id in (select public.get_my_household_ids())
  );


-- 2. Update Transactions Table
-- Add wallet_id
alter table public.transactions 
add column if not exists wallet_id uuid references public.wallets(id) on delete set null;

-- Add transfer_id for linking transfers
alter table public.transactions 
add column if not exists transfer_id uuid;

-- 3. Trigger to create default 'Cash' wallet for existing households (Optional but good for migration)
-- This is tricky to do in pure SQL for existing data without a loop, but we can do a simple insert for households deemed to have no wallets.
do $$
declare
  hh record;
  w_id uuid;
begin
  for hh in select id from public.households loop
    -- Check if wallet exists
    if not exists (select 1 from public.wallets where household_id = hh.id) then
        insert into public.wallets (household_id, name, type, balance)
        values (hh.id, 'Dompet Tunai', 'cash', 0)
        returning id into w_id;
        
        -- Update existing transactions to use this wallet
        update public.transactions
        set wallet_id = w_id
        where household_id = hh.id and wallet_id is null;
    end if;
  end loop;
end;
$$;

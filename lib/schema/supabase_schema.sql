-- Create tables first to avoid dependency issues

-- 1. Profiles
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone,
  primary key (id)
);

-- 2. Households
create table public.households (
  id uuid not null default gen_random_uuid(),
  name text not null,
  currency text default 'IDR',
  invite_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- 3. Household Members
create table public.household_members (
  household_id uuid not null references public.households on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text check (role in ('suami', 'istri')) default 'suami',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (household_id, user_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;

-- Helper Functions (for RLS to avoid recursion and cleaner logic)
-- Returns the list of household_ids the current user belongs to.
-- Security definer allows it to bypass RLS on household_members when checking.
create or replace function public.get_auth_user_household_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select household_id
  from public.household_members
  where user_id = auth.uid();
$$;

-- Policies

-- Profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Households
-- Use the helper function effectively
create policy "Households are viewable by members" on public.households
  for select using (
    id in (select public.get_auth_user_household_ids())
  );

create policy "Users can create households" on public.households
  for insert with check (true);

-- Household Members
create policy "Members can view other members in the same household" on public.household_members
  for select using (
    household_id in (select public.get_auth_user_household_ids())
  );

-- Triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Check if trigger exists before creating to avoid errors on repeated runs if dropping is not handled
-- Ideally we drop triggers if they exist, but for a simple schema file, we'll assume fresh or clean slate.
-- However, 'create trigger' will fail if it exists.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Add email column to profiles
alter table public.profiles add column if not exists email text;

-- Update trigger to store email
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, email)
  values (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

-- Optional: You might want to backfill existing users manually because accessing auth.users directly 
-- in a massive update might time out or be tricky without a loop. 
-- But for a small number of users, this PL/PGSQL block might work if you run it in SQL Editor:

do $$
declare
  user_record record;
begin
  for user_record in select * from auth.users loop
    update public.profiles
    set email = user_record.email
    where id = user_record.id;
  end loop;
end;
$$;

-- Create a secure function to look up household by invite code
-- This bypasses RLS for the lookup, allowing non-members to find a household to join.

create or replace function public.get_household_by_invite_code(code text)
returns setof public.households
language plpgsql
security definer
as $$
begin
  return query
  select *
  from public.households
  where invite_code = code;
end;
$$;

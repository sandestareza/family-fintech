-- Function to update wallet balance on transaction changes
create or replace function public.update_wallet_balance()
returns trigger as $$
begin
  -- 1. Handle INSERT
  if (TG_OP = 'INSERT') then
    if (new.type = 'income') then
      update public.wallets set balance = balance + new.amount where id = new.wallet_id;
    elsif (new.type = 'expense') then
      update public.wallets set balance = balance - new.amount where id = new.wallet_id;
    end if;
    return new;
    
  -- 2. Handle DELETE
  elsif (TG_OP = 'DELETE') then
    if (old.type = 'income') then
      update public.wallets set balance = balance - old.amount where id = old.wallet_id;
    elsif (old.type = 'expense') then
      update public.wallets set balance = balance + old.amount where id = old.wallet_id;
    end if;
    return old;
    
  -- 3. Handle UPDATE (e.g. amount changed, or type changed, or wallet moved)
  elsif (TG_OP = 'UPDATE') then
    -- Revert Old
    if (old.type = 'income') then
      update public.wallets set balance = balance - old.amount where id = old.wallet_id;
    elsif (old.type = 'expense') then
      update public.wallets set balance = balance + old.amount where id = old.wallet_id;
    end if;
    
    -- Apply New
    if (new.type = 'income') then
      update public.wallets set balance = balance + new.amount where id = new.wallet_id;
    elsif (new.type = 'expense') then
      update public.wallets set balance = balance - new.amount where id = new.wallet_id;
    end if;
    return new;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- Create Trigger
drop trigger if exists on_transaction_change on public.transactions;
create trigger on_transaction_change
  after insert or update or delete on public.transactions
  for each row execute procedure public.update_wallet_balance();

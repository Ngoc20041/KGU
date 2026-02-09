-- Bảng giao dịch thu chi (Câu hỏi 2 - Quản lý thu chi)
-- Chạy trong Supabase: SQL Editor -> New query -> paste và Run

create table if not exists public.expense_transaction (
  id uuid primary key default gen_random_uuid(),
  amount numeric not null check (amount > 0),
  category text not null,
  note text,
  date date not null,
  type text not null check (type in ('income', 'expense')),
  created_at timestamptz default now()
);

-- Cho phép đọc/ghi qua Supabase anon (hoặc dùng RLS theo user_id sau)
alter table public.expense_transaction enable row level security;

create policy "Allow all for expense_transaction (demo)"
  on public.expense_transaction
  for all
  using (true)
  with check (true);

-- Index để lọc theo ngày
create index if not exists idx_expense_transaction_date on public.expense_transaction (date desc);
create index if not exists idx_expense_transaction_type on public.expense_transaction (type);

comment on table public.expense_transaction is 'Giao dịch thu/chi - Quản lý chi tiêu (Câu hỏi 2)';

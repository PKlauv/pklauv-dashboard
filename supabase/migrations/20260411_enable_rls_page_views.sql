-- Enable RLS on page_views so the anon key can insert but not read/update/delete
alter table public.page_views enable row level security;

-- Allow anonymous inserts (used by the public tracking endpoint)
create policy "anon_insert_page_views"
  on public.page_views
  for insert
  to anon
  with check (true);

-- Allow anonymous reads (used by the public dashboard)
create policy "anon_select_page_views"
  on public.page_views
  for select
  to anon
  using (true);

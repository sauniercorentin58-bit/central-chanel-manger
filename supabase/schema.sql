create extension if not exists "pgcrypto";

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  address text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.interventions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  property_id uuid not null references public.properties(id) on delete cascade,
  cleaner_name text not null,
  scheduled_for timestamptz not null,
  notes text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.checklist_items (
  id uuid primary key default gen_random_uuid(),
  intervention_id uuid not null references public.interventions(id) on delete cascade,
  label text not null,
  completed boolean not null default false,
  order_index int not null default 0,
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.properties enable row level security;
alter table public.interventions enable row level security;
alter table public.checklist_items enable row level security;

create policy "Users can manage own properties"
  on public.properties for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage own interventions"
  on public.interventions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage checklist through own interventions"
  on public.checklist_items for all
  using (
    exists (
      select 1
      from public.interventions i
      where i.id = checklist_items.intervention_id
      and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.interventions i
      where i.id = checklist_items.intervention_id
      and i.user_id = auth.uid()
    )
  );

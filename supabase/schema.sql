-- Spider Pro — esquema de Supabase (capa gratuita: Auth + Postgres)
-- Ejecutar completo en el SQL Editor del proyecto de Supabase (Bloque 11.2).
-- Row Level Security ACTIVADA en todas las tablas — cada usuario solo puede
-- leer/escribir sus propias filas (auth.uid() = user_id). No es opcional.

-- 1) Perfiles ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles
  for delete using (auth.uid() = id);

-- Crea automáticamente una fila en profiles cuando alguien se registra vía Google OAuth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2) Tablas de dominio, un blob JSONB por usuario --------------------------
-- academy_progress, arcade_stats, terminal_state y settings se sincronizan
-- como un único documento JSON por usuario — el mismo shape que ya vive en
-- localStorage, sin necesidad de migraciones cada vez que cambia un campo.

create table if not exists public.academy_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.arcade_stats (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.terminal_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 3) Tablas fila-por-registro (para poder unir sin perder nunca un ítem) ---

create table if not exists public.achievements (
  user_id uuid not null references auth.users (id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table if not exists public.journal_entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  entry_id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, entry_id)
);

-- 4) RLS idéntica en todas: cada quien solo ve y toca sus propias filas ---
do $$
declare
  t text;
begin
  foreach t in array array['academy_progress', 'arcade_stats', 'terminal_state', 'settings', 'achievements', 'journal_entries']
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists "%1$s_select_own" on public.%1$I;', t);
    execute format('create policy "%1$s_select_own" on public.%1$I for select using (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s_insert_own" on public.%1$I;', t);
    execute format('create policy "%1$s_insert_own" on public.%1$I for insert with check (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s_update_own" on public.%1$I;', t);
    execute format('create policy "%1$s_update_own" on public.%1$I for update using (auth.uid() = user_id);', t);
    execute format('drop policy if exists "%1$s_delete_own" on public.%1$I;', t);
    execute format('create policy "%1$s_delete_own" on public.%1$I for delete using (auth.uid() = user_id);', t);
  end loop;
end $$;

-- 5) Eliminar cuenta: borra todas las filas del usuario en todas las tablas.
-- Se invoca desde la Netlify Function con la service role key (nunca desde el navegador).
create or replace function public.delete_user_data(target_user_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  delete from public.academy_progress where user_id = target_user_id;
  delete from public.arcade_stats where user_id = target_user_id;
  delete from public.terminal_state where user_id = target_user_id;
  delete from public.settings where user_id = target_user_id;
  delete from public.achievements where user_id = target_user_id;
  delete from public.journal_entries where user_id = target_user_id;
  delete from public.profiles where id = target_user_id;
end;
$$;

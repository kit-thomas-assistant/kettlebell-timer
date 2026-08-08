create table if not exists public.workout_sessions (
  id uuid primary key,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  completed_at timestamptz not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workout_sessions_user_completed_idx
  on public.workout_sessions (user_id, completed_at desc);

alter table public.workout_sessions enable row level security;

drop policy if exists "workout_sessions_select_own" on public.workout_sessions;
create policy "workout_sessions_select_own"
  on public.workout_sessions for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "workout_sessions_insert_own" on public.workout_sessions;
create policy "workout_sessions_insert_own"
  on public.workout_sessions for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "workout_sessions_update_own" on public.workout_sessions;
create policy "workout_sessions_update_own"
  on public.workout_sessions for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "workout_sessions_delete_own" on public.workout_sessions;
create policy "workout_sessions_delete_own"
  on public.workout_sessions for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create or replace function public.set_workout_sessions_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_workout_sessions_updated_at on public.workout_sessions;
create trigger set_workout_sessions_updated_at
before update on public.workout_sessions
for each row execute function public.set_workout_sessions_updated_at();

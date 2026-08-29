create extension if not exists pgcrypto;

create table if not exists public.study_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  created_by uuid not null references auth.users(id) on delete cascade,
  current_phase text not null default 'focus' check (current_phase in ('focus', 'short-break', 'long-break', 'free')),
  is_running boolean not null default false,
  started_at timestamptz,
  planned_seconds integer not null default 1500 check (planned_seconds >= 0),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.study_room_members (
  room_id uuid not null references public.study_rooms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

alter table public.study_rooms enable row level security;
alter table public.study_room_members enable row level security;

create or replace function public.is_study_room_member(room uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.study_room_members
    where room_id = room and user_id = auth.uid()
  );
$$;

drop policy if exists study_rooms_member_select on public.study_rooms;
drop policy if exists study_rooms_create on public.study_rooms;
drop policy if exists study_rooms_member_update on public.study_rooms;
drop policy if exists study_members_select_room on public.study_room_members;
drop policy if exists study_members_leave_own on public.study_room_members;

create policy study_rooms_member_select on public.study_rooms
for select using (created_by = auth.uid() or public.is_study_room_member(id));

create policy study_rooms_create on public.study_rooms
for insert with check (created_by = auth.uid());

create policy study_rooms_member_update on public.study_rooms
for update using (public.is_study_room_member(id))
with check (public.is_study_room_member(id));

create policy study_members_select_room on public.study_room_members
for select using (user_id = auth.uid() or public.is_study_room_member(room_id));

create policy study_members_leave_own on public.study_room_members
for delete using (user_id = auth.uid());

create or replace function public.create_study_room(room_name text, display_name text)
returns public.study_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  room public.study_rooms;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.study_rooms (code, name, created_by)
  values (upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8)), coalesce(nullif(room_name, ''), 'Focus Room'), auth.uid())
  returning * into room;

  insert into public.study_room_members (room_id, user_id, display_name)
  values (room.id, auth.uid(), coalesce(nullif(display_name, ''), 'Member'))
  on conflict (room_id, user_id) do update
    set display_name = excluded.display_name,
        last_seen_at = now();

  return room;
end;
$$;

create or replace function public.join_study_room(room_code text, display_name text)
returns public.study_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  room public.study_rooms;
begin
  if auth.uid() is null then
    raise exception 'Not authenticated';
  end if;

  select * into room from public.study_rooms where code = upper(trim(room_code));
  if room.id is null then
    raise exception 'Room not found';
  end if;

  insert into public.study_room_members (room_id, user_id, display_name, last_seen_at)
  values (room.id, auth.uid(), coalesce(nullif(display_name, ''), 'Member'), now())
  on conflict (room_id, user_id) do update
    set display_name = excluded.display_name,
        last_seen_at = now();

  return room;
end;
$$;

grant execute on function public.create_study_room(text, text) to authenticated;
grant execute on function public.join_study_room(text, text) to authenticated;
grant execute on function public.is_study_room_member(uuid) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.study_rooms;
exception when duplicate_object or undefined_object then null;
end;
$$;

do $$
begin
  alter publication supabase_realtime add table public.study_room_members;
exception when duplicate_object or undefined_object then null;
end;
$$;

notify pgrst, 'reload schema';

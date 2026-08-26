create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  focus_minutes integer not null default 25 check (focus_minutes between 1 and 180),
  short_break_minutes integer not null default 5 check (short_break_minutes between 1 and 60),
  long_break_minutes integer not null default 15 check (long_break_minutes between 1 and 90),
  long_break_interval integer not null default 4 check (long_break_interval between 2 and 8),
  default_activity text not null default 'coding',
  default_mode text not null default 'pomodoro' check (default_mode in ('pomodoro', 'custom', 'free')),
  preferred_music_source text not null default 'focus-sound' check (preferred_music_source in ('spotify', 'focus-sound', 'silent')),
  auto_start_breaks boolean not null default false,
  auto_start_focus boolean not null default false,
  notifications_enabled boolean not null default true,
  session_end_sound_enabled boolean not null default true,
  reduced_motion boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.focus_sessions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  activity text not null,
  custom_activity_name text,
  mode text not null check (mode in ('pomodoro', 'custom', 'free')),
  music_source text not null check (music_source in ('spotify', 'focus-sound', 'silent')),
  playlist_name text not null,
  planned_minutes integer not null check (planned_minutes > 0),
  completed_minutes integer not null check (completed_minutes > 0),
  status text not null check (status in ('completed', 'finished-early', 'active')),
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists focus_sessions_user_completed_idx on public.focus_sessions (user_id, completed_at desc);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_track_id text not null,
  track_title text not null,
  artist_name text not null,
  artwork_url text,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  unique (user_id, provider, provider_track_id)
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.playlist_tracks (
  id uuid primary key default gen_random_uuid(),
  playlist_id uuid not null references public.playlists(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  provider_track_id text not null,
  title text not null,
  artist text not null,
  artwork_url text,
  duration_seconds integer,
  position integer not null default 0,
  created_at timestamptz not null default now(),
  unique (playlist_id, provider, provider_track_id)
);

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

create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  provider text,
  provider_customer_id text,
  provider_subscription_id text,
  status text not null default 'active',
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.focus_sessions enable row level security;
alter table public.favorites enable row level security;
alter table public.playlists enable row level security;
alter table public.playlist_tracks enable row level security;
alter table public.study_rooms enable row level security;
alter table public.study_room_members enable row level security;
alter table public.subscriptions enable row level security;

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

create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

create policy "preferences_select_own" on public.preferences for select using (auth.uid() = user_id);
create policy "preferences_insert_own" on public.preferences for insert with check (auth.uid() = user_id);
create policy "preferences_update_own" on public.preferences for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "preferences_delete_own" on public.preferences for delete using (auth.uid() = user_id);

create policy "focus_sessions_select_own" on public.focus_sessions for select using (auth.uid() = user_id);
create policy "focus_sessions_insert_own" on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "focus_sessions_update_own" on public.focus_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "focus_sessions_delete_own" on public.focus_sessions for delete using (auth.uid() = user_id);

create policy "favorites_select_own" on public.favorites for select using (auth.uid() = user_id);
create policy "favorites_insert_own" on public.favorites for insert with check (auth.uid() = user_id);
create policy "favorites_update_own" on public.favorites for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "favorites_delete_own" on public.favorites for delete using (auth.uid() = user_id);

create policy "playlists_own" on public.playlists for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "playlist_tracks_own" on public.playlist_tracks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "study_rooms_member_select" on public.study_rooms for select using (
  created_by = auth.uid() or public.is_study_room_member(id)
);
create policy "study_rooms_create" on public.study_rooms for insert with check (created_by = auth.uid());
create policy "study_rooms_member_update" on public.study_rooms for update using (
  public.is_study_room_member(id)
) with check (
  public.is_study_room_member(id)
);

create policy "study_members_select_room" on public.study_room_members for select using (
  user_id = auth.uid() or public.is_study_room_member(room_id)
);
create policy "study_members_leave_own" on public.study_room_members for delete using (user_id = auth.uid());

create policy "subscriptions_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
  )
  on conflict (id) do nothing;

  insert into public.preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.subscriptions (user_id, plan)
  values (new.id, 'free')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

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
  values (room.id, auth.uid(), coalesce(nullif(display_name, ''), 'Member'));

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
  on conflict (room_id, user_id) do update set last_seen_at = now(), display_name = excluded.display_name;

  return room;
end;
$$;

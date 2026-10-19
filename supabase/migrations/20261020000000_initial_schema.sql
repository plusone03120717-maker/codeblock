-- CodeBlock：Firestore から移す表と、行ごとの読み書きの決まり（RLS）（2026-10-20）
--
-- Firestore            → Supabase
--   users/{uid}        → profiles（1人1行）
--   users/{uid}/data/progress → user_progress（1人1行・中身は jsonb のまま）
--   userIds・usernames → つくらない（profiles.username の一意で足りる）
--   passwordResets     → つくらない（今は動いていない）
--
-- - 決まった列に入らない項目は extra（jsonb）に入れて、何も落とさずに移す
-- - 管理者は今と同じくメールで決める（is_admin()）
-- - プラン（plan_*）・Stripe の ID は、本人は変えられない（サーバーか管理者だけ）

create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  firebase_uid text unique,
  username text unique, -- ログインのユーザーID（小文字）。Google の人は null のことがある
  login_email text, -- Supabase Auth のメール（ユーザーID の人は <id>@codeblock.local）
  contact_email text, -- 連絡用のメール（本人が入れる）
  display_name text not null default '',
  xp integer not null default 0,
  level integer not null default 1,
  -- プラン
  plan text not null default 'free' check (plan in ('free', 'monthly', 'yearly', 'plusone')),
  plan_status text not null default 'active' check (plan_status in ('active', 'canceled', 'expired')),
  plan_start_date timestamptz,
  plan_end_date timestamptz,
  stripe_customer_id text,
  stripe_subscription_id text,
  -- 実績
  achievements jsonb not null default '[]',
  pending_achievements jsonb not null default '[]',
  lessons_completed jsonb not null default '[]',
  lesson_complete_counts jsonb not null default '{}',
  total_correct integer not null default 0,
  streak_days integer not null default 0,
  last_study_date text,
  consecutive_correct integer not null default 0,
  max_consecutive_correct integer not null default 0,
  no_mistake_lessons jsonb not null default '[]',
  no_hint_lessons jsonb not null default '[]',
  fast_lessons jsonb not null default '[]',
  studied_on_weekend boolean not null default false,
  studied_early boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  extra jsonb not null default '{}'
);

create table public.user_progress (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  progress jsonb not null default '{}', -- visibleLessons・completedLessons・missionProgress・reviewItems など
  updated_at timestamptz not null default now()
);

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();

-- ========================================
-- だれか
-- ========================================

create or replace function public.is_admin() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'plus.one.0312.0717@gmail.com'
$$;

-- ログインの前に「このユーザーIDはあるか」を確かめる（ほかの項目は見せない）
create or replace function public.username_exists(p_username text) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where username = lower(p_username))
$$;
revoke execute on function public.username_exists(text) from public;
grant execute on function public.username_exists(text) to anon, authenticated, service_role;

-- ========================================
-- 行ごとの決まり
-- ========================================

alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

create policy profiles_select on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
-- 新しく登録した人が、自分の行を作る（プランは free だけ。下のトリガーで確かめる）
create policy profiles_insert on public.profiles for insert to authenticated
  with check (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());
create policy profiles_delete on public.profiles for delete to authenticated
  using (public.is_admin());

create policy user_progress_own on public.user_progress for all to authenticated
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- 本人（管理者でない人）が、プラン・Stripe の ID・ユーザーID を変えたら止める。
-- サーバー（service_role）や直接の接続（auth.uid() が null）は止めない
create or replace function public.guard_profile_write() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if auth.uid() is null or public.is_admin() then
    return new;
  end if;
  if tg_op = 'INSERT' then
    if new.plan <> 'free' or new.plan_start_date is not null or new.plan_end_date is not null
      or new.stripe_customer_id is not null or new.stripe_subscription_id is not null then
      raise exception '登録のときのプランは free だけです' using errcode = '42501';
    end if;
  elsif new.plan is distinct from old.plan
    or new.plan_status is distinct from old.plan_status
    or new.plan_start_date is distinct from old.plan_start_date
    or new.plan_end_date is distinct from old.plan_end_date
    or new.stripe_customer_id is distinct from old.stripe_customer_id
    or new.stripe_subscription_id is distinct from old.stripe_subscription_id
    or new.username is distinct from old.username
    or new.firebase_uid is distinct from old.firebase_uid
    or new.login_email is distinct from old.login_email then
    raise exception 'プラン・ユーザーIDはサーバーか管理者だけが変えられます' using errcode = '42501';
  end if;
  return new;
end;
$$;
create trigger guard_profile_write before insert or update on public.profiles
  for each row execute function public.guard_profile_write();

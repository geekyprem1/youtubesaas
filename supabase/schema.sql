-- Enable extensions
create extension if not exists "uuid-ossp";

-- =============================================
-- PROFILES
-- =============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- =============================================
-- DAILY USAGE
-- =============================================
create table if not exists public.daily_usage (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  date date not null default current_date,
  count integer not null default 0,
  unique(user_id, date)
);

alter table public.daily_usage enable row level security;

create policy "Users can view own usage"
  on public.daily_usage for select using (auth.uid() = user_id);

create policy "Service role can manage usage"
  on public.daily_usage for all using (true);

-- =============================================
-- CHANNELS
-- =============================================
create table if not exists public.channels (
  id text primary key, -- YouTube channel ID
  name text not null,
  handle text,
  subscribers bigint default 0,
  total_videos integer default 0,
  total_views bigint default 0,
  description text,
  thumbnail_url text,
  country text,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- VIDEOS
-- =============================================
create table if not exists public.videos (
  id text primary key, -- YouTube video ID
  channel_id text references public.channels on delete cascade not null,
  title text not null,
  description text,
  thumbnail_url text,
  published_at timestamptz,
  view_count bigint default 0,
  like_count bigint default 0,
  comment_count bigint default 0,
  duration text,
  tags text[],
  created_at timestamptz default now()
);

create index if not exists videos_channel_id_idx on public.videos(channel_id);
create index if not exists videos_view_count_idx on public.videos(view_count desc);

-- =============================================
-- ANALYSES
-- =============================================
create table if not exists public.analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  channel_id text references public.channels,
  channel_url text not null,
  status text not null default 'pending' check (status in ('pending', 'analyzing', 'completed', 'failed')),
  step integer default 0,
  channel_dna jsonb,
  top_videos jsonb,
  video_ideas jsonb,
  error_message text,
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert with check (auth.uid() = user_id);

create policy "Service role can manage analyses"
  on public.analyses for all using (true);

create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_status_idx on public.analyses(status);

-- =============================================
-- COMPETITORS
-- =============================================
create table if not exists public.competitors (
  id uuid default uuid_generate_v4() primary key,
  analysis_id uuid references public.analyses on delete cascade not null,
  channel_id text not null,
  channel_name text not null,
  handle text,
  subscribers bigint default 0,
  thumbnail_url text,
  similarity_score integer default 0,
  top_videos jsonb,
  created_at timestamptz default now()
);

alter table public.competitors enable row level security;

create policy "Users can view competitors for own analyses"
  on public.competitors for select
  using (
    exists (
      select 1 from public.analyses
      where analyses.id = competitors.analysis_id
      and analyses.user_id = auth.uid()
    )
  );

create policy "Service role can manage competitors"
  on public.competitors for all using (true);

create index if not exists competitors_analysis_id_idx on public.competitors(analysis_id);

-- =============================================
-- SUBSCRIPTIONS
-- =============================================
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null unique,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  plan text not null default 'free',
  status text not null default 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- =============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- UPDATE TIMESTAMP FUNCTION
-- =============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
  for each row execute procedure public.update_updated_at_column();

create trigger update_channels_updated_at before update on public.channels
  for each row execute procedure public.update_updated_at_column();

-- =====================================================================
-- Channel DNA Match Engine — additive migration.
-- Safe to run on top of the existing schema.sql. Adds richer scoring
-- storage, a competitor-video corpus (cache), clusters, and a queryable
-- recommendations table (replaces the video_ideas JSONB blob over time).
-- =====================================================================

-- ── 1. Cache the structured DNA profile + freshness on the channel itself ──
alter table public.channels
  add column if not exists dna_profile jsonb,            -- DNAProfile (scoring.ts)
  add column if not exists dna_extracted_at timestamptz, -- when DNA was last computed
  add column if not exists last_analyzed_at timestamptz; -- for cache TTL decisions

-- ── 2. Track scoring engine version on each analysis (lets you re-score) ──
alter table public.analyses
  add column if not exists dna_profile jsonb,
  add column if not exists scoring_version integer not null default 1;

-- ── 3. Competitor video corpus — the reusable evidence cache ──
-- One row per competitor video, tagged with normalized topics by the LLM.
-- Reused across analyses so we don't re-fetch the same channels constantly.
create table if not exists public.competitor_videos (
  id text primary key,                 -- YouTube video ID
  channel_id text not null,            -- competitor channel
  title text not null,
  topics text[] default '{}',          -- LLM-normalized topic tags
  view_count bigint default 0,
  like_count bigint default 0,
  comment_count bigint default 0,
  published_at timestamptz,
  views_per_day numeric generated always as (
    case when published_at is null then 0
    else view_count / greatest(1, extract(epoch from (now() - published_at)) / 86400)
    end
  ) stored,
  fetched_at timestamptz default now()
);

create index if not exists comp_videos_channel_idx on public.competitor_videos(channel_id);
create index if not exists comp_videos_topics_idx on public.competitor_videos using gin(topics);
create index if not exists comp_videos_vpd_idx on public.competitor_videos(views_per_day desc);

-- ── 4. Opportunity clusters (STEP 8) ──
create table if not exists public.opportunity_clusters (
  id uuid default uuid_generate_v4() primary key,
  analysis_id uuid references public.analyses on delete cascade not null,
  label text not null,                 -- "Claude Code", "AI Agents"
  avg_opportunity_score integer default 0,
  created_at timestamptz default now()
);
create index if not exists clusters_analysis_idx on public.opportunity_clusters(analysis_id);

-- ── 5. Recommendations — one queryable row per idea (STEP 10) ──
create table if not exists public.recommendations (
  id uuid default uuid_generate_v4() primary key,
  analysis_id uuid references public.analyses on delete cascade not null,
  cluster_id uuid references public.opportunity_clusters on delete set null,
  title text not null,
  -- the five core scores
  dna_match_score integer not null,
  opportunity_score integer not null,
  confidence_score integer not null,
  trend_score integer not null,
  competition_score integer not null,
  -- output payload (STEP 10)
  opportunity_type text check (opportunity_type in ('Emerging','Rising','Validated','Saturated')),
  expected_views_low bigint,
  expected_views_high bigint,
  difficulty text check (difficulty in ('Easy','Medium','Hard')),
  upload_window text,                  -- "Next 14 days"
  why_bullets jsonb,                   -- string[] from explain()
  competitor_proof jsonb,              -- CompetitorProof snapshot
  alternative_angles jsonb,            -- string[]
  score_breakdown jsonb,               -- full breakdown for debugging/audit
  topics text[] default '{}',
  format text,
  created_at timestamptz default now()
);

alter table public.recommendations enable row level security;

create policy "Users view recs for own analyses"
  on public.recommendations for select
  using (exists (
    select 1 from public.analyses
    where analyses.id = recommendations.analysis_id
      and analyses.user_id = auth.uid()
  ));

create policy "Service role manages recommendations"
  on public.recommendations for all using (true);

create index if not exists recs_analysis_idx on public.recommendations(analysis_id);
create index if not exists recs_opportunity_idx on public.recommendations(opportunity_score desc);
create index if not exists recs_confidence_idx on public.recommendations(confidence_score desc);

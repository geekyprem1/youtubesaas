# Deployment Guide — What Is My Next Video?

## Prerequisites

- Node.js 18+
- A Supabase project
- YouTube Data API v3 key
- Google Gemini API key

---

## Step 1: Clone & Install

```bash
cd "C:\Users\user\Documents\C code\Youtube"
npm install
```

---

## Step 2: Supabase Setup

1. Go to [supabase.com](https://supabase.com) → Create new project
2. Open **SQL Editor** → paste the entire contents of `supabase/schema.sql` → Run
3. Go to **Authentication → Providers → Google** → Enable Google OAuth
   - Add your Google OAuth client ID & secret
   - Add redirect URL: `https://your-domain.com/auth/callback`
4. Copy your project URL and API keys from **Settings → API**

---

## Step 3: YouTube Data API v3

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **YouTube Data API v3**
4. Create credentials → API Key
5. Restrict the key to YouTube Data API v3

---

## Step 4: Gemini API

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Create an API key
3. Make sure you have access to **gemini-2.5-flash**

---

## Step 5: Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
YOUTUBE_API_KEY=AIza...
GEMINI_API_KEY=AIza...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 7: Deploy to Vercel (Production)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add all environment variables in Vercel dashboard
4. Deploy

**Important**: In Supabase → Authentication → URL Configuration:
- Site URL: `https://your-vercel-domain.vercel.app`
- Redirect URLs: `https://your-vercel-domain.vercel.app/auth/callback`

---

## Architecture Overview

```
User → Home Page (URL input)
     → Sign up / Sign in (Supabase Auth)
     → POST /api/analyze (starts pipeline)
        → YouTube API: fetch channel + 50 videos
        → Gemini: analyze Channel DNA
        → Calculate performance scores
        → YouTube API: find 10 competitors
        → Gemini: generate 20 video ideas
        → Save all data to Supabase
     → /analysis/[id] (polls status, shows results)
        → Tabs: DNA | Top Videos | Competitors | Ideas
        → Click idea → Pro Content Modal
           → POST /api/pro (Pro users only)
              → Gemini: generate titles, thumbnails, outline, SEO, hooks
```

---

## Free Plan Limits

- 3 analyses per day (tracked in `daily_usage` table)
- All 6 pipeline steps run
- 20 video ideas generated
- Pro Content Pack locked

## Pro Plan

- Unlimited analyses
- Full Pro Content Pack per idea
- Upgrade via Stripe (integrate `STRIPE_*` env vars)

---

## Troubleshooting

**"Channel not found"** — The YouTube handle might be slightly different. Try using the full channel URL from the browser.

**"YOUTUBE_API_KEY is not set"** — Check your `.env.local` file.

**Analysis stuck at step 0** — Check server logs. Usually a YouTube API quota issue.

**Gemini errors** — Ensure you have gemini-2.5-flash access. Try gemini-1.5-flash as fallback in `src/lib/gemini.ts`.

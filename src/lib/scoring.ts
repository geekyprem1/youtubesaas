/**
 * Channel DNA Match Engine — deterministic scoring core.
 *
 * Design principle: the LLM EXTRACTS structured features; this module COMPUTES
 * every score. Same inputs always produce the same score, so each number is
 * explainable and reproducible — that determinism is the product moat.
 *
 * No external deps, no I/O, no LLM calls. Pure functions only.
 */

// ── Structured profile (richer than the flat ChannelDNA in types/index.ts) ──

export type LengthBand = "short" | "mid" | "long";

export interface DNAProfile {
  primaryTopics: string[]; // ["ai tools", "saas", "automation"]
  formats: string[]; // ["tutorial", "case study"]
  audience: string[]; // ["developers", "indie hackers"]
  tone: string[]; // ["educational", "practical"]
  lengthBand: LengthBand; // derived from median video duration
}

export interface OpportunityFeatures {
  topics: string[];
  format: string;
  audience: string[];
  tone: string[];
  lengthBand: LengthBand;
}

/** Aggregated competitor evidence for ONE opportunity topic. */
export interface CompetitorProof {
  combinedViews: number; // sum of views across matching competitor videos
  maxViewsPerDay: number; // hottest single matching video
  coveringChannels: number; // how many competitor channels cover this topic
  totalChannels: number; // competitor pool size (usually 10)
  recentMatches: number; // matching videos published < 90 days ago
  matchCount: number; // total matching competitor videos
}

export type ScoreBreakdown = Record<string, number>;
export interface ScoredResult {
  score: number;
  breakdown: ScoreBreakdown;
}

export type OpportunityType = "Emerging" | "Rising" | "Validated" | "Saturated";

// ── Helpers ──────────────────────────────────────────────────────────────

const clamp = (n: number, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, n));
const norm = (s: string) => s.toLowerCase().trim();

/**
 * Weighted overlap: what fraction of `target`'s terms are covered by `source`,
 * with partial credit for substring matches (e.g. "ai agent" ⊃ "agents").
 * Returns 0-100.
 */
export function termOverlap(target: string[], source: string[]): number {
  if (target.length === 0) return 0;
  const src = source.map(norm);
  let matched = 0;
  for (const tRaw of target) {
    const t = norm(tRaw);
    if (src.includes(t)) matched += 1;
    else if (src.some((s) => s.includes(t) || t.includes(s))) matched += 0.6;
  }
  return clamp((matched / target.length) * 100);
}

/** 100 if value ∈ set, 60 for a fuzzy/substring hit, else 0. */
function membership(value: string, set: string[]): number {
  const v = norm(value);
  const s = set.map(norm);
  if (s.includes(v)) return 100;
  if (s.some((x) => x.includes(v) || v.includes(x))) return 60;
  return 0;
}

const lengthMatch = (a: LengthBand, b: LengthBand): number =>
  a === b ? 100 : (a === "mid" || b === "mid" ? 50 : 0); // mid is adjacent to both

/** Map median duration (seconds) to a band. */
export function bandFromSeconds(sec: number): LengthBand {
  if (sec < 240) return "short"; // < 4 min
  if (sec <= 1200) return "mid"; // 4-20 min
  return "long";
}

/** Parse ISO-8601 "PT8M30S" → seconds. */
export function parseISODuration(iso: string): number {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 0;
  return (+(m[1] ?? 0)) * 3600 + (+(m[2] ?? 0)) * 60 + (+(m[3] ?? 0));
}

// ── STEP 5: Channel DNA Match Score (40/25/20/10/5) ────────────────────────

export function channelDnaMatch(opp: OpportunityFeatures, dna: DNAProfile): ScoredResult {
  const topic = termOverlap(opp.topics, [...dna.primaryTopics]);
  const format = membership(opp.format, dna.formats);
  const audience = termOverlap(opp.audience, dna.audience);
  const tone = termOverlap(opp.tone, dna.tone);
  const length = lengthMatch(opp.lengthBand, dna.lengthBand);

  const score = clamp(
    topic * 0.4 + format * 0.25 + audience * 0.2 + tone * 0.1 + length * 0.05
  );
  return { score: Math.round(score), breakdown: { topic, format, audience, tone, length } };
}

// ── Competitor-derived sub-scores ──────────────────────────────────────────

/** Combined views, log-scaled: ~10M combined → ~100. */
export function competitorValidation(p: CompetitorProof): number {
  return clamp((Math.log10(p.combinedViews + 1) / 7) * 100);
}

/** Hottest matching video's views/day, log-scaled: ~50k/day → ~100. */
export function trendMomentum(p: CompetitorProof): number {
  const base = clamp((Math.log10(p.maxViewsPerDay + 1) / 4.7) * 100);
  const freshness = p.recentMatches > 0 ? Math.min(15, p.recentMatches * 5) : 0;
  return clamp(base + freshness);
}

/** Inverse saturation: few channels covering = high opportunity. */
export function competitionLevel(p: CompetitorProof): number {
  if (p.totalChannels === 0) return 50;
  return clamp(100 - (p.coveringChannels / p.totalChannels) * 100);
}

// ── STEP 6: Opportunity Score (40/25/20/15) ────────────────────────────────

export function opportunityScore(dnaMatch: number, p: CompetitorProof): ScoredResult {
  const validation = competitorValidation(p);
  const trend = trendMomentum(p);
  const competition = competitionLevel(p);

  const score = clamp(
    validation * 0.4 + dnaMatch * 0.25 + trend * 0.2 + competition * 0.15
  );
  return {
    score: Math.round(score),
    breakdown: { validation, dnaMatch, trend, competition },
  };
}

// ── STEP 7: Confidence Score (35/30/20/15) ─────────────────────────────────

export function confidenceScore(
  dnaMatch: number,
  audienceSub: number,
  p: CompetitorProof
): ScoredResult {
  const competitorSuccess = competitorValidation(p);
  const trend = trendMomentum(p);

  const score = clamp(
    dnaMatch * 0.35 + competitorSuccess * 0.3 + trend * 0.2 + audienceSub * 0.15
  );
  return {
    score: Math.round(score),
    breakdown: { dnaMatch, competitorSuccess, trend, audienceFit: audienceSub },
  };
}

// ── Classification + interpretation ────────────────────────────────────────

export function classifyOpportunity(p: CompetitorProof): OpportunityType {
  const saturation = p.totalChannels ? p.coveringChannels / p.totalChannels : 0;
  const hot = trendMomentum(p) >= 70;
  if (saturation >= 0.6) return "Saturated";
  if (saturation <= 0.2 && hot) return "Emerging";
  if (hot) return "Rising";
  return "Validated";
}

export function interpretMatch(score: number): string {
  if (score >= 90) return "Perfect Match";
  if (score >= 80) return "Strong Match";
  if (score >= 70) return "Good Match";
  if (score >= 60) return "Weak Match";
  return "Reject";
}

/** STEP 9: turn the math into human "why this will work" bullets. */
export function explain(
  dna: ScoredResult,
  opp: ScoredResult,
  p: CompetitorProof
): string[] {
  const why: string[] = [];
  if (dna.breakdown.topic >= 70) why.push("Matches your top-performing topics");
  if (dna.breakdown.format >= 60) why.push("Same format as your best videos");
  if (dna.breakdown.audience >= 60) why.push("Strong audience overlap");
  if (p.combinedViews > 0)
    why.push(`Competitors generated ${formatViews(p.combinedViews)} combined views`);
  if (opp.breakdown.trend >= 70) why.push("Trend is accelerating right now");
  if (opp.breakdown.competition >= 70)
    why.push(`Only ${p.coveringChannels}/${p.totalChannels} competitors cover this — low competition`);
  return why;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

/**
 * STEP 4 helper: build CompetitorProof for an opportunity by matching its
 * topics against tagged competitor videos. `videoTopics` is the LLM-assigned
 * topic list per competitor video (Advanced); MVP can pass title tokens.
 */
export function buildProof(
  oppTopics: string[],
  competitorVideos: Array<{
    channelId: string;
    views: number;
    publishedAt: string;
    topics: string[];
  }>,
  totalChannels: number
): CompetitorProof {
  const wanted = oppTopics.map(norm);
  const matching = competitorVideos.filter((v) =>
    v.topics.some((t) => wanted.some((w) => norm(t).includes(w) || w.includes(norm(t))))
  );
  const now = Date.now();
  const channels = new Set(matching.map((v) => v.channelId));
  let combinedViews = 0;
  let maxViewsPerDay = 0;
  let recentMatches = 0;
  for (const v of matching) {
    combinedViews += v.views;
    const days = Math.max(1, (now - new Date(v.publishedAt).getTime()) / 86_400_000);
    maxViewsPerDay = Math.max(maxViewsPerDay, v.views / days);
    if (days < 90) recentMatches += 1;
  }
  return {
    combinedViews,
    maxViewsPerDay,
    coveringChannels: channels.size,
    totalChannels,
    recentMatches,
    matchCount: matching.length,
  };
}

// ── MVP topic matching (no LLM tagging yet — Advanced replaces this) ─────────

const STOPWORDS = new Set([
  "the", "and", "for", "you", "your", "with", "this", "that", "how", "what",
  "why", "are", "was", "from", "all", "can", "will", "best", "top", "new",
  "video", "youtube", "ever", "most", "every", "into", "out", "get", "got",
]);

/**
 * MVP proxy for LLM topic tags: significant lowercased tokens from a title +
 * existing YouTube tags. Used to match opportunities against competitor videos
 * until the Advanced tier adds real LLM tagging to competitor_videos.topics.
 */
export function tokenizeContent(title: string, tags: string[] = []): string[] {
  const fromTitle = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
  const fromTags = tags.map(norm).filter(Boolean);
  return [...new Set([...fromTitle, ...fromTags])];
}

/** Median of ISO-8601 durations, in seconds. */
export function medianDurationSeconds(durations: string[]): number {
  const secs = durations.map(parseISODuration).filter((s) => s > 0).sort((a, b) => a - b);
  if (secs.length === 0) return 0;
  const mid = Math.floor(secs.length / 2);
  return secs.length % 2 ? secs[mid] : Math.round((secs[mid - 1] + secs[mid]) / 2);
}

/** Realistic expected-view range derived from competitor evidence. */
export function expectedViewRange(p: CompetitorProof): { low: number; high: number } {
  if (p.matchCount === 0) return { low: 0, high: 0 };
  const avg = p.combinedViews / p.matchCount;
  return { low: Math.round(avg * 0.4), high: Math.round(avg * 1.5) };
}

/** Adapt the stored ChannelDNA (flat + arrays) into the scoring DNAProfile. */
export function toDNAProfile(
  dna: {
    primaryTopics?: string[];
    topicClusters?: string[];
    formats?: string[];
    contentStyle?: string;
    audience?: string[];
    audienceType?: string;
    tone?: string[];
    toneAndVoice?: string;
  },
  lengthBand: LengthBand
): DNAProfile {
  return {
    primaryTopics: (dna.primaryTopics ?? dna.topicClusters ?? []).map(norm),
    formats: (dna.formats ?? (dna.contentStyle ? [dna.contentStyle] : [])).map(norm),
    audience: (dna.audience ?? (dna.audienceType ? [dna.audienceType] : [])).map(norm),
    tone: (dna.tone ?? (dna.toneAndVoice ? [dna.toneAndVoice] : [])).map(norm),
    lengthBand,
  };
}

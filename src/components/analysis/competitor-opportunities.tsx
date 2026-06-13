"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, AlertTriangle, Flame, Lock, CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatNumber, timeAgo } from "@/lib/utils";

interface CompetitorVideo {
  id: string;
  title: string;
  viewCount: number;
  publishedAt: string;
}

interface Competitor {
  channel_id: string;
  channel_name: string;
  handle: string;
  subscribers: number;
  thumbnail_url: string;
  similarity_score: number;
  top_videos: CompetitorVideo[];
}

interface VideoIdea {
  title: string;
  topics: string[];
}

interface Props {
  competitors: Competitor[];
  userIdeas: VideoIdea[];
  plan?: "free" | "pro";
}

type Impact = "Very High" | "High" | "Medium";

interface Opportunity {
  competitorName: string;
  competitorHandle: string;
  competitorSubscribers: number;
  thumbnailUrl: string;
  similarityScore: number;
  video: CompetitorVideo;
  impact: Impact;
  reason: string;
}

const impactConfig: Record<Impact, { color: string; bg: string; border: string }> = {
  "Very High": { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  "High":      { color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
  "Medium":    { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
};

export function CompetitorOpportunities({ competitors, userIdeas, plan = "free" }: Props) {
  const FREE_LIMIT = 3;

  const allOpportunities: Opportunity[] = competitors
    .flatMap((c) =>
      (c.top_videos ?? []).slice(0, 2).map((v) => ({
        competitorName: c.channel_name,
        competitorHandle: c.handle,
        competitorSubscribers: c.subscribers,
        thumbnailUrl: c.thumbnail_url,
        similarityScore: c.similarity_score,
        video: v,
        impact: calcImpact(v.viewCount),
        reason: buildReason(v.title, c.channel_name, userIdeas),
      }))
    )
    .filter((o) => o.video.viewCount > 0)
    .sort((a, b) => b.video.viewCount - a.video.viewCount)
    .slice(0, 8);

  const opportunities = plan === "pro" ? allOpportunities : allOpportunities.slice(0, FREE_LIMIT);
  const lockedCount = plan === "free" ? Math.max(0, allOpportunities.length - FREE_LIMIT) : 0;

  if (allOpportunities.length === 0) return null;

  const totalMissedViews = allOpportunities.reduce((s, o) => s + o.video.viewCount, 0);

  return (
    <div className="space-y-4">
      {/* Header with FOMO stat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-red-400" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Competitor Gaps — Your Missed Views
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-400/8 border border-red-400/15">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="text-xs font-bold text-red-300">
            {formatNumber(totalMissedViews)} views earned by competitors on topics you haven&apos;t touched
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opportunities.map((opp, i) => {

          const cfg = impactConfig[opp.impact];
          return (
            <motion.div
              key={`${opp.competitorName}-${i}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative glass rounded-xl p-5 hover:border-red-400/15 transition-all group"
            >
              {/* "Missed" label */}
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-red-400/80">
                  <Flame className="w-3.5 h-3.5" />
                  Missed Opportunity
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                  {opp.impact} Potential
                </span>
              </div>

              {/* Competitor */}
              <div className="flex items-center gap-2.5 mb-3">
                {opp.thumbnailUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={opp.thumbnailUrl} alt={opp.competitorName}
                    className="w-8 h-8 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary shrink-0" />
                )}
                <div>
                  <p className="text-sm font-bold text-white">{opp.competitorName}</p>
                  <p className="text-xs text-muted-foreground">{formatNumber(opp.competitorSubscribers)} subscribers</p>
                </div>
              </div>

              {/* Video */}
              <a
                href={`https://youtube.com/watch?v=${opp.video.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mb-3 group/link"
              >
                <p className="text-sm font-semibold text-white/80 line-clamp-2 leading-snug group-hover/link:text-white transition-colors flex gap-1.5">
                  {opp.video.title}
                  <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-0 group-hover/link:opacity-60 transition-opacity" />
                </p>
              </a>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-4 text-xs">
                <span className="flex items-center gap-1 font-bold text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  {formatNumber(opp.video.viewCount)} views
                </span>
                {opp.video.publishedAt && (
                  <span className="text-muted-foreground">
                    {timeAgo(opp.video.publishedAt)}
                  </span>
                )}
                <span className="text-muted-foreground ml-auto">
                  {opp.similarityScore}% match
                </span>
              </div>

              {/* Reason */}
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 mb-3">
                <p className="text-xs text-white/60 leading-snug">{opp.reason}</p>
              </div>

              {/* Potential impact */}
              <div className={`rounded-lg px-3 py-2.5 border ${cfg.border} ${cfg.bg}`}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/40 mb-1.5">
                  Potential Impact If You Make This
                </p>
                <p className={`text-xs font-semibold leading-snug ${cfg.color}`}>
                  {opp.impact === "Very High"
                    ? `Based on ${opp.competitorName}'s performance, this could generate 200K+ views on your channel`
                    : opp.impact === "High"
                    ? `This topic drove 50K–200K views for competitors — strong opportunity for your audience`
                    : `Consistent 10K–50K range — a solid win with lower competition`}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pro locked gate */}
      {lockedCount > 0 && (
        <div className="relative rounded-2xl border border-primary/20 overflow-hidden mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 blur-sm pointer-events-none select-none opacity-50">
            {allOpportunities.slice(FREE_LIMIT, FREE_LIMIT + 2).map((opp, i) => (
              <div key={i} className="glass rounded-xl p-5">
                <p className="text-sm font-bold text-white mb-2">{opp.competitorName}</p>
                <p className="text-sm text-white/60 line-clamp-2">{opp.video.title}</p>
              </div>
            ))}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background/95 via-background/75 to-transparent px-6 py-8">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <p className="text-white font-black text-lg mb-1">{lockedCount} Competitor Gaps Hidden</p>
            <p className="text-muted-foreground text-sm text-center mb-5 max-w-xs">
              Pro users see all {allOpportunities.length} competitor opportunities — including the highest-earning gaps in your niche.
            </p>
            <Button variant="gradient" className="gap-2 glow-purple" asChild>
              <Link href="/pricing">
                <CrownIcon className="w-4 h-4" />
                Unlock Full Competitor Intelligence
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function calcImpact(views: number): Impact {
  if (views >= 200000) return "Very High";
  if (views >= 50000) return "High";
  return "Medium";
}

function buildReason(videoTitle: string, channelName: string, userIdeas: VideoIdea[]): string {
  const title = videoTitle.toLowerCase();
  const matched = userIdeas.find(i =>
    i.topics?.some((t: string) => title.includes(t.toLowerCase()))
  );

  if (matched) {
    return `${channelName} won with this topic. It matches your audience and you haven't covered it yet — your best chance to take this traffic.`;
  }
  return `This topic is actively performing in your niche. ${channelName} published it and gained strong traction. Your channel has zero coverage of this angle.`;
}

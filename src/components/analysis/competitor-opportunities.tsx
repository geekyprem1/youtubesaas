"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, AlertTriangle, Flame } from "lucide-react";
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

export function CompetitorOpportunities({ competitors, userIdeas }: Props) {
  const opportunities: Opportunity[] = competitors
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

  if (opportunities.length === 0) return null;

  const totalMissedViews = opportunities.reduce((s, o) => s + o.video.viewCount, 0);

  return (
    <div className="space-y-4">
      {/* Header with FOMO stat */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-red-400" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Missed Opportunities
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-red-400/80 font-medium">
          <AlertTriangle className="w-3.5 h-3.5" />
          {formatNumber(totalMissedViews)} views your competitors got — you didn&apos;t
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
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
                <p className="text-xs text-white/60 leading-snug">{opp.reason}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
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

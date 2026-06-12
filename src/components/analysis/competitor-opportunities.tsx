"use client";

import { motion } from "framer-motion";
import { ExternalLink, TrendingUp, AlertCircle } from "lucide-react";
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

export function CompetitorOpportunities({ competitors, userIdeas }: Props) {
  // Build a flat list of competitor videos with gap detection
  const opportunities = competitors
    .flatMap((c) =>
      (c.top_videos ?? []).slice(0, 3).map((v) => ({
        competitorName: c.channel_name,
        competitorHandle: c.handle,
        competitorSubscribers: c.subscribers,
        thumbnailUrl: c.thumbnail_url,
        similarityScore: c.similarity_score,
        video: v,
        gap: detectGap(v.title, userIdeas),
      }))
    )
    .filter((o) => o.video.viewCount > 0)
    .sort((a, b) => b.video.viewCount - a.video.viewCount)
    .slice(0, 12);

  if (opportunities.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-orange-400" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Competitor Opportunities — Content Gaps Detected
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {opportunities.map((opp, i) => (
          <motion.div
            key={`${opp.competitorName}-${i}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 hover:border-orange-400/20 transition-all group"
          >
            {/* Competitor header */}
            <div className="flex items-center gap-2.5 mb-3">
              {opp.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={opp.thumbnailUrl}
                  alt={opp.competitorName}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-secondary shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-white truncate block">
                  {opp.competitorName}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatNumber(opp.competitorSubscribers)} subs · {opp.similarityScore}% similar
                </span>
              </div>
              <div className="shrink-0 flex items-center gap-1 text-green-400 text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                {formatNumber(opp.video.viewCount)}
              </div>
            </div>

            {/* Video title */}
            <a
              href={`https://youtube.com/watch?v=${opp.video.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mb-3 group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-sm text-white/80 line-clamp-2 group-hover/link:text-white transition-colors leading-snug flex items-start gap-1.5">
                {opp.video.title}
                <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-0 group-hover/link:opacity-100 transition-opacity" />
              </p>
            </a>

            {/* Gap badge */}
            {opp.gap && (
              <div className="flex items-start gap-2 rounded-lg bg-orange-400/8 border border-orange-400/15 px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                <p className="text-xs text-orange-300/80 leading-snug">{opp.gap}</p>
              </div>
            )}

            {/* Upload date */}
            {opp.video.publishedAt && (
              <p className="text-xs text-muted-foreground mt-2">
                {timeAgo(opp.video.publishedAt)}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function detectGap(videoTitle: string, userIdeas: VideoIdea[]): string {
  const title = videoTitle.toLowerCase();
  const matchedIdea = userIdeas.find((idea) =>
    idea.topics?.some((t: string) => title.includes(t.toLowerCase()))
  );

  if (matchedIdea) {
    return `Gap detected — your channel hasn't covered this. Idea ready: "${matchedIdea.title.slice(0, 60)}..."`;
  }

  return "This topic is working for competitors but missing from your channel.";
}

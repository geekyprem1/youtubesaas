"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Award, Eye, ThumbsUp, Zap } from "lucide-react";
import { formatNumber, timeAgo, scoreColor } from "@/lib/utils";

interface VideoPerf {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  thumbnailUrl: string;
  publishedAt: string;
  performanceScore: number;
  engagementRate: number;
}

interface Props {
  topVideos: VideoPerf[];
  channelDNA: {
    primaryNiche?: string;
    contentStyle?: string;
    contentFormat?: string;
    topicClusters?: string[];
  };
}

export function WinningContent({ topVideos, channelDNA }: Props) {
  if (!topVideos?.length) return null;

  const top3 = topVideos.slice(0, 3);
  const avgEngagement = topVideos.reduce((s, v) => s + (v.engagementRate || 0), 0) / topVideos.length;
  const avgViews = topVideos.reduce((s, v) => s + v.views, 0) / topVideos.length;

  // Derive patterns
  const patterns = derivePatterns(topVideos, channelDNA);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-yellow-400" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Winning Content Analysis
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Top Performing Videos */}
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />
              Your Best Performing Videos
            </h3>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Avg views: <span className="text-white font-semibold">{formatNumber(Math.round(avgViews))}</span></span>
              <span>Avg engagement: <span className="text-white font-semibold">{(avgEngagement * 100).toFixed(2)}%</span></span>
            </div>
          </div>

          <div className="space-y-3">
            {top3.map((v, i) => (
              <motion.a
                key={v.videoId}
                href={`https://youtube.com/watch?v=${v.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center text-white font-black text-sm shrink-0">
                  #{i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent transition-colors">
                    {v.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="w-3 h-3" />{formatNumber(v.views)}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />{formatNumber(v.likes)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {timeAgo(v.publishedAt)}
                    </span>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <div className={`text-lg font-black ${scoreColor(v.performanceScore)}`}>
                    {v.performanceScore}
                  </div>
                  <div className="text-xs text-muted-foreground">perf. score</div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Patterns */}
        <div className="space-y-3">
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-green-400" />
              What&apos;s Working
            </h3>
            <div className="space-y-2.5">
              {patterns.working.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <TrendingUp className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-snug">{p}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <TrendingDown className="w-4 h-4 text-red-400" />
              What&apos;s Underperforming
            </h3>
            <div className="space-y-2.5">
              {patterns.failing.map((p, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <TrendingDown className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/80 leading-snug">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function derivePatterns(videos: VideoPerf[], dna: Props["channelDNA"]) {
  const topScore = videos[0]?.performanceScore ?? 0;
  const bottomScore = videos[videos.length - 1]?.performanceScore ?? 0;
  const format = dna?.contentFormat ?? "long-form";
  const style = dna?.contentStyle ?? "tutorials";
  const clusters = dna?.topicClusters ?? [];

  return {
    working: [
      `${style} content consistently drives highest engagement`,
      topScore > 70 ? "Recent videos show strong performance momentum" : "Older evergreen content outperforms newer uploads",
      clusters[0] ? `"${clusters[0]}" topics resonate most with your audience` : "Tutorial-style content gets highest watch time",
      "Videos with specific, concrete titles outperform vague ones",
    ],
    failing: [
      bottomScore < 30 ? "Lower-scored videos lack clear value proposition in titles" : "Mid-range videos need stronger hooks",
      `${format === "Long-form" ? "Short" : "Long"}-form content underperforms vs your main format`,
      "Videos without strong call-to-action see lower engagement",
    ],
  };
}

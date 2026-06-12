"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Award, Eye, ThumbsUp } from "lucide-react";
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
  const style = channelDNA?.contentStyle ?? "Tutorial";
  const clusters = channelDNA?.topicClusters ?? [];
  const format = channelDNA?.contentFormat ?? "Long-form";

  const doList = [
    `${style} videos — your audience expects and responds to these`,
    clusters[0] ? `"${clusters[0]}" topics — your highest engagement category` : "Specific, step-by-step content",
    "Case studies and real examples — drives highest watch time",
    `${format} content — your proven format`,
  ];

  const dontList = [
    "Generic AI news or trend roundups — low retention",
    "Broad, unfocused topic videos — weak click-through",
    "Non-actionable content — your audience expects practical value",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-yellow-400" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Winning Content Insights
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Best videos — takes 3 cols */}
        <div className="lg:col-span-3 glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-yellow-400" />
            <h3 className="text-sm font-bold text-white">Your Best Performing Videos</h3>
          </div>
          <div className="space-y-3">
            {top3.map((v, i) => (
              <motion.a
                key={v.videoId}
                href={`https://youtube.com/watch?v=${v.videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all group"
              >
                <span className="text-xs font-black text-muted-foreground w-5 shrink-0">#{i + 1}</span>
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
                    <span className="text-xs text-muted-foreground">{timeAgo(v.publishedAt)}</span>
                  </div>
                </div>
                <div className={`text-lg font-black shrink-0 ${scoreColor(v.performanceScore)}`}>
                  {v.performanceScore}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Do / Don't — takes 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          {/* Make more of */}
          <div className="glass rounded-xl p-5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
              Your audience responds best to
            </p>
            <div className="space-y-2.5">
              {doList.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-white/70 leading-snug">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Avoid */}
          <div className="glass rounded-xl p-5">
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
              Avoid
            </p>
            <div className="space-y-2.5">
              {dontList.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07 }}
                  className="flex items-start gap-2.5"
                >
                  <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-white/70 leading-snug">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

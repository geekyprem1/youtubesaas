"use client";

import { formatNumber, scoreColor } from "@/lib/utils";
import { TrendingUp, Eye, ThumbsUp } from "lucide-react";

interface VideoPerf {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  thumbnailUrl: string;
  performanceScore: number;
  engagementRate: number;
}

interface Props {
  videos: VideoPerf[];
}

export function TopVideos({ videos }: Props) {
  if (!videos?.length) return null;

  return (
    <div className="space-y-3">
      {videos.map((v, i) => (
        <a
          key={v.videoId}
          href={`https://youtube.com/watch?v=${v.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 glass rounded-xl p-4 hover:border-primary/30 transition-all group"
        >
          <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-sm font-bold shrink-0">
            #{i + 1}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-accent transition-colors">
              {v.title}
            </p>
            <div className="flex items-center gap-4 mt-1.5">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="w-3 h-3" />
                {formatNumber(v.views)}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <ThumbsUp className="w-3 h-3" />
                {formatNumber(v.likes)}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="w-3 h-3" />
                {(v.engagementRate * 100).toFixed(2)}% engagement
              </span>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className={`text-lg font-bold ${scoreColor(v.performanceScore)}`}>
              {v.performanceScore}
            </div>
            <div className="text-xs text-muted-foreground">score</div>
          </div>
        </a>
      ))}
    </div>
  );
}

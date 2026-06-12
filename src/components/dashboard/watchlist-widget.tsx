"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, ArrowRight, Upload, Plus } from "lucide-react";
import Link from "next/link";
import { timeAgo, formatNumber } from "@/lib/utils";

interface WatchlistChannel {
  id: string;
  name: string;
  thumbnailUrl: string;
  latestVideo: { title: string; viewCount: number; publishedAt: string } | null;
}

export function WatchlistWidget() {
  const [channels, setChannels] = useState<WatchlistChannel[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("uploadiq_watchlist");
      if (saved) setChannels(JSON.parse(saved).slice(0, 4));
    } catch {}
  }, []);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-bold text-white">Watchlist Activity</span>
        </div>
        <Link href="/watchlist" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
          Manage <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {channels.length === 0 ? (
        <div className="px-5 py-6 text-center">
          <Eye className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-3">Track competitors and see when they upload</p>
          <Link href="/watchlist"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-white transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Competitor
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {channels.map((ch, i) => (
            <motion.div
              key={ch.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors"
            >
              {ch.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ch.thumbnailUrl} alt={ch.name} className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-secondary shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{ch.name}</p>
                {ch.latestVideo ? (
                  <>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{ch.latestVideo.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Upload className="w-2.5 h-2.5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{timeAgo(ch.latestVideo.publishedAt)}</span>
                      <span className="text-[10px] text-muted-foreground">· {formatNumber(ch.latestVideo.viewCount)} views</span>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground mt-0.5">No recent uploads</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

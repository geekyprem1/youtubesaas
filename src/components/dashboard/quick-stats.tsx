"use client";

import { motion } from "framer-motion";
import { BarChart3, Lightbulb, Eye, Film } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  analysesCount: number;
  loading: boolean;
}

export function QuickStats({ analysesCount, loading }: Props) {
  const watchlistCount = (() => {
    try { return JSON.parse(localStorage.getItem("uploadiq_watchlist") ?? "[]").length; } catch { return 0; }
  })();

  const calendarCount = (() => {
    try { return JSON.parse(localStorage.getItem("uploadiq_calendar") ?? "[]").length; } catch { return 0; }
  })();

  const stats = [
    { icon: BarChart3, label: "Analyses", value: analysesCount, color: "text-accent", glow: "rgba(168,85,247,0.15)" },
    { icon: Lightbulb, label: "Ideas Saved", value: calendarCount, color: "text-yellow-400", glow: "rgba(234,179,8,0.12)" },
    { icon: Eye, label: "Tracked", value: watchlistCount, color: "text-blue-400", glow: "rgba(59,130,246,0.12)" },
    { icon: Film, label: "Analyzed", value: 0, color: "text-green-400", glow: "rgba(34,197,94,0.12)" },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-2xl border border-white/[0.07] px-4 py-4"
            style={{ background: "rgba(255,255,255,0.025)", boxShadow: `inset 0 1px 0 rgba(255,255,255,0.04)` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: s.glow }}>
                <Icon className={`w-3.5 h-3.5 ${s.color}`} />
              </div>
              <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

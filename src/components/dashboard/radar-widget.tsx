"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const TOPICS = [
  { topic: "Claude Code Tutorials", growth: "+340%", score: 94, comp: "Low" },
  { topic: "MCP Server Setup", growth: "+280%", score: 91, comp: "Low" },
  { topic: "AI Agents 2025", growth: "+210%", score: 87, comp: "Medium" },
  { topic: "Vibe Coding Workflow", growth: "+180%", score: 83, comp: "Low" },
  { topic: "Gemini CLI Guide", growth: "+145%", score: 79, comp: "Low" },
];

const compColor: Record<string, string> = {
  Low: "text-green-400",
  Medium: "text-yellow-400",
  High: "text-red-400",
};

export function RadarWidget() {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-sm font-bold text-white">Opportunity Radar</span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[9px] font-bold text-green-400 border border-green-400/20 bg-green-400/8 px-1.5 py-0.5 rounded-full"
          >
            LIVE
          </motion.span>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
          Full Radar <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="divide-y divide-white/[0.04]">
        {TOPICS.map((t, i) => (
          <motion.div
            key={t.topic}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg shrink-0 flex items-center justify-center"
              style={{ background: `rgba(124,58,237,${0.06 + (t.score / 100) * 0.14})` }}>
              <span className="text-xs font-black text-white">{t.score}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{t.topic}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                <span className="text-[10px] text-blue-400 font-semibold">{t.growth}</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold shrink-0 ${compColor[t.comp]}`}>
              {t.comp} comp
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

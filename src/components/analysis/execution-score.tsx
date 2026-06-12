"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Zap } from "lucide-react";

interface Props {
  difficulty: "Easy" | "Medium" | "Hard";
  format: string;
  topics: string[];
}

const CONFIG = {
  Easy: {
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    bar: "bg-green-500",
    width: "33%",
    label: "Easy to Execute",
    reasons: [
      "Minimal research required — you already know this topic",
      "Standard filming and editing — no special production",
      "Clear audience demand with low competition",
    ],
    timeEst: "1–2 days to produce",
  },
  Medium: {
    icon: Clock,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    bar: "bg-yellow-500",
    width: "66%",
    label: "Moderate Effort",
    reasons: [
      "Some research and preparation needed",
      "May require examples, demos, or case studies",
      "Strong execution will outperform the competition",
    ],
    timeEst: "3–5 days to produce",
  },
  Hard: {
    icon: Zap,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    bar: "bg-orange-500",
    width: "100%",
    label: "High Effort — High Reward",
    reasons: [
      "Deep research and structured script required",
      "Strong hook and production quality critical",
      "High effort separates you from competitors",
    ],
    timeEst: "1–2 weeks to produce",
  },
};

export function ExecutionScore({ difficulty, format, topics }: Props) {
  const cfg = CONFIG[difficulty] ?? CONFIG.Medium;
  const Icon = cfg.icon;

  return (
    <div className={`rounded-xl border px-4 py-3 ${cfg.border} ${cfg.bg}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${cfg.color} shrink-0`} />
          <span className={`text-xs font-bold ${cfg.color}`}>
            Execution: {cfg.label}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground border border-white/[0.06] px-2 py-0.5 rounded-full">
          {cfg.timeEst}
        </span>
      </div>

      {/* Difficulty bar */}
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
        <motion.div
          className={`h-full rounded-full ${cfg.bar}`}
          initial={{ width: 0 }}
          animate={{ width: cfg.width }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* Why */}
      <div className="space-y-1">
        {cfg.reasons.map((r, i) => (
          <div key={i} className="flex items-start gap-2 text-xs text-white/50">
            <span className="shrink-0 mt-0.5">·</span>
            <span className="leading-snug">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

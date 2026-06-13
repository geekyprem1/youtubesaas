"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, Flame, ArrowRight } from "lucide-react";

interface VideoIdea {
  id: string;
  title: string;
  opportunityScore: number;
  estimatedPerformance: string;
  difficulty: string;
}

interface Props {
  ideas: VideoIdea[];
}

export function StrategyPicker({ ideas }: Props) {
  if (ideas.length < 3) return null;

  // Sort by score, pick 3 distinct ideas — no duplicates
  const sorted = [...ideas].sort((a, b) => a.opportunityScore - b.opportunityScore);
  const byDiff = (diff: string) => ideas.filter(i => i.difficulty === diff).sort((a, b) => b.opportunityScore - a.opportunityScore)[0];

  const easy = byDiff("Easy");
  const medium = byDiff("Medium");
  const hard = byDiff("Hard");

  // Assign without overlap — each must be a different idea
  const used = new Set<string>();
  function pick(...candidates: (VideoIdea | undefined)[]): VideoIdea {
    for (const c of candidates) {
      if (c && !used.has(c.id)) { used.add(c.id); return c; }
    }
    // fallback: any unused idea from sorted list
    const fallback = sorted.find(i => !used.has(i.id)) ?? sorted[0];
    used.add(fallback.id);
    return fallback;
  }

  const safeChoice = pick(easy, sorted[sorted.length - 1]);
  const growthBet = pick(medium, sorted[Math.floor(sorted.length / 2)]);
  const viralBet = pick(hard, [...sorted].reverse().find(i => !used.has(i.id)));

  const strategies = [
    {
      label: "Safe Choice",
      emoji: "🟢",
      icon: Shield,
      idea: safeChoice,
      color: "border-green-500/20 bg-green-500/5",
      badge: "text-green-400 bg-green-400/10 border-green-400/20",
      accent: "text-green-400",
      desc: "Consistent performer. Lower risk, steady views.",
      viewRange: safeChoice?.estimatedPerformance ?? "20K–50K Views",
    },
    {
      label: "Growth Bet",
      emoji: "🟣",
      icon: TrendingUp,
      idea: growthBet,
      color: "border-primary/25 bg-primary/8",
      badge: "text-violet-300 bg-primary/15 border-primary/25",
      accent: "text-violet-300",
      desc: "Breakout potential. Requires strong execution.",
      viewRange: growthBet?.estimatedPerformance ?? "50K–120K Views",
    },
    {
      label: "Viral Bet",
      emoji: "🔥",
      icon: Flame,
      idea: viralBet,
      color: "border-orange-500/20 bg-orange-500/5",
      badge: "text-orange-300 bg-orange-500/10 border-orange-500/20",
      accent: "text-orange-300",
      desc: "High risk, high reward. Could 10x your channel.",
      viewRange: viralBet?.estimatedPerformance ?? "100K+ Potential",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-blue-400" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Choose Your Strategy
        </span>
        <span className="text-xs text-muted-foreground ml-auto">Pick your risk tolerance</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {strategies.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-xl border p-4 cursor-pointer group transition-all hover:scale-[1.02] ${s.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${s.badge}`}>
                  <span>{s.emoji}</span>
                  {s.label}
                </span>
                <Icon className={`w-4 h-4 ${s.accent}`} />
              </div>

              <p className="text-sm font-black text-white leading-snug mb-1.5 line-clamp-2">
                {s.idea?.title ?? "—"}
              </p>

              <p className={`text-xs font-bold mb-2 ${s.accent}`}>
                Expected: {s.viewRange}
              </p>

              <p className="text-xs text-muted-foreground leading-snug mb-3">
                {s.desc}
              </p>

              <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-white transition-colors">
                <span>Select this strategy</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

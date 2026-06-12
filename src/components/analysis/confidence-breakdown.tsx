"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";

interface Props {
  score: number;
  competitorCount: number;
  channelMatch: number; // 0-100
}

export function ConfidenceBreakdown({ score, competitorCount, channelMatch }: Props) {
  const [open, setOpen] = useState(false);

  const factors = [
    {
      label: "Channel Match",
      pct: Math.round(channelMatch * 0.35),
      color: "bg-violet-500",
      desc: "How well this topic fits your existing content style and audience",
    },
    {
      label: "Competitor Validation",
      pct: Math.round(Math.min(competitorCount / 10, 1) * 100 * 0.3),
      color: "bg-blue-500",
      desc: `${competitorCount} competitor channels are winning with this topic`,
    },
    {
      label: "Trend Momentum",
      pct: Math.round(score * 0.2),
      color: "bg-cyan-500",
      desc: "Audience search interest and engagement velocity for this topic",
    },
    {
      label: "Audience Fit",
      pct: Math.round(channelMatch * 0.15),
      color: "bg-green-500",
      desc: "Alignment with your subscriber demographics and preferences",
    },
  ];

  return (
    <div className="rounded-xl border border-white/[0.07]" style={{ background: "rgba(255,255,255,0.02)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Why {score}% Confidence?</span>
        </div>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06] pt-3">
              {factors.map((f, i) => (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white/70">{f.label}</span>
                    <span className="text-xs font-black text-white">{f.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mb-1">
                    <motion.div
                      className={`h-full rounded-full ${f.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${f.pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut", delay: i * 0.08 }}
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

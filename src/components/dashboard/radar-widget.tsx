"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, TrendingUp, X, Lightbulb, BarChart3, ChevronRight } from "lucide-react";
import { getTopicsForInterests } from "@/lib/categories";
import type { RadarTopic } from "@/lib/categories";

// Keep export for backward compat
export const RADAR_TOPICS = [
  {
    topic: "Claude Code Tutorials",
    growth: "+340%",
    score: 94,
    comp: "Low" as const,
    momentum: "Exploding",
    forecast: "Likely to grow 14+ more days",
    combinedViews: "12.4M",
    videosPublished: 847,
    whyNow: "Claude Code launched to the public — massive creator interest with very few tutorials yet. First-movers are getting millions of views.",
    opportunities: [
      "Claude Code for Beginners: Your First AI App in 30 Minutes",
      "Claude Code vs Cursor vs Copilot: Which Is Actually Better?",
      "I Built a SaaS in 24 Hours Using Claude Code (Full Walkthrough)",
      "10 Claude Code Tricks That Save Me 5 Hours a Day",
      "Claude Code MCP Setup Guide: Supercharge Your AI Workflow",
    ],
  },
  {
    topic: "MCP Server Setup",
    growth: "+280%",
    score: 91,
    comp: "Low" as const,
    momentum: "Exploding",
    forecast: "Accelerating — demand outpacing content",
    combinedViews: "8.1M",
    videosPublished: 312,
    whyNow: "MCP (Model Context Protocol) is becoming the standard for AI tool integration. Barely any tutorial content exists — massive gap.",
    opportunities: [
      "MCP Servers Explained: The Future of AI Tools",
      "Build Your First MCP Server in 10 Minutes",
      "Top 10 MCP Servers Every Developer Should Know",
      "MCP vs Traditional APIs: Why It Changes Everything",
      "Claude + MCP: Build Anything Automation Workflow",
    ],
  },
  {
    topic: "AI Agents 2025",
    growth: "+210%",
    score: 87,
    comp: "Medium" as const,
    momentum: "Rising",
    forecast: "Growing steadily — high audience interest",
    combinedViews: "31.2M",
    videosPublished: 2840,
    whyNow: "Autonomous AI agents are the #1 trend in tech. Competition is rising but audience demand is growing faster.",
    opportunities: [
      "AI Agents Are Taking Over: What You Need to Know in 2025",
      "Build a Real AI Agent From Scratch (No Code Required)",
      "5 AI Agents That Replaced My Entire Workflow",
      "AI Agents vs ChatGPT: What's Actually Different?",
      "The AI Agent Stack: Tools, Frameworks, and Use Cases",
    ],
  },
  {
    topic: "Vibe Coding",
    growth: "+180%",
    score: 83,
    comp: "Low" as const,
    momentum: "Rising",
    forecast: "New category forming — early opportunity",
    combinedViews: "5.6M",
    videosPublished: 421,
    whyNow: "Vibe coding is redefining how developers build. The term is new, the audience is massive, and the content gap is real.",
    opportunities: [
      "What Is Vibe Coding? The Future of Programming Explained",
      "Vibe Coding My First App: Full Build Timelapse",
      "Vibe Coding vs Traditional Coding: Which Is Better?",
      "I Vibe Coded a $10K App in a Weekend (Here's How)",
      "Vibe Coding Tutorial for Non-Programmers",
    ],
  },
  {
    topic: "Gemini CLI Guide",
    growth: "+145%",
    score: 79,
    comp: "Low" as const,
    momentum: "Rising",
    forecast: "Early-stage — low competition window closing",
    combinedViews: "3.2M",
    videosPublished: 198,
    whyNow: "Google launched Gemini CLI — barely any creator content. Small window to capture first-page search rankings.",
    opportunities: [
      "Gemini CLI: Everything You Need to Know (2025 Guide)",
      "Gemini CLI vs Claude Code: I Tested Both for a Week",
      "Build Anything With Gemini CLI: Full Tutorial",
      "Gemini CLI Setup Guide: From Zero to First Project",
      "Gemini CLI Hidden Features Most Creators Don't Know",
    ],
  },
];

const compConfig: Record<string, { color: string; bg: string; border: string }> = {
  Low: { color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  Medium: { color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  High: { color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
};

const momentumConfig: Record<string, string> = {
  "Exploding": "text-orange-400",
  "Rising": "text-blue-400",
  "Stable": "text-muted-foreground",
};

type Topic = RadarTopic;

function DrilldownModal({ topic, onClose }: { topic: Topic; onClose: () => void }) {
  const cfg = compConfig[topic.comp];
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.96, opacity: 0, y: 8 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(150deg, rgba(124,58,237,0.12) 0%, #0d1117 60%)",
          border: "1px solid rgba(124,58,237,0.25)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 60px rgba(124,58,237,0.1)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-4 h-4 text-orange-400" />
              <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">Trending Topic</span>
            </div>
            <h2 className="text-xl font-black text-white leading-tight">{topic.topic}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.06] transition-colors mt-1">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-4 gap-2 px-6 pb-4">
          {[
            { label: "Trend Score", value: String(topic.score), color: "text-white" },
            { label: "Growth", value: topic.growth, color: "text-blue-400" },
            { label: "Views Combined", value: topic.combinedViews, color: "text-green-400" },
            { label: "Videos Published", value: String(topic.videosPublished), color: "text-accent" },
          ].map(m => (
            <div key={m.label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <p className={`text-base font-black ${m.color}`}>{m.value}</p>
              <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2 px-6 pb-4">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
            {topic.comp} Competition
          </span>
          <span className={`text-[10px] font-bold ${momentumConfig[topic.momentum]}`}>
            <TrendingUp className="w-2.5 h-2.5 inline mr-1" />{topic.momentum}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto">{topic.forecast}</span>
        </div>

        {/* Why now */}
        <div className="mx-6 mb-4 rounded-xl bg-white/[0.02] border border-white/[0.05] px-4 py-3">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <BarChart3 className="w-3 h-3" /> Why Now
          </p>
          <p className="text-xs text-white/70 leading-relaxed">{topic.whyNow}</p>
        </div>

        {/* Opportunities */}
        <div className="mx-6 mb-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
            <Lightbulb className="w-3 h-3 text-yellow-400" /> Recommended Video Opportunities
          </p>
          <div className="space-y-2">
            {topic.opportunities.map((opp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-xl border border-primary/15 bg-primary/5 group cursor-pointer hover:border-primary/30 hover:bg-primary/10 transition-all"
              >
                <span className="text-[10px] font-black text-accent/60 w-4 shrink-0">#{i + 1}</span>
                <p className="text-xs font-semibold text-white flex-1 leading-snug">{opp}</p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

interface RadarProps {
  interests?: string[];
}

export function RadarWidget({ interests }: RadarProps) {
  const [selected, setSelected] = useState<Topic | null>(null);
  const topics = interests && interests.length > 0
    ? getTopicsForInterests(interests)
    : RADAR_TOPICS;

  return (
    <>
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
          <span className="text-xs text-muted-foreground">Click any topic to explore</span>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {topics.map((t, i) => {
            const cfg = compConfig[t.comp];
            return (
              <motion.button
                key={t.topic}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelected(t)}
                className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.03] transition-colors group text-left"
              >
                <div className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center transition-all group-hover:scale-105"
                  style={{ background: `rgba(124,58,237,${0.06 + (t.score / 100) * 0.16})`, border: "1px solid rgba(124,58,237,0.15)" }}>
                  <span className="text-xs font-black text-white">{t.score}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors truncate">{t.topic}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                    <span className="text-[10px] text-blue-400 font-bold">{t.growth}</span>
                    <span className="text-[10px] text-muted-foreground">· {t.momentum}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                  {t.comp}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-accent transition-colors shrink-0" />
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected && <DrilldownModal topic={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}

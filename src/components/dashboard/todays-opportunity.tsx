"use client";

import { motion } from "framer-motion";
import { Zap, TrendingUp, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

const DAILY_OPPORTUNITIES = [
  {
    topic: "Claude Code Tutorials",
    momentum: "+340%",
    competition: "Low",
    potential: "1M+ views possible",
    why: "Claude Code just went public — tutorials are getting millions of views with almost no competition. The window is open right now.",
    cta: "See Video Opportunities",
    badge: "🔥 Exploding Today",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  },
  {
    topic: "MCP Server Tutorials",
    momentum: "+280%",
    competition: "Very Low",
    potential: "500K+ views possible",
    why: "MCP is the new AI integration standard. Almost zero creator content exists. Pure first-mover advantage.",
    cta: "Explore This Niche",
    badge: "⚡ Rising Fast",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  },
  {
    topic: "Vibe Coding Tutorials",
    momentum: "+180%",
    competition: "Low",
    potential: "300K+ views possible",
    why: "Vibe coding is redefining how people build apps. Early creators are building huge audiences before mainstream saturation.",
    cta: "Explore This Niche",
    badge: "📈 Growing Strong",
    badgeColor: "text-green-400 bg-green-400/10 border-green-400/20",
  },
];

function getDailyIndex() {
  const d = new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % DAILY_OPPORTUNITIES.length;
}

export function TodaysOpportunity() {
  const opp = DAILY_OPPORTUNITIES[getDailyIndex()];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(59,130,246,0.10) 50%, rgba(13,17,23,0.95) 100%)",
        border: "1px solid rgba(124,58,237,0.25)",
        boxShadow: "0 0 40px rgba(124,58,237,0.08)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

      <div className="relative p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Today's Opportunity</span>
            </div>
            <h3 className="text-base font-black text-white leading-tight">{opp.topic}</h3>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${opp.badgeColor} shrink-0 ml-3`}>
            {opp.badge}
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
            <p className="text-sm font-black text-blue-400">{opp.momentum}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Momentum</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
            <p className="text-sm font-black text-green-400">{opp.competition}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Competition</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
            <p className="text-[11px] font-black text-accent leading-tight">{opp.potential}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">Potential</p>
          </div>
        </div>

        {/* Why */}
        <p className="text-xs text-white/60 leading-relaxed mb-3">{opp.why}</p>

        {/* CTA */}
        <Link href="/dashboard/radar" className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-primary/15 border border-primary/25 hover:bg-primary/25 hover:border-primary/40 transition-all group">
          <span className="text-xs font-bold text-white">{opp.cta}</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

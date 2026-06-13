"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

const OPPORTUNITIES = [
  {
    topic: "Claude Code Tutorials",
    momentum: "+340%",
    competition: "Low",
    potential: "1M+ views",
    why: "Claude Code just went public — tutorials are getting millions of views with almost no competition. The window is open right now.",
    badge: "🔥 Exploding",
    badgeColor: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    keywords: ["code", "coding", "dev", "developer", "programming", "software", "tech", "ai", "python", "javascript", "tutorial"],
  },
  {
    topic: "MCP Server Setup",
    momentum: "+280%",
    competition: "Very Low",
    potential: "500K+ views",
    why: "MCP is the new AI integration standard. Almost zero creator content exists. Pure first-mover advantage.",
    badge: "⚡ Rising Fast",
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    keywords: ["mcp", "api", "integration", "tool", "automation", "workflow", "build"],
  },
  {
    topic: "AI Agents 2025",
    momentum: "+210%",
    competition: "Medium",
    potential: "300K+ views",
    why: "Autonomous AI agents are the #1 trend in tech. Audience demand is growing faster than content supply.",
    badge: "📈 Growing Strong",
    badgeColor: "text-green-400 bg-green-400/10 border-green-400/20",
    keywords: ["agent", "gpt", "llm", "openai", "gemini", "anthropic", "machine learning", "deep learning"],
  },
  {
    topic: "Vibe Coding Tutorials",
    momentum: "+180%",
    competition: "Low",
    potential: "300K+ views",
    why: "Vibe coding is redefining how people build apps. Early creators are building huge audiences before mainstream saturation.",
    badge: "📈 Growing Strong",
    badgeColor: "text-green-400 bg-green-400/10 border-green-400/20",
    keywords: ["vibe", "no code", "nocode", "low code", "builder", "saas", "startup", "indie"],
  },
  {
    topic: "Productivity & AI Tools",
    momentum: "+150%",
    competition: "Medium",
    potential: "200K+ views",
    why: "Creators showing real productivity workflows with AI tools are growing fast. Practical beats theoretical every time.",
    badge: "📈 Trending",
    badgeColor: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    keywords: ["productivity", "workflow", "notion", "obsidian", "second brain", "pkm", "study", "work"],
  },
  {
    topic: "Creator Economy & Monetization",
    momentum: "+120%",
    competition: "Medium",
    potential: "150K+ views",
    why: "Creators teaching other creators how to grow and monetize are building loyal audiences fast.",
    badge: "💡 Opportunity",
    badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    keywords: ["creator", "youtube", "monetize", "earn", "money", "income", "business", "entrepreneur", "marketing"],
  },
];

function getDailyFallbackIndex() {
  const d = new Date();
  const dayOfYear = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 0).getTime()) / 86400000);
  return dayOfYear % OPPORTUNITIES.length;
}

function getRelevantOpportunity(channelName?: string): typeof OPPORTUNITIES[0] {
  if (!channelName) return OPPORTUNITIES[getDailyFallbackIndex()];

  const nameLower = channelName.toLowerCase();

  // Score each opportunity by keyword match
  let bestScore = 0;
  let bestOpp = OPPORTUNITIES[getDailyFallbackIndex()];

  for (const opp of OPPORTUNITIES) {
    const score = opp.keywords.filter(k => nameLower.includes(k)).length;
    if (score > bestScore) {
      bestScore = score;
      bestOpp = opp;
    }
  }

  return bestOpp;
}

interface Props {
  lastChannelName?: string;
}

export function TodaysOpportunity({ lastChannelName }: Props) {
  const opp = getRelevantOpportunity(lastChannelName);

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
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                {lastChannelName ? "For Your Niche" : "Today's Opportunity"}
              </span>
            </div>
            <h3 className="text-base font-black text-white leading-tight">{opp.topic}</h3>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${opp.badgeColor} shrink-0 ml-3`}>
            {opp.badge}
          </span>
        </div>

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

        <p className="text-xs text-white/60 leading-relaxed mb-3">{opp.why}</p>

        <Link href="/dashboard" className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-primary/15 border border-primary/25 hover:bg-primary/25 hover:border-primary/40 transition-all group">
          <span className="text-xs font-bold text-white">Explore This Opportunity</span>
          <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

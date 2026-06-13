"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProContentModal } from "@/components/analysis/pro-content-modal";
import type { ProContentType } from "@/lib/gemini";
import Link from "next/link";
import {
  Flame, Clock, Bookmark, ChevronDown,
  ChevronUp, ArrowRight, Lock, Zap, TrendingUp, CheckCircle2, CrownIcon
} from "lucide-react";

interface VideoIdea {
  id: string;
  title: string;
  opportunityScore: number;
  reason: string;
  expectedAudienceInterest: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedPerformance: string;
  topics: string[];
  format: string;
  dnaMatchScore?: number;
  confidenceScore?: number;
  trendScore?: number;
  competitionScore?: number;
  opportunityType?: "Emerging" | "Rising" | "Validated" | "Saturated";
  whyBullets?: string[];
}

function scoreColorHex(score: number): string {
  return score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#f97316";
}

function ScoreStat({ label, score }: { label: string; score: number }) {
  return (
    <div className="bg-white/[0.03] rounded-xl p-2.5 text-center">
      <p className="text-base font-black leading-none" style={{ color: scoreColorHex(score) }}>{score}</p>
      <p className="text-[9px] text-muted-foreground mt-1 leading-tight">{label}</p>
    </div>
  );
}

interface Props {
  ideas: VideoIdea[];
  channelDNA: Record<string, unknown>;
  channel: Record<string, string | number>;
  plan: "free" | "pro";
}

const PRIORITY_CONFIG: Array<{
  rank: number; label: string; emoji: string; icon: React.ElementType;
  accent: string; badge: string; cta: string; videoBadge: string;
  videoBadgeStyle: string; contentType: ProContentType;
}> = [
  {
    rank: 1,
    label: "Make This Now",
    emoji: "🔥",
    icon: Flame,
    accent: "from-orange-500/20 to-red-500/10 border-orange-500/25",
    badge: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    cta: "Start This Video",
    videoBadge: "🔥 Make This Now",
    videoBadgeStyle: "text-orange-300 bg-orange-500/15 border-orange-500/25",
    contentType: "outline",   // hook + script to start filming
  },
  {
    rank: 2,
    label: "Rising Fast",
    emoji: "⚡",
    icon: Clock,
    accent: "from-blue-500/10 to-transparent border-blue-500/20",
    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    cta: "Plan This Video",
    videoBadge: "⚡ Rising Fast",
    videoBadgeStyle: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    contentType: "all",       // full planning pack
  },
  {
    rank: 3,
    label: "High Potential",
    emoji: "📈",
    icon: Bookmark,
    accent: "from-white/[0.04] to-transparent border-border/50",
    badge: "bg-secondary text-muted-foreground border-border/60",
    cta: "Queue This Video",
    videoBadge: "📈 High Potential",
    videoBadgeStyle: "text-blue-300 bg-blue-500/10 border-blue-500/20",
    contentType: "titles",    // title ideas to save for later
  },
];

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#f97316";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        />
      </div>
      <span className="text-sm font-black tabular-nums" style={{ color }}>{score}</span>
    </div>
  );
}

function PriorityCard({
  idea, rank, channelDNA, channel, plan
}: {
  idea: VideoIdea;
  rank: number;
  channelDNA: Record<string, unknown>;
  channel: Record<string, string | number>;
  plan: "free" | "pro";
}) {
  const [showPro, setShowPro] = useState(false);
  const config = PRIORITY_CONFIG[rank - 1] ?? PRIORITY_CONFIG[2];

  return (
    <>
      <motion.div
        id={`idea-card-${idea.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rank * 0.1 }}
        className={`relative rounded-2xl bg-gradient-to-br p-6 border ${config.accent}`}
      >
        {/* Rank badge */}
        <div className="flex items-center justify-between mb-5">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.badge}`}>
            {config.emoji && <span>{config.emoji}</span>}
            {config.videoBadge}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            idea.difficulty === "Easy" ? "text-green-400 bg-green-400/10" :
            idea.difficulty === "Medium" ? "text-yellow-400 bg-yellow-400/10" :
            "text-red-400 bg-red-400/10"
          }`}>
            {idea.difficulty}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-white leading-tight mb-4">
          {idea.title}
        </h3>

        {/* Three deterministic scores */}
        {idea.dnaMatchScore != null ? (
          <div className="grid grid-cols-3 gap-2 mb-4">
            <ScoreStat label="DNA Match" score={idea.dnaMatchScore} />
            <ScoreStat label="Opportunity" score={idea.opportunityScore} />
            <ScoreStat label="Confidence" score={idea.confidenceScore ?? idea.opportunityScore} />
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Opportunity Score</span>
            </div>
            <ScoreBar score={idea.opportunityScore} />
          </div>
        )}

        {/* Est. views */}
        <div className="flex items-center gap-2 mb-4 text-xs">
          <TrendingUp className="w-3.5 h-3.5 text-green-400 shrink-0" />
          <span className="text-muted-foreground">Est. Views</span>
          <span className="font-bold text-white ml-auto">{idea.estimatedPerformance}</span>
        </div>

        {/* Why this will work — from the math */}
        {idea.whyBullets && idea.whyBullets.length > 0 ? (
          <div className="mb-5 space-y-1.5">
            {idea.whyBullets.slice(0, 3).map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-xs text-white/65 leading-snug">{w}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-white/60 leading-relaxed mb-5 line-clamp-2">
            {idea.reason}
          </p>
        )}

        {/* CTA */}
        <Button
          className={`w-full h-10 text-sm font-bold gap-2 ${
            rank === 1
              ? "bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white border-0"
              : rank === 2
              ? "bg-gradient-purple text-white glow-purple"
              : "bg-white/[0.06] border border-border/60 text-white hover:bg-white/[0.1]"
          }`}
          onClick={() => setShowPro(true)}
        >
          {plan === "pro" ? (
            <><Zap className="w-4 h-4" /> {config.cta}</>
          ) : (
            <><Lock className="w-4 h-4" /> Unlock This Video</>
          )}
          <ArrowRight className="w-4 h-4 ml-auto" />
        </Button>
      </motion.div>

      {showPro && (
        <ProContentModal
          idea={idea}
          channelDNA={channelDNA}
          channel={channel}
          plan={plan}
          contentType={config.contentType}
          onClose={() => setShowPro(false)}
        />
      )}
    </>
  );
}

function CollapseRow({
  idea, index, channelDNA, channel, plan
}: {
  idea: VideoIdea;
  index: number;
  channelDNA: Record<string, unknown>;
  channel: Record<string, string | number>;
  plan: "free" | "pro";
}) {
  const [expanded, setExpanded] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const score = idea.opportunityScore;
  const color = score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-orange-400";

  return (
    <>
      <div id={`idea-card-${idea.id}`} className="border border-border/40 rounded-xl overflow-hidden hover:border-border/70 transition-colors">
        <button
          className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <span className="text-xs text-muted-foreground w-6 shrink-0">#{index + 4}</span>
          <span className="flex-1 text-sm font-medium text-white line-clamp-1">{idea.title}</span>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20">
              💎 Hidden
            </span>
            <span className={`text-sm font-black ${color}`}>{score}</span>
            {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              className="overflow-hidden border-t border-border/40"
            >
              <div className="px-5 py-4 space-y-3">
                <p className="text-sm text-white/60 leading-relaxed">{idea.reason}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{idea.estimatedPerformance}</span>
                  <Button size="sm" className="h-8 text-xs gap-1.5 bg-gradient-purple text-white"
                    onClick={() => setShowPro(true)}>
                    {plan === "pro" ? <><Zap className="w-3 h-3" /> Generate</> : <><Lock className="w-3 h-3" /> Unlock</>}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showPro && (
        <ProContentModal idea={idea} channelDNA={channelDNA} channel={channel} plan={plan} onClose={() => setShowPro(false)} />
      )}
    </>
  );
}

export function OpportunitiesGrid({ ideas, channelDNA, channel, plan }: Props) {
  const [showMore, setShowMore] = useState(false);

  const FREE_VISIBLE = 5; // 3 priority cards + 2 collapse rows
  const visibleIdeas = plan === "pro" ? ideas : ideas.slice(0, FREE_VISIBLE);
  const lockedCount = plan === "free" ? Math.max(0, ideas.length - FREE_VISIBLE) : 0;

  const top3 = visibleIdeas.slice(0, 3);
  const rest = visibleIdeas.slice(3);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-accent" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Top Video Opportunities
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {plan === "free" ? `${FREE_VISIBLE} of ${ideas.length} shown` : `${ideas.length} ideas found`}
        </span>
      </div>

      {/* Top 3 priority cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {top3.map((idea, i) => (
          <PriorityCard
            key={idea.id || i}
            idea={idea}
            rank={i + 1}
            channelDNA={channelDNA}
            channel={channel}
            plan={plan}
          />
        ))}
      </div>

      {/* Remaining visible — collapsed */}
      {rest.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {showMore && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                {rest.map((idea, i) => (
                  <CollapseRow key={idea.id || i} idea={idea} index={i} channelDNA={channelDNA} channel={channel} plan={plan} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            className="w-full text-muted-foreground hover:text-white border border-border/40 hover:border-border/70 gap-2 h-11"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? (
              <><ChevronUp className="w-4 h-4" /> Hide</>
            ) : (
              <><ChevronDown className="w-4 h-4" /> Show {rest.length} More</>
            )}
          </Button>
        </div>
      )}

      {/* Pro locked gate */}
      {lockedCount > 0 && (
        <div className="relative rounded-2xl overflow-hidden border border-primary/20">
          {/* Blurred preview rows */}
          <div className="space-y-2 p-3 blur-sm pointer-events-none select-none opacity-60">
            {ideas.slice(FREE_VISIBLE, FREE_VISIBLE + 3).map((idea, i) => (
              <div key={i} className="border border-border/40 rounded-xl px-5 py-4 flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-6">#{FREE_VISIBLE + i + 1}</span>
                <span className="flex-1 text-sm font-medium text-white line-clamp-1">{idea.title}</span>
                <span className="text-sm font-black text-green-400">{idea.opportunityScore}</span>
              </div>
            ))}
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background/95 via-background/80 to-transparent px-6 py-8">
            <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <p className="text-white font-black text-lg mb-1">{lockedCount} More Ideas Locked</p>
            <p className="text-muted-foreground text-sm text-center mb-5 max-w-xs">
              Pro users see all {ideas.length} opportunities — including hidden high-potential ideas your competitors haven&apos;t found yet.
            </p>
            <Button variant="gradient" className="gap-2 glow-purple" asChild>
              <Link href="/pricing">
                <CrownIcon className="w-4 h-4" />
                Unlock All {ideas.length} Ideas — Go Pro
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

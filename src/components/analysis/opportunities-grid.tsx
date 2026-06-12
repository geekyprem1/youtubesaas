"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProContentModal } from "@/components/analysis/pro-content-modal";
import {
  TrendingUp, Target, Zap, Lock,
  ChevronDown, ChevronUp, ArrowUpRight
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
}

interface Props {
  ideas: VideoIdea[];
  channelDNA: Record<string, unknown>;
  channel: Record<string, string | number>;
  plan: "free" | "pro";
}

function MiniScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-400" : score >= 60 ? "bg-yellow-400" : "bg-orange-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
      <span className={`text-xs font-bold tabular-nums w-6 text-right ${
        score >= 80 ? "text-green-400" : score >= 60 ? "text-yellow-400" : "text-orange-400"
      }`}>{score}</span>
    </div>
  );
}

function IdeaCard({
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

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.04 }}
        className="glass rounded-xl overflow-hidden hover:border-primary/25 transition-all duration-200 group"
      >
        <div
          className="p-5 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          {/* Rank + Score */}
          <div className="flex items-start gap-3 mb-3">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 mt-0.5">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                {idea.title}
              </h3>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            )}
          </div>

          {/* Score bar */}
          <MiniScoreBar score={idea.opportunityScore} />

          {/* Meta */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              idea.difficulty === "Easy" ? "text-green-400 bg-green-400/10" :
              idea.difficulty === "Medium" ? "text-yellow-400 bg-yellow-400/10" :
              "text-red-400 bg-red-400/10"
            }`}>
              {idea.difficulty}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              {idea.estimatedPerformance}
            </span>
            {idea.format && (
              <span className="text-xs text-muted-foreground bg-secondary/60 px-2 py-0.5 rounded-full">
                {idea.format}
              </span>
            )}
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-border/40 overflow-hidden"
            >
              <div className="p-5 pt-4 space-y-4">
                <p className="text-sm text-white/70 leading-relaxed">{idea.reason}</p>

                {idea.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {idea.topics.map((t: string) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-primary/10 text-accent text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                <Button
                  size="sm"
                  className={`w-full gap-2 h-9 text-xs ${
                    plan === "pro"
                      ? "bg-gradient-purple text-white"
                      : "bg-secondary hover:bg-secondary/80 text-white border border-border/60"
                  }`}
                  onClick={(e) => { e.stopPropagation(); setShowPro(true); }}
                >
                  {plan === "pro" ? (
                    <><Zap className="w-3.5 h-3.5" /> Generate Content Pack</>
                  ) : (
                    <><Lock className="w-3.5 h-3.5" /> Unlock Titles, Thumbnail & Script</>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {showPro && (
        <ProContentModal
          idea={idea}
          channelDNA={channelDNA}
          channel={channel}
          plan={plan}
          onClose={() => setShowPro(false)}
        />
      )}
    </>
  );
}

export function OpportunitiesGrid({ ideas, channelDNA, channel, plan }: Props) {
  const [showAll, setShowAll] = useState(false);
  const displayedIdeas = showAll ? ideas : ideas.slice(0, 9);

  // Stats
  const avgScore = Math.round(ideas.reduce((s, i) => s + i.opportunityScore, 0) / Math.max(ideas.length, 1));
  const highOpp = ideas.filter(i => i.opportunityScore >= 80).length;
  const easyWins = ideas.filter(i => i.difficulty === "Easy").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-accent" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Top {ideas.length} Video Opportunities
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            {highOpp} high opportunity
          </span>
          <span className="flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-yellow-400" />
            {easyWins} easy wins
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-accent" />
            Avg score: {avgScore}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayedIdeas.map((idea, i) => (
          <IdeaCard
            key={idea.id || i}
            idea={idea}
            index={i + 1}
            channelDNA={channelDNA}
            channel={channel}
            plan={plan}
          />
        ))}
      </div>

      {/* Show more / Pro upsell */}
      {ideas.length > 9 && (
        <div className="text-center pt-2">
          {showAll ? (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(false)} className="text-muted-foreground gap-2">
              <ChevronUp className="w-4 h-4" /> Show Less
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(true)}
              className="gap-2 border-border/60 text-white hover:bg-secondary"
            >
              Show {ideas.length - 9} More Ideas <ChevronDown className="w-4 h-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

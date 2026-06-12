"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { scoreColor, difficultyColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProContentModal } from "@/components/analysis/pro-content-modal";
import { CrownIcon, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";

interface VideoIdea {
  id: string;
  title: string;
  opportunityScore: number;
  reason: string;
  expectedAudienceInterest: string;
  difficulty: string;
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

export function VideoIdeasGrid({ ideas, channelDNA, channel, plan }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [proIdea, setProIdea] = useState<VideoIdea | null>(null);

  if (!ideas?.length) return null;

  return (
    <>
      <div className="space-y-3">
        {ideas.map((idea, i) => {
          const expanded = expandedId === idea.id;
          return (
            <motion.div
              key={idea.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="glass rounded-xl overflow-hidden hover:border-primary/30 transition-all"
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedId(expanded ? null : (idea.id || String(i)))}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 text-center w-14">
                    <div className={`text-2xl font-black ${scoreColor(idea.opportunityScore)}`}>
                      {idea.opportunityScore}
                    </div>
                    <div className="text-xs text-muted-foreground">/100</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold leading-snug">{idea.title}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyColor(idea.difficulty)}`}>
                        {idea.difficulty}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="w-3 h-3" />
                        {idea.estimatedPerformance}
                      </span>
                      {idea.format && (
                        <Badge variant="outline" className="text-xs">{idea.format}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="gradient"
                      className="h-8 text-xs gap-1.5"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProIdea(idea);
                      }}
                    >
                      <CrownIcon className="w-3 h-3" />
                      {plan === "pro" ? "Pro Pack" : "Unlock"}
                    </Button>
                    {expanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </div>

              {expanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  className="border-t border-border/60 px-5 pb-5 pt-4 space-y-3"
                >
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Why This Opportunity</p>
                    <p className="text-sm text-white/80 leading-relaxed">{idea.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Expected Audience Interest</p>
                    <p className="text-sm text-white/80">{idea.expectedAudienceInterest}</p>
                  </div>
                  {idea.topics?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {idea.topics.map((t) => (
                        <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {proIdea && (
        <ProContentModal
          idea={proIdea}
          channelDNA={channelDNA}
          channel={channel}
          plan={plan}
          onClose={() => setProIdea(null)}
        />
      )}
    </>
  );
}

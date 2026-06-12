"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProContentModal } from "@/components/analysis/pro-content-modal";
import {
  Sparkles, TrendingUp, Target, Zap,
  Lock, ChevronRight, ArrowUpRight
} from "lucide-react";

interface Props {
  idea: {
    id: string;
    title: string;
    opportunityScore: number;
    reason: string;
    expectedAudienceInterest: string;
    difficulty: string;
    estimatedPerformance: string;
    topics: string[];
    format: string;
  };
  channelDNA: Record<string, unknown>;
  channel: Record<string, string | number>;
  plan: "free" | "pro";
  competitors: Array<{
    channel_name: string;
    top_videos: Array<{ title: string; viewCount: number }>;
  }>;
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#f97316";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1E2433" strokeWidth={6} fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={6} fill="none"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white leading-none">{score}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wide">score</span>
      </div>
    </div>
  );
}

const proFeatures = [
  { label: "10 Clickable Titles", icon: Sparkles },
  { label: "Thumbnail Concepts", icon: Target },
  { label: "Hook Script", icon: Zap },
  { label: "Video Outline", icon: ChevronRight },
  { label: "SEO Description", icon: TrendingUp },
  { label: "Full Script", icon: Lock },
];

export function HeroVideoIdea({ idea, channelDNA, channel, plan, competitors }: Props) {
  const [showPro, setShowPro] = useState(false);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  // Find competitors covering similar topics
  const relevantCompetitors = competitors
    .filter(c => c.top_videos?.length > 0)
    .slice(0, 3)
    .map(c => ({
      name: c.channel_name,
      video: c.top_videos[0],
    }));

  return (
    <>
      <div className="space-y-3">
        {/* Section label */}
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full bg-gradient-purple" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Your Next Best Video
          </span>
        </div>

        {/* Hero card */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(11,15,25,0.95) 60%)",
            border: "1px solid rgba(124,58,237,0.3)",
            boxShadow: "0 0 60px rgba(124,58,237,0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Glow bg */}
          <div className="absolute top-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row gap-8">

              {/* Left — Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-purple flex items-center justify-center shrink-0 glow-purple">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-xs text-accent font-semibold uppercase tracking-widest">
                      #1 Recommended
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-white leading-tight mt-1">
                      {idea.title}
                    </h1>
                  </div>
                </div>

                {/* Scores row */}
                <div className="flex items-center gap-6 mb-6 flex-wrap">
                  <ScoreRing score={idea.opportunityScore} size={80} />
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-4 h-4 text-green-400 shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Estimated Performance</div>
                        <div className="text-sm font-bold text-white">{idea.estimatedPerformance}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Audience Interest</div>
                        <div className="text-sm font-bold text-white">{idea.expectedAudienceInterest}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-yellow-400 shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Difficulty</div>
                        <div className={`text-sm font-bold ${
                          idea.difficulty === "Easy" ? "text-green-400" :
                          idea.difficulty === "Medium" ? "text-yellow-400" : "text-red-400"
                        }`}>{idea.difficulty}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Why section */}
                <div className="bg-white/[0.03] rounded-xl p-4 mb-6 border border-white/[0.06]">
                  <p className="text-xs font-semibold text-accent uppercase tracking-wide mb-2">
                    Why This Video?
                  </p>
                  <p className="text-white/80 text-sm leading-relaxed">{idea.reason}</p>
                </div>

                {/* Competitors proof */}
                {relevantCompetitors.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Competitors Winning With Similar Content
                    </p>
                    <div className="space-y-2">
                      {relevantCompetitors.map((c, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          <span className="text-accent font-medium shrink-0">{c.name}</span>
                          <span className="text-white/60 truncate">— {c.video?.title}</span>
                          {c.video?.viewCount && (
                            <span className="text-green-400 shrink-0 flex items-center gap-1 ml-auto">
                              <ArrowUpRight className="w-3 h-3" />
                              {(c.video.viewCount / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Topics */}
                {idea.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {idea.topics.map((t: string) => (
                      <span key={t} className="px-2.5 py-1 rounded-full bg-primary/15 text-accent text-xs font-medium border border-primary/20">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Right — Actions + Pro */}
              <div className="lg:w-72 shrink-0 space-y-4">

                {/* Primary CTA */}
                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full h-12 text-base font-bold glow-purple-lg gap-2"
                  onClick={() => setShowPro(true)}
                >
                  {plan === "pro" ? (
                    <><Sparkles className="w-5 h-5" /> Generate Full Pack</>
                  ) : (
                    <><Lock className="w-4 h-4" /> Unlock Full Pack — Pro</>
                  )}
                </Button>

                {/* Pro feature locked cards */}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium px-1">
                    {plan === "pro" ? "Available in your pack:" : "Unlock with Pro:"}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {proFeatures.map((f) => {
                      const Icon = f.icon;
                      const isPro = plan === "pro";
                      return (
                        <motion.button
                          key={f.label}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (isPro) {
                              setActiveFeature(f.label);
                              setShowPro(true);
                            } else {
                              setShowPro(true);
                            }
                          }}
                          className={`relative p-3 rounded-xl text-left transition-all border group ${
                            isPro
                              ? "bg-primary/10 border-primary/20 hover:border-primary/40"
                              : "bg-white/[0.02] border-white/[0.06] hover:border-white/10"
                          }`}
                        >
                          {!isPro && (
                            <div className="absolute inset-0 rounded-xl bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          )}
                          <Icon className={`w-4 h-4 mb-1.5 ${isPro ? "text-accent" : "text-muted-foreground"}`} />
                          <p className={`text-xs font-medium leading-tight ${isPro ? "text-white" : "text-muted-foreground"}`}>
                            {f.label}
                          </p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {plan !== "pro" && (
                  <div className="rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 border border-primary/30 p-4 text-center">
                    <p className="text-white font-bold text-sm mb-1">Unlock Everything</p>
                    <p className="text-muted-foreground text-xs mb-3">Scripts, titles, thumbnails & more for every idea</p>
                    <Button variant="gradient" size="sm" className="w-full gap-1.5 glow-purple">
                      Upgrade to Pro — $19/mo
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showPro && (
        <ProContentModal
          idea={idea}
          channelDNA={channelDNA}
          channel={channel}
          plan={plan}
          onClose={() => { setShowPro(false); setActiveFeature(null); }}
          defaultTab={activeFeature === "10 Clickable Titles" ? "titles" :
                      activeFeature === "Thumbnail Concepts" ? "thumbnails" :
                      activeFeature === "Video Outline" || activeFeature === "Hook Script" ? "outline" : "titles"}
        />
      )}
    </>
  );
}

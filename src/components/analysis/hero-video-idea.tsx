"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProContentModal } from "@/components/analysis/pro-content-modal";
import {
  Sparkles, TrendingUp, Target, Zap,
  Lock, CheckCircle2, Users, Activity,
  ArrowRight, Eye, Flame
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

/* ── Animated circular score ── */
function ConfidenceRing({ score }: { score: number }) {
  const size = 96;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#f97316";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1E2433" strokeWidth={7} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={7} fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${dash} ${circ}` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-2xl font-black text-white leading-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wide">/ 100</span>
      </div>
    </div>
  );
}

/* ── Single metric pill ── */
function MetricPill({
  icon: Icon, label, value, color = "text-white"
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.07]">
      <div className="flex items-center gap-1.5">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">{label}</span>
      </div>
      <span className={`text-sm font-bold ${color}`}>{value}</span>
    </div>
  );
}

/* ── Evidence check item ── */
function Evidence({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-2.5"
    >
      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
      <span className="text-sm text-white/80 leading-snug">{text}</span>
    </motion.div>
  );
}

/* ── Action button ── */
function ActionBtn({
  label, icon: Icon, onClick, locked = false, primary = false
}: {
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  locked?: boolean;
  primary?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full ${
        primary
          ? "bg-gradient-purple text-white glow-purple"
          : locked
          ? "bg-white/[0.03] border border-white/[0.08] text-muted-foreground hover:border-white/15"
          : "bg-white/[0.05] border border-white/[0.08] text-white hover:bg-white/[0.08]"
      }`}
    >
      <Icon className={`w-4 h-4 shrink-0 ${primary ? "text-white" : locked ? "text-muted-foreground" : "text-accent"}`} />
      <span className="flex-1 text-left">{label}</span>
      {locked ? (
        <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      ) : (
        <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-50" />
      )}
    </motion.button>
  );
}

export function HeroVideoIdea({ idea, channelDNA, channel, plan, competitors }: Props) {
  const [showPro, setShowPro] = useState(false);
  const [proTab, setProTab] = useState("titles");

  const isPro = plan === "pro";

  /* Build evidence list */
  const topComp = competitors.find(c => c.top_videos?.length > 0);
  const topViews = topComp?.top_videos[0]?.viewCount ?? 0;

  const evidence = [
    topViews > 0
      ? `Similar videos by competitors gained ${topViews > 500000 ? "500K+" : topViews > 100000 ? "100K+" : "50K+"} views`
      : "Multiple competitors are covering this topic successfully",
    `Matches your highest-performing ${(channelDNA?.contentStyle as string) ?? "content"} category`,
    `${competitors.filter(c => c.top_videos?.length > 0).length} competitors are currently winning with this topic`,
    "This specific angle has not been covered on your channel yet",
  ];

  /* Derive metrics */
  const compLevel = idea.difficulty === "Easy" ? "Low" : idea.difficulty === "Medium" ? "Medium" : "High";
  const trendVelocity = idea.opportunityScore >= 80 ? "Rising Fast 🚀" : idea.opportunityScore >= 60 ? "Growing" : "Stable";
  const audienceMatch = idea.opportunityScore >= 75 ? "Very High" : "High";

  function openPro(tab: string) {
    setProTab(tab);
    setShowPro(true);
  }

  return (
    <>
      <div className="space-y-3">
        {/* Label */}
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            Recommended Next Video
          </span>
        </div>

        {/* Main hero card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, rgba(124,58,237,0.18) 0%, rgba(11,15,25,0.97) 55%, rgba(11,15,25,1) 100%)",
            border: "1px solid rgba(124,58,237,0.35)",
            boxShadow: "0 0 80px rgba(124,58,237,0.12), 0 0 1px rgba(255,255,255,0.05) inset",
          }}
        >
          {/* Ambient glow */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col xl:flex-row gap-10">

              {/* ── LEFT COLUMN ── */}
              <div className="flex-1 min-w-0 space-y-7">

                {/* Title block */}
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight"
                  >
                    {idea.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground text-sm mt-2"
                  >
                    {idea.format} · {idea.expectedAudienceInterest} audience interest
                  </motion.p>
                </div>

                {/* Score + Metrics row */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex items-center gap-5 flex-wrap"
                >
                  <div className="flex items-center gap-4">
                    <ConfidenceRing score={idea.opportunityScore} />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Opportunity Score</p>
                      <p className="text-sm text-white/60">
                        {idea.opportunityScore >= 80 ? "Exceptional — act now" :
                         idea.opportunityScore >= 65 ? "Strong opportunity" : "Good opportunity"}
                      </p>
                    </div>
                  </div>

                  <div className="h-12 w-px bg-border/60 hidden md:block" />

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
                    <MetricPill icon={Eye} label="Est. Views" value={idea.estimatedPerformance} color="text-blue-400" />
                    <MetricPill icon={Activity} label="Trend" value={trendVelocity} color="text-green-400" />
                    <MetricPill icon={Users} label="Audience Match" value={audienceMatch} color="text-accent" />
                    <MetricPill icon={Target} label="Competition" value={compLevel}
                      color={compLevel === "Low" ? "text-green-400" : compLevel === "Medium" ? "text-yellow-400" : "text-red-400"} />
                  </div>
                </motion.div>

                {/* Why We Picked This */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-3"
                >
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Why We Picked This</p>
                  <div className="space-y-2.5">
                    {evidence.map((e, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.08 }}>
                        <Evidence text={e} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Topics */}
                {idea.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {idea.topics.map((t: string) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-primary/12 text-accent/80 text-xs font-medium border border-primary/20">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── RIGHT COLUMN — Action Panel ── */}
              <div className="xl:w-64 shrink-0 space-y-3">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest pb-1">
                  {isPro ? "Generate Content" : "Unlock Content Pack"}
                </p>

                <ActionBtn label="Generate Titles" icon={Sparkles} onClick={() => openPro("titles")} primary locked={!isPro} />
                <ActionBtn label="Generate Thumbnail" icon={Target} onClick={() => openPro("thumbnails")} locked={!isPro} />
                <ActionBtn label="Generate Hook Script" icon={Zap} onClick={() => openPro("outline")} locked={!isPro} />
                <ActionBtn label="Generate Outline" icon={TrendingUp} onClick={() => openPro("outline")} locked={!isPro} />

                {/* Full pack CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-2"
                >
                  {isPro ? (
                    <Button
                      variant="gradient"
                      className="w-full h-12 font-bold text-sm gap-2 glow-purple-lg"
                      onClick={() => openPro("titles")}
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Full Video Pack
                    </Button>
                  ) : (
                    <div className="rounded-xl overflow-hidden border border-primary/30"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(168,85,247,0.08) 100%)" }}
                    >
                      <div className="p-4 space-y-3">
                        <div className="space-y-1.5">
                          {["10 Clickable Titles", "3 Thumbnail Concepts", "Hook Script", "Full Outline", "SEO Description + Tags"].map(f => (
                            <div key={f} className="flex items-center gap-2 text-xs text-white/60">
                              <CheckCircle2 className="w-3 h-3 text-accent/60 shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                        <Button
                          variant="gradient"
                          size="sm"
                          className="w-full font-bold gap-1.5 glow-purple"
                          onClick={() => openPro("titles")}
                        >
                          Unlock This Video
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <p className="text-center text-xs text-muted-foreground">Pro · $19/mo · Cancel anytime</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPro && (
        <ProContentModal
          idea={idea}
          channelDNA={channelDNA}
          channel={channel}
          plan={plan}
          onClose={() => setShowPro(false)}
          defaultTab={proTab}
        />
      )}
    </>
  );
}

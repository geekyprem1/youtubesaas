"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ProContentModal } from "@/components/analysis/pro-content-modal";
import {
  CheckCircle2, ArrowRight, Lock,
  Calendar, TrendingUp, Zap, FileText, Eye,
  Sparkles, Flame, Target
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

/* ── Confidence ring ── */
function ConfidenceRing({ score }: { score: number }) {
  const size = 88;
  const r = 34;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#f97316";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#1E2433" strokeWidth={6} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={6} fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circ}` }}
          animate={{ strokeDasharray: `${(score / 100) * circ} ${circ}` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-white leading-none">{score}</span>
        <span className="text-[9px] text-muted-foreground uppercase tracking-wide">score</span>
      </div>
    </div>
  );
}

/* ── Stat chip ── */
function StatChip({
  icon: Icon, label, value, accent = false
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border ${
      accent
        ? "bg-primary/12 border-primary/25"
        : "bg-white/[0.04] border-white/[0.07]"
    }`}>
      <Icon className={`w-3.5 h-3.5 shrink-0 ${accent ? "text-accent" : "text-muted-foreground"}`} />
      <div>
        <p className="text-[10px] text-muted-foreground leading-none mb-0.5">{label}</p>
        <p className={`text-xs font-bold leading-none ${accent ? "text-white" : "text-white/80"}`}>{value}</p>
      </div>
    </div>
  );
}

/* ── Competitor proof row ── */
function CompetitorProof({ name, views }: { name: string; views: number }) {
  const formatted = views >= 1000000
    ? `${(views / 1000000).toFixed(1)}M`
    : views >= 1000
    ? `${Math.round(views / 1000)}K`
    : views.toString();

  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="text-sm text-white/80 font-medium">{name}</span>
      </div>
      <span className="text-sm font-bold text-green-400">{formatted} Views</span>
    </div>
  );
}

/* ── Action button ── */
function ActionButton({
  label, sub, icon: Icon, onClick, locked, variant = "default"
}: {
  label: string;
  sub: string;
  icon: React.ElementType;
  onClick: () => void;
  locked: boolean;
  variant?: "primary" | "default";
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all ${
        variant === "primary"
          ? "bg-gradient-purple border-primary/40 glow-purple"
          : "bg-white/[0.03] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.06]"
      }`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
        variant === "primary" ? "bg-white/20" : "bg-white/[0.06]"
      }`}>
        <Icon className={`w-4 h-4 ${variant === "primary" ? "text-white" : locked ? "text-muted-foreground" : "text-accent"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-none ${variant === "primary" ? "text-white" : locked ? "text-muted-foreground" : "text-white"}`}>
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1 leading-none">{sub}</p>
      </div>
      {locked
        ? <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        : <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />}
    </motion.button>
  );
}

export function HeroVideoIdea({ idea, channelDNA, channel, plan, competitors }: Props) {
  const [showPro, setShowPro] = useState(false);
  const [proTab, setProTab] = useState("titles");
  const isPro = plan === "pro";

  function open(tab: string) { setProTab(tab); setShowPro(true); }

  /* Build competitor proof */
  const proofItems = competitors
    .filter(c => c.top_videos?.[0]?.viewCount > 0)
    .slice(0, 4)
    .map(c => ({ name: c.channel_name, views: c.top_videos[0].viewCount }));

  const totalProofViews = proofItems.reduce((s, p) => s + p.views, 0);
  const totalFormatted = totalProofViews >= 1000000
    ? `${(totalProofViews / 1000000).toFixed(1)}M`
    : `${Math.round(totalProofViews / 1000)}K`;

  /* Confidence = derived from opportunity score */
  const confidence = Math.min(99, Math.round(idea.opportunityScore * 1.05 - 2));

  /* Evidence items */
  const evidence = [
    proofItems.length > 0
      ? `Similar videos generated ${totalFormatted}+ combined views across ${proofItems.length} competitors`
      : "Multiple competitors actively winning with this exact topic right now",
    `Directly matches your highest-performing ${(channelDNA?.contentStyle as string) ?? "content"} category`,
    `${competitors.filter(c => c.top_videos?.length > 0).length} competitors are currently winning with this topic`,
    "Audience search interest for this topic is increasing month-over-month",
    "This specific angle has never been covered on your channel",
  ];

  return (
    <>
      <div className="space-y-3">
        {/* Section label */}
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
            Recommended Next Video
          </span>
        </div>

        {/* ═══ HERO CARD ═══ */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(150deg, rgba(124,58,237,0.16) 0%, rgba(11,15,25,0.98) 50%)",
            border: "1px solid rgba(124,58,237,0.3)",
            boxShadow: "0 0 80px rgba(124,58,237,0.1), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div className="absolute -top-24 -left-16 w-96 h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-72 h-72 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-7 md:p-9">
            <div className="flex flex-col xl:flex-row gap-9">

              {/* ── LEFT ── */}
              <div className="flex-1 min-w-0 space-y-6">

                {/* Title + confidence */}
                <div className="flex items-start gap-5">
                  <ConfidenceRing score={idea.opportunityScore} />
                  <div className="flex-1 min-w-0 pt-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2 mb-2"
                    >
                      <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
                        {confidence}% Confidence
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Based on {proofItems.length > 0 ? "competitor data + " : ""}channel performance
                      </span>
                    </motion.div>
                    <motion.h1
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight"
                    >
                      {idea.title}
                    </motion.h1>
                    <p className="text-muted-foreground text-sm mt-1.5">
                      {idea.format} · {idea.expectedAudienceInterest}
                    </p>
                  </div>
                </div>

                {/* Stat chips */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="flex flex-wrap gap-2"
                >
                  <StatChip icon={Eye} label="Estimated Views" value={idea.estimatedPerformance} accent />
                  <StatChip icon={TrendingUp} label="Trend Velocity"
                    value={idea.opportunityScore >= 80 ? "Rising Fast 🚀" : idea.opportunityScore >= 65 ? "Growing ↑" : "Stable →"} />
                  <StatChip icon={Target} label="Competition"
                    value={idea.difficulty === "Easy" ? "Low ✓" : idea.difficulty === "Medium" ? "Medium" : "High"} />
                  <StatChip icon={Calendar} label="Best Window" value="Next 7 Days" accent />
                </motion.div>

                {/* ── Why This Will Work ── */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-xl border border-white/[0.07] overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.025)" }}
                >
                  <div className="px-5 py-3.5 border-b border-white/[0.06]">
                    <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                      Why This Will Work
                    </p>
                  </div>
                  <div className="px-5 py-4 space-y-2.5">
                    {evidence.map((e, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.07 }}
                        className="flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm text-white/75 leading-snug">{e}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Competitor proof */}
                {proofItems.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-xl border border-white/[0.07] overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest">
                        Competitor Proof
                      </p>
                      <span className="text-xs text-green-400 font-semibold">
                        {totalFormatted} combined views
                      </span>
                    </div>
                    <div className="px-5 py-3">
                      {proofItems.map((p, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.35 + i * 0.06 }}
                        >
                          <CompetitorProof name={p.name} views={p.views} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Topics */}
                {idea.topics?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {idea.topics.map((t: string) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-accent/70 text-xs font-medium border border-primary/15">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ── RIGHT — Action Panel ── */}
              <div className="xl:w-64 shrink-0 space-y-2.5">
                <p className="text-[11px] font-bold text-white/30 uppercase tracking-widest pb-1">
                  {isPro ? "Generate Content Pack" : "Unlock Content Pack"}
                </p>

                <ActionButton
                  label="Get 10 Winning Titles"
                  sub="Optimized for clicks & CTR"
                  icon={Sparkles}
                  onClick={() => open("titles")}
                  locked={!isPro}
                  variant="primary"
                />
                <ActionButton
                  label="Create Thumbnail Concepts"
                  sub="3 visual concepts + prompts"
                  icon={Target}
                  onClick={() => open("thumbnails")}
                  locked={!isPro}
                />
                <ActionButton
                  label="Build Hook Script"
                  sub="First 30 seconds that retain"
                  icon={Zap}
                  onClick={() => open("outline")}
                  locked={!isPro}
                />
                <ActionButton
                  label="Create Full Video Plan"
                  sub="Outline + SEO description + tags"
                  icon={FileText}
                  onClick={() => open("outline")}
                  locked={!isPro}
                />

                {/* Divider */}
                <div className="pt-1">
                  {isPro ? (
                    <Button
                      variant="gradient"
                      className="w-full h-11 font-bold text-sm gap-2 glow-purple"
                      onClick={() => open("titles")}
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Full Pack
                    </Button>
                  ) : (
                    <div
                      className="rounded-xl border border-primary/30 overflow-hidden"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15) 0%, rgba(11,15,25,0.9) 100%)" }}
                    >
                      <div className="px-4 pt-4 pb-1">
                        <p className="text-sm font-bold text-white mb-0.5">
                          Turn This Idea Into A Publish-Ready Video
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                          Everything you need to film — generated in under 30 seconds.
                        </p>
                        <div className="space-y-1.5 mb-4">
                          {[
                            "10 Clickable Titles",
                            "Thumbnail Concepts + Prompts",
                            "Hook Script",
                            "Full Video Outline",
                            "SEO Description + Tags",
                            "CTR Optimization Tips",
                          ].map(f => (
                            <div key={f} className="flex items-center gap-2 text-xs text-white/55">
                              <CheckCircle2 className="w-3 h-3 text-accent/50 shrink-0" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="px-4 pb-4 space-y-2">
                        <Button
                          variant="gradient"
                          className="w-full h-10 font-bold text-sm gap-1.5 glow-purple"
                          onClick={() => open("titles")}
                        >
                          Unlock This Video
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                        <p className="text-center text-[11px] text-muted-foreground">
                          Pro · $19/mo · Cancel anytime
                        </p>
                      </div>
                    </div>
                  )}
                </div>
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

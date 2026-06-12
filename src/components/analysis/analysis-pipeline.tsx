"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Brain, Search, TrendingUp, Zap, FileText } from "lucide-react";

/* ── Stage config ── */
const STAGES = [
  {
    step: 0,
    label: "Collecting Channel Data",
    headline: "Analyzing Your Content DNA",
    sub: "Reading your channel history, video patterns, and audience signals",
    icon: Brain,
    color: "text-violet-400",
    glow: "rgba(124,58,237,0.35)",
  },
  {
    step: 1,
    label: "Analyzing Winning Videos",
    headline: "Discovering Winning Patterns",
    sub: "Scoring every video by performance, engagement rate, and audience retention",
    icon: TrendingUp,
    color: "text-blue-400",
    glow: "rgba(59,130,246,0.35)",
  },
  {
    step: 2,
    label: "Finding Competitors",
    headline: "Finding Competitor Opportunities",
    sub: "Mapping the competitive landscape and spotting content gaps",
    icon: Search,
    color: "text-cyan-400",
    glow: "rgba(34,211,238,0.3)",
  },
  {
    step: 3,
    label: "Detecting Content Gaps",
    headline: "Calculating Growth Potential",
    sub: "Identifying topics your audience wants that competitors are winning with",
    icon: Zap,
    color: "text-yellow-400",
    glow: "rgba(234,179,8,0.3)",
  },
  {
    step: 4,
    label: "Generating Recommendations",
    headline: "Predicting Your Next Best Video",
    sub: "Running opportunity scoring across 20+ signals to rank your best moves",
    icon: Sparkles,
    color: "text-orange-400",
    glow: "rgba(251,146,60,0.35)",
  },
  {
    step: 5,
    label: "Preparing Growth Report",
    headline: "Finalizing Your Growth Report",
    sub: "Assembling your personalized video strategy and content plan",
    icon: FileText,
    color: "text-green-400",
    glow: "rgba(34,197,94,0.35)",
  },
  {
    step: 6,
    label: "Preparing Growth Report",
    headline: "High-Confidence Opportunity Detected",
    sub: "We found a strong opportunity for your channel. Preparing reveal…",
    icon: Sparkles,
    color: "text-green-400",
    glow: "rgba(34,197,94,0.45)",
  },
];

/* ── Live insight pool (deterministic from step) ── */
const INSIGHT_POOL = [
  { step: 0, icon: "🎯", text: "Channel topic cluster identified" },
  { step: 0, icon: "📊", text: "Last 50 videos loaded and indexed" },
  { step: 1, icon: "🏆", text: "Top performing content format detected" },
  { step: 1, icon: "📈", text: "Engagement patterns mapped across 50 videos" },
  { step: 1, icon: "⏱️", text: "Audience watch time signals analyzed" },
  { step: 2, icon: "🔍", text: "Competitor landscape scanned" },
  { step: 2, icon: "👥", text: "Similar channels discovered and ranked" },
  { step: 2, icon: "💡", text: "Competitor content strategies mapped" },
  { step: 3, icon: "🕳️", text: "Content gap opportunities identified" },
  { step: 3, icon: "🚀", text: "High-opportunity topics surfaced" },
  { step: 3, icon: "🎪", text: "Audience preference patterns confirmed" },
  { step: 4, icon: "⚡", text: "Opportunity scores calculated" },
  { step: 4, icon: "🎯", text: "High-confidence video idea ranked #1" },
  { step: 5, icon: "✨", text: "Personalized recommendation ready" },
  { step: 6, icon: "🔥", text: "Strong opportunity detected for your channel" },
];

/* ── Rotating headline hook ── */
function useRotatingHeadline(step: number) {
  const stage = STAGES.find(s => s.step === Math.min(step, 6)) ?? STAGES[0];
  const headlines = STAGES.map(s => s.headline);
  const [idx, setIdx] = useState(step);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
    const t1 = setTimeout(() => { setIdx(Math.min(step, 6)); setVisible(true); }, 300);
    return () => clearTimeout(t1);
  }, [step]);

  // Auto-cycle between neighbour headlines while waiting
  useEffect(() => {
    if (step >= 6) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx(prev => (prev + 1) % headlines.length);
        setVisible(true);
      }, 300);
    }, 3200);
    return () => clearInterval(interval);
  }, [step, headlines.length]);

  return { headline: STAGES[idx % STAGES.length].headline, visible, stage };
}

/* ── Progress % from step ── */
function stepToPercent(step: number): number {
  const map: Record<number, number> = { 0: 5, 1: 18, 2: 36, 3: 54, 4: 72, 5: 88, 6: 97 };
  return map[Math.min(step, 6)] ?? 5;
}

/* ── Insight row ── */
function InsightRow({ insight, delay }: { insight: { icon: string; text: string }; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
      className="flex items-center gap-2.5 py-2 border-b border-white/[0.04] last:border-0"
    >
      <span className="text-base leading-none shrink-0">{insight.icon}</span>
      <span className="text-xs text-white/60 leading-snug">{insight.text}</span>
      <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 ml-auto" />
    </motion.div>
  );
}

/* ── Skeleton card ── */
function SkeletonCard({ delay = 0, wide = false }: { delay?: number; wide?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={`rounded-xl border border-white/[0.06] p-4 ${wide ? "col-span-2" : ""}`}
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="h-3 w-1/3 rounded-full bg-white/[0.06] mb-3 animate-pulse" />
      <div className="h-2 w-full rounded-full bg-white/[0.04] mb-2 animate-pulse" />
      <div className="h-2 w-3/4 rounded-full bg-white/[0.04] animate-pulse" />
    </motion.div>
  );
}

interface Props {
  currentStep: number;
  channelUrl: string;
}

export function AnalysisPipeline({ currentStep, channelUrl }: Props) {
  const step = currentStep ?? 0;
  const { headline, visible, stage } = useRotatingHeadline(step);
  const percent = stepToPercent(step);
  const [displayPercent, setDisplayPercent] = useState(0);
  const prevStep = useRef(-1);

  // Visible insights accumulate as steps complete
  const visibleInsights = INSIGHT_POOL.filter(i => i.step <= step);

  // Smooth number counter
  useEffect(() => {
    const target = percent;
    const start = displayPercent;
    const duration = 900;
    const startTime = performance.now();
    const raf = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayPercent(Math.round(start + (target - start) * eased));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent]);

  // Track previous step for new-step flash
  useEffect(() => { prevStep.current = step; }, [step]);

  const StageIcon = stage.icon;
  const isFinal = step >= 6;

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* ═══ MAIN CARD ═══ */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(150deg, rgba(124,58,237,0.12) 0%, rgba(11,15,25,0.98) 60%)",
          border: "1px solid rgba(124,58,237,0.2)",
          boxShadow: `0 0 80px ${stage.glow}, inset 0 1px 0 rgba(255,255,255,0.04)`,
          transition: "box-shadow 1s ease",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
          style={{ background: stage.glow, opacity: 0.5 }}
        />

        <div className="relative z-10 p-8 md:p-10">
          <div className="flex flex-col md:flex-row gap-8">

            {/* ── LEFT ── */}
            <div className="flex-1 min-w-0">

              {/* Icon + rotating headline */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div
                  key={stage.step}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    background: `radial-gradient(circle, ${stage.glow} 0%, rgba(11,15,25,0.8) 100%)`,
                    border: `1px solid ${stage.glow}`,
                  }}
                >
                  <StageIcon className={`w-6 h-6 ${stage.color}`} />
                </motion.div>

                <div className="min-w-0">
                  <AnimatePresence mode="wait">
                    {visible && (
                      <motion.h2
                        key={headline}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.28 }}
                        className="text-2xl md:text-3xl font-black text-white leading-tight"
                      >
                        {headline}
                      </motion.h2>
                    )}
                  </AnimatePresence>
                  <AnimatePresence mode="wait">
                    {visible && (
                      <motion.p
                        key={stage.sub}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-sm text-muted-foreground mt-1"
                      >
                        {stage.sub}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                    {stage.label}
                  </span>
                  <motion.span
                    key={displayPercent}
                    className={`text-sm font-black tabular-nums ${isFinal ? "text-green-400" : stage.color}`}
                  >
                    {displayPercent}%
                  </motion.span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: isFinal
                        ? "linear-gradient(90deg, #22c55e, #86efac)"
                        : "linear-gradient(90deg, #7c3aed, #a855f7, #c084fc)",
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>

                {/* Stage pills */}
                <div className="flex items-center gap-1 mt-3 flex-wrap">
                  {STAGES.slice(0, 6).map((s, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-700 ${
                        i < step ? "bg-accent" : i === step ? "bg-accent/50 animate-pulse" : "bg-white/[0.06]"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Pipeline step list */}
              <div className="space-y-1">
                {STAGES.slice(0, 6).map((s, i) => {
                  const done = step > s.step;
                  const running = step === s.step;
                  const SIcon = s.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: done ? 1 : running ? 1 : 0.3, x: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                        running ? "bg-primary/10 border border-primary/20" : ""
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      ) : running ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="shrink-0"
                        >
                          <SIcon className={`w-4 h-4 ${s.color}`} />
                        </motion.div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-white/[0.12] shrink-0" />
                      )}
                      <span className={`text-xs font-medium ${running ? "text-white" : done ? "text-white/60" : "text-white/25"}`}>
                        {s.label}
                      </span>
                      {running && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-[10px] text-accent ml-auto"
                        >
                          running
                        </motion.span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* ── RIGHT — Intelligence Feed ── */}
            <div className="md:w-60 shrink-0">
              <div className="rounded-xl border border-white/[0.07] overflow-hidden h-full"
                style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                  />
                  <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest">
                    Insights Discovered
                  </span>
                </div>
                <div className="px-4 py-3 space-y-0 max-h-72 overflow-hidden">
                  <AnimatePresence>
                    {visibleInsights.slice(-8).map((ins, i) => (
                      <InsightRow key={`${ins.step}-${i}`} insight={ins} delay={0.05 * i} />
                    ))}
                  </AnimatePresence>
                  {visibleInsights.length === 0 && (
                    <p className="text-xs text-muted-foreground py-4 text-center">
                      Scanning…
                    </p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Final moment reveal ── */}
        <AnimatePresence>
          {isFinal && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="border-t border-green-400/20 px-8 md:px-10 py-5"
              style={{ background: "rgba(34,197,94,0.06)" }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Sparkles className="w-5 h-5 text-green-400" />
                </motion.div>
                <p className="text-sm font-semibold text-green-300">
                  We found a strong opportunity for your channel — preparing your results…
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Preview skeleton cards ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 0.4, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-3"
      >
        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">
          Preview — Results loading
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <SkeletonCard delay={0.7} wide />
          <SkeletonCard delay={0.85} />
          <SkeletonCard delay={0.95} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <SkeletonCard delay={1.05} />
          <SkeletonCard delay={1.15} />
          <SkeletonCard delay={1.25} />
        </div>
      </motion.div>

      {/* ── Bottom hint ── */}
      <p className="text-center text-xs text-muted-foreground pb-4">
        Analysis typically takes 1–3 minutes · Keep this tab open
      </p>
    </div>
  );
}

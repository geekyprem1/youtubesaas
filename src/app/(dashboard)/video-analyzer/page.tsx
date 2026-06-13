"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2, Film, AlertCircle, CheckCircle2, XCircle,
  TrendingUp, Eye, ThumbsUp, MessageSquare, Clock,
  Lightbulb, Target, Zap, ArrowRight, Play, CrownIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VideoAnalysis } from "@/lib/gemini";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

/* ── Score ring ── */
function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 28; const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" className="-rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} stroke="#1E2433" strokeWidth="5" fill="none" />
          <motion.circle cx="32" cy="32" r={r} stroke={color} strokeWidth="5" fill="none"
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${(score / 100) * circ} ${circ}` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-black text-white">{score}</span>
        </div>
      </div>
      <span className="text-[10px] text-muted-foreground text-center leading-tight font-medium">{label}</span>
    </div>
  );
}

/* ── Framework card ── */
function FrameworkCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <div className="rounded-xl border border-white/[0.07] p-4" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
      </div>
      <p className="text-sm text-white/80 leading-snug">{value}</p>
    </div>
  );
}

/* ── Opportunity card ── */
function OpportunityCard({ opp, index }: { opp: VideoAnalysis["similarOpportunities"][0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl border border-primary/20 p-5"
      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(11,15,25,0.9) 100%)" }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
          <span className="text-xs font-black text-accent">#{index + 1}</span>
        </div>
        <h4 className="text-sm font-bold text-white leading-snug">{opp.title}</h4>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex gap-2">
          <span className="text-white/30 shrink-0 font-semibold">Angle</span>
          <span className="text-white/70">{opp.angle}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-white/30 shrink-0 font-semibold">Hook</span>
          <span className="text-accent/80 italic">"{opp.hook}"</span>
        </div>
        <div className="flex gap-2">
          <span className="text-white/30 shrink-0 font-semibold">Why</span>
          <span className="text-white/60">{opp.whyItWillWork}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface VideoData {
  id: string;
  title: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  thumbnailUrl: string;
  publishedAt: string;
  duration: string;
}

function ProGate() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mx-auto glow-purple">
          <Film className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white mb-3">Video Analyzer</h1>
          <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
            Paste any YouTube video — UploadIQ deconstructs why it worked and generates 5 unique opportunities for your channel.
          </p>
        </div>

        {/* Feature previews */}
        <div className="grid grid-cols-2 gap-3 text-left max-w-sm mx-auto">
          {[
            { icon: TrendingUp, text: "Virality & hook scores", color: "text-orange-400" },
            { icon: Target, text: "Emotional trigger analysis", color: "text-red-400" },
            { icon: Lightbulb, text: "5 similar opportunities", color: "text-yellow-400" },
            { icon: Clock, text: "Full video framework", color: "text-blue-400" },
          ].map(({ icon: Icon, text, color }) => (
            <div key={text} className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] px-3 py-2.5">
              <Icon className={`w-4 h-4 shrink-0 ${color}`} />
              <span className="text-xs text-white/70 font-medium">{text}</span>
            </div>
          ))}
        </div>

        {/* Locked CTA */}
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CrownIcon className="w-4 h-4 text-accent" />
            <span className="text-sm font-bold text-accent">Pro Feature</span>
          </div>
          <p className="text-sm text-muted-foreground mb-5">
            Video Analyzer is available on Creator Pro. Upgrade to unlock unlimited video breakdowns.
          </p>
          <Button variant="gradient" size="lg" className="gap-2 glow-purple font-bold" asChild>
            <Link href="/pricing">
              <CrownIcon className="w-4 h-4" />
              Upgrade to Pro — $19/month
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground mt-3">No contracts · Cancel anytime</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function VideoAnalyzerPage() {
  const [plan, setPlan] = useState<"free" | "pro" | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ video: VideoData; analysis: VideoAnalysis } | null>(null);

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => setPlan(d.user?.plan ?? "free"));
  }, []);

  async function handleAnalyze() {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Analysis failed"); return; }
      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const a = result?.analysis;
  const v = result?.video;

  const scoreConfigs = [
    { key: "viralityScore", label: "Virality Score", color: "#f97316" },
    { key: "hookStrength", label: "Hook Strength", color: "#a855f7" },
    { key: "titleStrength", label: "Title Strength", color: "#3b82f6" },
    { key: "thumbnailStrength", label: "Thumbnail", color: "#06b6d4" },
    { key: "audienceMatch", label: "Audience Match", color: "#22c55e" },
    { key: "retentionPotential", label: "Retention", color: "#eab308" },
  ] as const;

  if (plan === null) return null; // loading
  if (plan === "free") return <ProGate />;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Film className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-black text-white">Video Analyzer</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Paste any YouTube video URL. UploadIQ will deconstruct why it worked and generate 5 unique opportunities for you.
        </p>
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-6">
        <div className="flex gap-3">
          <input
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAnalyze()}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <Button
            variant="gradient"
            className="h-11 px-6 gap-2 glow-purple font-bold shrink-0"
            onClick={handleAnalyze}
            disabled={loading || !url.trim()}
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</> : <><Zap className="w-4 h-4" /> Analyze</>}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-3 text-sm text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-5 space-y-3">
            {["Fetching video data from YouTube...", "Analyzing title psychology and hook strength...", "Deconstructing video framework...", "Generating 5 similar opportunities..."].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.4 }}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-accent shrink-0" />
                {s}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && a && v && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {/* Video meta strip */}
            <div className="glass rounded-2xl p-5 flex gap-4">
              {v.thumbnailUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.thumbnailUrl} alt={v.title}
                  className="w-36 rounded-xl object-cover shrink-0 aspect-video" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">{v.channelTitle}</p>
                <h2 className="text-lg font-bold text-white leading-snug mb-3 line-clamp-2">{v.title}</h2>
                <div className="flex items-center flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{formatNumber(v.viewCount)}</span>
                  <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" />{formatNumber(v.likeCount)}</span>
                  <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" />{formatNumber(v.commentCount)}</span>
                  <a href={`https://youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-accent hover:underline">
                    <Play className="w-3.5 h-3.5" /> Watch Video
                  </a>
                </div>
              </div>
            </div>

            {/* Score grid */}
            <div className="glass rounded-2xl p-7">
              <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Performance Scores</p>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
                {scoreConfigs.map(sc => (
                  <ScoreRing key={sc.key} score={a[sc.key]} label={sc.label} color={sc.color} />
                ))}
              </div>
            </div>

            {/* Why it worked */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                Why This Video Performed
              </h3>
              <p className="text-sm text-white/75 leading-relaxed mb-4">{a.whyItWorked}</p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Title Analysis</p>
                  <p className="text-xs text-white/70 leading-snug">{a.titleBreakdown}</p>
                </div>
                <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Hook Analysis</p>
                  <p className="text-xs text-white/70 leading-snug">{a.hookBreakdown}</p>
                </div>
              </div>
            </div>

            {/* Emotional triggers + strengths/weaknesses */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-orange-400" /> Emotional Triggers
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {a.emotionalTriggers.map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Strengths
                </p>
                <div className="space-y-2">
                  {a.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                      <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />{s}
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-5">
                <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-red-400" /> Improvement Areas
                </p>
                <div className="space-y-2">
                  {a.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-white/70">
                      <XCircle className="w-3 h-3 text-red-400 shrink-0 mt-0.5" />{w}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Framework */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Video Framework Breakdown
              </h3>
              <div className="grid md:grid-cols-5 gap-3 mb-5">
                {Object.entries(a.videoFramework).map(([key, val]) => {
                  const icons: Record<string, React.ElementType> = {
                    hook: Zap, problem: Target, story: Film, proof: CheckCircle2, cta: ArrowRight
                  };
                  const colors: Record<string, string> = {
                    hook: "text-orange-400", problem: "text-red-400", story: "text-blue-400", proof: "text-green-400", cta: "text-accent"
                  };
                  return (
                    <FrameworkCard key={key} label={key.toUpperCase()} value={val}
                      icon={icons[key] ?? Film} color={colors[key] ?? "text-muted-foreground"} />
                  );
                })}
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Estimated Timeline</p>
                {a.timeline.map((t, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="text-accent font-mono w-12 shrink-0 pt-0.5">{t.timestamp}</span>
                    <span className="font-semibold text-white shrink-0 w-24">{t.section}</span>
                    <span className="text-muted-foreground">{t.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Similar Opportunities */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-bold text-white">5 Similar Opportunities For You</span>
                <span className="text-xs text-muted-foreground ml-auto">Not copies — unique angles</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {a.similarOpportunities.slice(0, 5).map((opp, i) => (
                  <OpportunityCard key={i} opp={opp} index={i} />
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Youtube, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

const steps = ["Your Channel", "Your Niche"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [channelUrl, setChannelUrl] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleCategory(id: string) {
    setInterests(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }

  async function finish() {
    if (interests.length === 0) { setError("Pick at least 1 category"); return; }
    setSaving(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests, channelUrl }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const d = await res.json();
      setError(d.error ?? "Something went wrong");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-purple flex items-center justify-center glow-purple">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <span className="font-black text-white text-lg">UploadIQ</span>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              i === step ? "bg-primary/20 text-accent border border-primary/30" :
              i < step ? "bg-green-500/15 text-green-400 border border-green-500/20" :
              "bg-white/[0.04] text-muted-foreground border border-white/[0.07]"
            }`}>
              {i < step ? <Check className="w-3 h-3" /> : <span className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center text-[9px]">{i + 1}</span>}
              {s}
            </div>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < step ? "bg-green-500/40" : "bg-white/[0.08]"}`} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">

          {/* Step 0: Channel URL */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass rounded-2xl p-8"
            >
              <div className="mb-6">
                <h1 className="text-2xl font-black text-white mb-2">What&apos;s your YouTube channel?</h1>
                <p className="text-sm text-muted-foreground">We&apos;ll use this to personalise your opportunity feed. You can skip this and add it later.</p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={channelUrl}
                  onChange={e => setChannelUrl(e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
                />

                <button
                  onClick={() => setStep(1)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-purple text-white font-bold text-sm hover:opacity-90 transition-opacity glow-purple"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setStep(1)}
                  className="w-full text-center text-sm text-muted-foreground hover:text-white transition-colors py-1"
                >
                  Skip for now →
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Category selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="glass rounded-2xl p-8"
            >
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <h1 className="text-2xl font-black text-white">What do you create content about?</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                  Pick up to <span className="text-white font-semibold">3 categories</span> — we&apos;ll show trending opportunities tailored to your niche.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                {CATEGORIES.map(cat => {
                  const selected = interests.includes(cat.id);
                  const maxed = interests.length >= 3 && !selected;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      disabled={maxed}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                        selected
                          ? "bg-primary/15 border-primary/40 text-white"
                          : maxed
                          ? "bg-white/[0.02] border-white/[0.04] text-muted-foreground/40 cursor-not-allowed"
                          : "bg-white/[0.03] border-white/[0.07] text-white/80 hover:border-primary/25 hover:bg-primary/8"
                      }`}
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-sm font-semibold leading-tight">{cat.label}</span>
                      {selected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">{interests.length}/3 selected</span>
                {error && <span className="text-xs text-red-400">{error}</span>}
              </div>

              <button
                onClick={finish}
                disabled={saving || interests.length === 0}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-purple text-white font-bold text-sm hover:opacity-90 transition-opacity glow-purple disabled:opacity-40"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Setting up your dashboard...</>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Show Me My Opportunities
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">You can change these anytime in Settings</p>
    </div>
  );
}

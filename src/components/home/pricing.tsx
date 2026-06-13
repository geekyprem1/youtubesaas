"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, X, CrownIcon, Zap } from "lucide-react";
import Link from "next/link";

const freeFeatures = [
  { text: "3 analyses per day", included: true },
  { text: "5 video ideas per analysis", included: true },
  { text: "Top 3 competitors only", included: true },
  { text: "Safe Choice strategy only", included: true },
  { text: "Basic confidence scores", included: true },
  { text: "Analysis history", included: true },
  { text: "Growth Bet & Viral Bet strategies", included: false },
  { text: "Full competitor intelligence", included: false },
  { text: "Hook scripts + video outlines", included: false },
  { text: "SEO descriptions + tags", included: false },
];

const proFeatures = [
  "Unlimited analyses",
  "20+ video ideas per analysis",
  "All 10 competitors analyzed",
  "All 3 strategies (Safe · Growth · Viral)",
  "10 title variations per idea",
  "Hook script + full video outline",
  "SEO description + tags + CTA",
  "3 thumbnail concepts per idea",
  "Full execution plan",
  "Opportunity Radar + Watchlist + Calendar",
  "Priority processing",
];
export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">One winning video pays for <span className="gradient-text">a full year</span></h2>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">Start free to see what UploadIQ finds. Upgrade when you&apos;re ready to act on every opportunity.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Free card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl p-8 border border-border/60">
            <h3 className="text-lg font-bold text-white mb-0.5">Starter</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-black text-white">$0</span>
              <span className="text-muted-foreground text-sm">/forever</span>
            </div>
            <p className="text-sm text-muted-foreground mb-6">See what UploadIQ finds for your channel. No credit card required.</p>
            <ul className="space-y-3 mb-8">
              {freeFeatures.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm">
                  {f.included
                    ? <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    : <X className="w-4 h-4 text-white/20 mt-0.5 shrink-0" />
                  }
                  <span className={f.included ? "text-white/80" : "text-white/30"}>{f.text}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href="/signup">Start For Free</Link>
            </Button>
          </motion.div>

          {/* Pro card */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="relative rounded-2xl p-8 bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/40">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-purple text-white text-xs font-bold">
                <CrownIcon className="w-3 h-3" />Most Popular
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-0.5">Creator Pro</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-black text-white">$19</span>
              <span className="text-muted-foreground text-sm">/month</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">The complete creator intelligence stack for serious growth.</p>
            <div className="mb-6 py-3 px-4 rounded-xl bg-green-400/8 border border-green-400/15">
              <p className="text-xs text-green-400 font-semibold flex items-center gap-1.5">
                <Zap className="w-3 h-3" />One winning video pays for a full year of Pro.
              </p>
            </div>
            <ul className="space-y-3 mb-8">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  <span className="text-white/80">{f}</span>
                </li>
              ))}
            </ul>
            <Button variant="gradient" size="lg" className="w-full glow-purple font-bold" asChild>
              <Link href="/signup?plan=pro">Start Growing Today</Link>
            </Button>
          </motion.div>

        </div>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-muted-foreground mt-8">
          No contracts. Cancel anytime. Your data stays private.
        </motion.p>
      </div>
    </section>
  );
}

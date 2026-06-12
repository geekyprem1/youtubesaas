"use client";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
export function FinalCTA() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-4">Ready?</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
            Stop Guessing.<br /><span className="gradient-text">Start Growing.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Your next best video is already hiding in your data. Paste your channel URL and find it in 90 seconds — free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-purple text-white font-bold text-base hover:opacity-90 transition-opacity glow-purple">
              Find My Next Video Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#how-it-works" className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass text-white font-semibold text-base hover:border-primary/30 transition-colors">
              See How It Works
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            {["No credit card","Free to start","Results in 90 seconds","10K+ creators"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />{t}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

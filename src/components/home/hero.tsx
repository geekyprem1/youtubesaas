"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function Hero() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleAnalyze() {
    if (!url.trim()) return;
    router.push(`/signup?channel=${encodeURIComponent(url)}`);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-2xl" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-purple border border-primary/20 text-sm text-accent mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>10,000+ creators already growing with UploadIQ</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6 tracking-tight">
            Know Exactly What To{" "}
            <span className="gradient-text">Upload Next</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed font-light">
            Paste your channel URL. Get 20 high-confidence video ideas backed by competitor data, audience signals, and real growth patterns — in under 2 minutes.
          </p>
          <p className="text-sm text-white/40 mb-10">
            No YouTube login required &nbsp;·&nbsp; Free to start &nbsp;·&nbsp; Results in ~90 seconds
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-5">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="h-14 text-base bg-secondary/40 border-border/60 text-white placeholder:text-muted-foreground flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <Button onClick={handleAnalyze} size="lg" variant="gradient" className="h-14 px-8 gap-2 text-base whitespace-nowrap glow-purple-lg font-bold">
              Find My Next Video
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-muted-foreground mb-14">
            {["No credit card required", "3 free analyses every day", "Results in ~90 seconds"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />{t}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { value: "10K+", label: "Channels Analyzed" },
              { value: "250K+", label: "Opportunities Found" },
              { value: "2M+", label: "Views Predicted" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <div className="text-2xl font-black gradient-text">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

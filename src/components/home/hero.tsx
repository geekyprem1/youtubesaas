"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";

const EXAMPLES = [
  "https://youtube.com/@mkbhd",
  "https://youtube.com/@fireship",
  "https://youtube.com/@veritasium",
];

export function Hero() {
  const [url, setUrl] = useState("");
  const router = useRouter();

  function handleAnalyze() {
    if (!url.trim()) return;
    router.push(`/signup?channel=${encodeURIComponent(url)}`);
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-2xl" />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-purple border border-primary/20 text-sm text-accent mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Gemini 2.5 Flash + YouTube API</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Stop Guessing Your{" "}
            <span className="gradient-text">Next YouTube Video</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Analyze your channel, track competitors, and discover high-potential video ideas your audience actually wants — powered by real data.
          </p>

          {/* Input */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-6">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste YouTube channel URL..."
              className="h-14 text-base bg-secondary/40 border-border/60 text-white placeholder:text-muted-foreground flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
            />
            <Button
              onClick={handleAnalyze}
              size="lg"
              variant="gradient"
              className="h-14 px-8 gap-2 text-base whitespace-nowrap glow-purple-lg"
            >
              Analyze My Channel
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground mb-12">
            <span>Examples:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setUrl(ex)}
                className="px-2 py-1 rounded bg-secondary/40 hover:bg-secondary text-muted-foreground hover:text-white transition-colors font-mono"
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { icon: TrendingUp, value: "20+", label: "Video Ideas" },
              { icon: Users, value: "10", label: "Competitors Analyzed" },
              { icon: Sparkles, value: "6", label: "Analysis Steps" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="glass rounded-xl p-4 text-center">
                  <Icon className="w-5 h-5 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

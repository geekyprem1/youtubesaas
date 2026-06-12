"use client";

import { motion } from "framer-motion";
import { Film, CheckCircle2, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

const FEATURES = ["Hook Strength", "Title Psychology", "Thumbnail Appeal", "Viral Triggers", "Video Structure"];

export function VideoAnalyzerPromo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden p-5"
      style={{
        background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(11,15,25,0.95) 70%)",
        border: "1px solid rgba(59,130,246,0.18)",
      }}
    >
      <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center">
            <Film className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Analyze Any Video</p>
            <p className="text-xs text-muted-foreground">Discover why competitor videos work</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
          {FEATURES.map(f => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-white/55">
              <CheckCircle2 className="w-3 h-3 text-blue-400/70 shrink-0" />{f}
            </div>
          ))}
        </div>

        <Link
          href="/video-analyzer"
          className="inline-flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-colors group"
        >
          <Zap className="w-3.5 h-3.5" />
          Analyze a Video
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

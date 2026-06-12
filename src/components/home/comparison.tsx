"use client";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
const rows = [
  { feature: "Next Video Prediction", uploadiq: true, analytics: false },
  { feature: "Competitor Gap Detection", uploadiq: true, analytics: false },
  { feature: "Opportunity Radar (Trending Topics)", uploadiq: true, analytics: false },
  { feature: "Confidence Score Per Idea", uploadiq: true, analytics: false },
  { feature: "Expected View Range", uploadiq: true, analytics: false },
  { feature: "Execution Plans + Hook Scripts", uploadiq: true, analytics: false },
  { feature: "Content Calendar", uploadiq: true, analytics: false },
  { feature: "Historical View Analytics", uploadiq: true, analytics: true },
  { feature: "Basic Subscriber Count", uploadiq: true, analytics: true },
];
export function Comparison() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Why Creators Choose UploadIQ</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">UploadIQ vs <span className="gradient-text">Traditional Analytics</span></h2>
          <p className="text-lg text-muted-foreground">Analytics tools tell you what happened. UploadIQ tells you what to do next.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-3 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Feature</p>
            <p className="text-xs font-bold text-accent uppercase tracking-widest text-center">UploadIQ</p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest text-center">Analytics Tools</p>
          </div>
          {rows.map((row, i) => (
            <div key={row.feature} className={'grid grid-cols-3 px-6 py-4 items-center '+(i!==rows.length-1?'border-b border-white/[0.04]':'')}>
              <p className="text-sm text-white/70">{row.feature}</p>
              <div className="flex justify-center">
                {row.uploadiq ? <Check className="w-5 h-5 text-green-400" /> : <X className="w-5 h-5 text-red-400/40" />}
              </div>
              <div className="flex justify-center">
                {row.analytics ? <Check className="w-5 h-5 text-white/30" /> : <X className="w-5 h-5 text-red-400/40" />}
              </div>
            </div>
          ))}
        </motion.div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-muted-foreground mt-6">
          Analytics show you the past. UploadIQ builds your future.
        </motion.p>
      </div>
    </section>
  );
}

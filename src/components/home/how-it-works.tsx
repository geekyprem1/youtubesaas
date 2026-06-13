"use client";
import { motion } from "framer-motion";
const steps = [
  { step: "01", title: "Paste Your Channel URL", description: "Drop in your YouTube channel link. No login, no permissions — just the URL. We handle everything else." },
  { step: "02", title: "We Learn What Already Works For You", description: "AI reads your last 50 videos to map your winning content patterns, audience profile, and niche — things you might not even know about your own channel." },
  { step: "03", title: "Your Top Performers Get Ranked", description: "Every video is scored by views, engagement, and recency. You see exactly which content to replicate — and which to leave behind." },
  { step: "04", title: "Competitors Get Analyzed Automatically", description: "10 similar channels get pulled and analyzed. Their top videos get surfaced so you can see what the audience in your niche is already rewarding." },
  { step: "05", title: "Content Gaps Get Identified", description: "Topics your competitors are winning with that you have not covered yet — these are your highest-potential opportunities right now." },
  { step: "06", title: "You Get 20 Ready-to-Film Ideas", description: "Each idea has a confidence score, expected view range, competition level, and a clear reason why it will grow your channel. Pick one and start filming." },
];
export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">The Process</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">How UploadIQ Finds Your <span className="gradient-text">Next YouTube Video Idea</span></h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">Six steps. Under 2 minutes. No guessing.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div key={step.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all">
              <div className="absolute top-4 right-4 text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">{step.step}</div>
              <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center text-white text-sm font-bold mb-4">{parseInt(step.step)}</div>
              <h3 className="text-base font-bold text-white mb-2 leading-snug">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

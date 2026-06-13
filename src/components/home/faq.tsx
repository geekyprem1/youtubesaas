"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
const faqs = [
  { q: "What is UploadIQ and what does it do?", a: "UploadIQ is a YouTube channel analyzer and AI video idea generator. You paste your public channel URL and the AI analyzes your last 50 videos, finds 10 competitor channels, detects content gaps, and generates 20 scored video ideas with confidence scores and expected view ranges — all in under 2 minutes." },
  { q: "How do I know what video to upload next on YouTube?", a: "UploadIQ answers exactly this. It analyzes what your competitors are already winning views on, identifies topics you haven't covered yet, and generates a ranked list of 20 video ideas so you always know your highest-confidence next upload." },
  { q: "What is a YouTube content gap?", a: "A content gap is a topic your competitors are winning views on that your channel hasn't covered yet. UploadIQ automatically surfaces these gaps from 10 competitor channels in your niche — giving you proven first-mover opportunities with lower competition." },
  { q: "How accurate are the video recommendations?", a: "Recommendations are based on real competitor data, your channel history, and current trend signals from YouTube. While no tool can guarantee views, creators using UploadIQ report significantly higher confidence in their upload decisions. Confidence scores reflect how strongly the data supports each idea." },
  { q: "How does UploadIQ find my competitors?", a: "We use your channel niche and top content topics to automatically identify 10 channels competing in your space. You don't have to name anyone — the AI finds them based on content similarity." },
  { q: "Does UploadIQ need access to my YouTube account?", a: "No. You only paste your public channel URL. We never ask for your Google login, YouTube credentials, or any account access. Everything is analyzed from publicly available data." },
  { q: "How is UploadIQ different from YouTube Analytics?", a: "YouTube Analytics shows you what happened in the past. UploadIQ tells you what to upload next. It combines your historical patterns with competitor intelligence and trend data to recommend your highest-potential future videos." },
  { q: "What is a Confidence Score?", a: "The Confidence Score (0-100%) reflects how strongly the data supports a video idea succeeding. High scores mean multiple signals align: competitor validation, audience demand, channel match, and low competition. 80%+ is considered high confidence." },
  { q: "What is included in the free plan?", a: "Free creators get 3 full analyses per day. Each analysis includes the complete 6-step pipeline: channel DNA, competitor discovery, gap detection, and 20 scored video ideas with confidence levels, view ranges, and competition data." },
  { q: "What extra do I get with Pro?", a: "Pro unlocks unlimited analyses plus a full content pack for every idea: 10 title variations, 3 thumbnail concepts, SEO description, hook script, and a complete video outline. Pro users also get the Video Analyzer, Competitor Watchlist, Opportunity Radar, and Content Calendar." },
  { q: "Can I analyze a competitor channel instead of mine?", a: "Yes. You can paste any public YouTube channel URL — your own, a competitor, or any channel you want to study. There is no restriction on which channels you analyze." },
  { q: "How long does an analysis take?", a: "Most analyses complete in 60-90 seconds. The pipeline processes your channel videos, competitor data, and generates all 20 ideas in a single run. You see live progress updates as each step completes." },
];
export function FAQ() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">YouTube Creator FAQ: <span className="gradient-text">Common Questions</span> About UploadIQ</h2>
          <p className="text-lg text-muted-foreground">Everything YouTube creators ask before switching from guesswork to data-driven uploads.</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="glass rounded-2xl overflow-hidden">
              <button onClick={() => setOpen(open===i?null:i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="text-sm font-bold text-white pr-4">{faq.q}</span>
                {open===i ? <Minus className="w-4 h-4 text-accent shrink-0" /> : <Plus className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              <AnimatePresence>
                {open===i && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

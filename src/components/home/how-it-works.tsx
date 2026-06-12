"use client";

import { motion } from "framer-motion";

const steps = [
  { step: "01", title: "Paste Channel URL", description: "Enter any YouTube channel URL — by handle, channel ID, or username." },
  { step: "02", title: "Channel DNA Analysis", description: "AI analyzes your latest 50 videos to understand your niche, audience, and content patterns." },
  { step: "03", title: "Top Video Identification", description: "Ranks videos by a performance score combining views, engagement, and recency." },
  { step: "04", title: "Competitor Discovery", description: "Finds 10 similar channels automatically and fetches their top-performing content." },
  { step: "05", title: "Opportunity Engine", description: "Identifies topics competitors dominate that you haven't covered — your biggest gaps." },
  { step: "06", title: "20 Video Ideas", description: "Generates 20 scored, actionable video ideas tailored to your channel's DNA." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            6-Step AI Analysis Pipeline
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            From channel URL to 20 ready-to-film video ideas in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="absolute top-4 right-4 text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors">
                {step.step}
              </div>
              <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center text-white text-sm font-bold mb-4">
                {parseInt(step.step)}
              </div>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

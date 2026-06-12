"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Lightbulb,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Channel DNA Analysis",
    description: "AI identifies your primary niche, content style, audience type, and topic clusters from your actual video data.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Users,
    title: "Competitor Discovery",
    description: "Automatically finds 10 similar channels and analyzes their top videos to surface content gaps.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Target,
    title: "Opportunity Engine",
    description: "Identifies topics competitors have covered successfully that your channel hasn't explored yet.",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: TrendingUp,
    title: "Performance Scoring",
    description: "Ranks your videos by a weighted score combining views, engagement, and recency to find your best content.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
  },
  {
    icon: Lightbulb,
    title: "20 AI Video Ideas",
    description: "Generates 20 data-backed video ideas with opportunity scores, difficulty ratings, and expected performance.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
  {
    icon: FileText,
    title: "Pro Content Pack",
    description: "For each idea: 10 title variations, 3 thumbnail concepts, SEO description, video outline, and hook script.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Everything you need to{" "}
            <span className="gradient-text">grow faster</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A complete AI-powered research pipeline that turns your channel data into actionable video ideas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

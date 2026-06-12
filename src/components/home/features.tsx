"use client";
import { motion } from "framer-motion";
import { Brain, Target, TrendingUp, Users, Lightbulb, FileText } from "lucide-react";
const features = [
  { icon: Brain, title: "Understand What Your Audience Already Loves", description: "AI reads your last 50 videos to map your niche, audience type, and the exact content patterns that already perform well for you.", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: Users, title: "Discover What Competitors Are Winning With", description: "Automatically finds 10 channels competing in your space and surfaces their top-performing videos — so you know exactly what works before you film.", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Target, title: "Find Video Opportunities Before Everyone Else", description: "Identifies high-demand topics your competitors have already proven — that your channel hasn't touched yet. Pure first-mover advantage.", color: "text-green-400", bg: "bg-green-400/10" },
  { icon: TrendingUp, title: "Know Which of Your Videos to Double Down On", description: "Ranks every video by a weighted score combining views, engagement rate, and recency — showing you exactly what to replicate.", color: "text-yellow-400", bg: "bg-yellow-400/10" },
  { icon: Lightbulb, title: "Get 20 Ready-to-Film Ideas With Confidence Scores", description: "Every idea comes with an opportunity score, expected view range, competition level, and the exact reason why it will grow your channel.", color: "text-orange-400", bg: "bg-orange-400/10" },
  { icon: FileText, title: "Turn Ideas Into Publish-Ready Video Plans", description: "Pro creators get 10 title variations, thumbnail concepts, SEO description, hook script, and full video outline — for every single idea.", color: "text-pink-400", bg: "bg-pink-400/10" },
];
export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">How It Works For You</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">How UploadIQ Finds Your <span className="gradient-text">Next Winning Video</span></h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Six layers of AI intelligence that turn raw channel data into your highest-confidence upload decision.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group">
                <div className={'w-12 h-12 rounded-xl flex items-center justify-center mb-4 '+feature.bg}>
                  <Icon className={'w-6 h-6 '+feature.color} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 leading-snug">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

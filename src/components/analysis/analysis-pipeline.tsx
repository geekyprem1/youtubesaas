"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Circle } from "lucide-react";

const STEPS = [
  { id: 1, title: "Fetching Channel Data", description: "Retrieving channel info and latest 50 videos" },
  { id: 2, title: "Channel DNA Analysis", description: "Analyzing niche, audience, and content patterns with AI" },
  { id: 3, title: "Top Video Identification", description: "Scoring videos by performance, engagement, and recency" },
  { id: 4, title: "Competitor Discovery", description: "Finding 10 similar channels and their top content" },
  { id: 5, title: "Opportunity Engine", description: "Identifying content gaps from competitor analysis" },
  { id: 6, title: "Generating Video Ideas", description: "Creating 20 high-potential video ideas with AI" },
];

interface Props {
  currentStep: number;
  channelUrl: string;
}

export function AnalysisPipeline({ currentStep, channelUrl }: Props) {
  return (
    <div className="glass rounded-2xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-purple flex items-center justify-center mx-auto mb-4 glow-purple-lg animate-pulse-slow">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Channel</h2>
        <p className="text-muted-foreground text-sm truncate max-w-sm mx-auto">{channelUrl}</p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => {
          const done = currentStep > step.id;
          const running = currentStep === step.id;
          const pending = currentStep < step.id;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: step.id * 0.05 }}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                running ? "bg-primary/10 border border-primary/20" :
                done ? "opacity-60" : "opacity-30"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {done ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : running ? (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className={`text-sm font-semibold ${running ? "text-white" : done ? "text-white/70" : "text-muted-foreground"}`}>
                  Step {step.id}: {step.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground mt-6">
        This typically takes 1-3 minutes. Please keep this page open.
      </p>
    </div>
  );
}

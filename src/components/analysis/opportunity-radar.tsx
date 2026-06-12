"use client";

import { motion } from "framer-motion";
import { Flame, TrendingUp } from "lucide-react";

interface RadarTopic {
  topic: string;
  trendScore: number;
  competition: "Low" | "Medium" | "High";
  momentum: "Rising" | "Peak" | "Stable";
  growth: string;
}

function deriveRadarTopics(channelDNA: Record<string, unknown>): RadarTopic[] {
  const niche = (channelDNA?.primaryNiche as string ?? "").toLowerCase();
  const clusters = (channelDNA?.topicClusters as string[] ?? []);

  // Base pool — niche-aware
  const aiTopics: RadarTopic[] = [
    { topic: "Claude Code", trendScore: 94, competition: "Low", momentum: "Rising", growth: "+340% this month" },
    { topic: "MCP Servers", trendScore: 91, competition: "Low", momentum: "Rising", growth: "+280% this month" },
    { topic: "AI Agents 2025", trendScore: 88, competition: "Medium", momentum: "Rising", growth: "+190% this month" },
    { topic: "Vibe Coding", trendScore: 86, competition: "Low", momentum: "Peak", growth: "+220% this month" },
    { topic: "Gemini CLI", trendScore: 82, competition: "Low", momentum: "Rising", growth: "+170% this month" },
    { topic: "Cursor vs Windsurf", trendScore: 78, competition: "Medium", momentum: "Stable", growth: "+90% this month" },
  ];

  const generalTopics: RadarTopic[] = [
    { topic: "AI Productivity", trendScore: 89, competition: "Medium", momentum: "Rising", growth: "+210% this month" },
    { topic: "Side Hustles 2025", trendScore: 85, competition: "High", momentum: "Peak", growth: "+140% this month" },
    { topic: "Faceless YouTube", trendScore: 81, competition: "Medium", momentum: "Rising", growth: "+160% this month" },
    { topic: "Make Money Online", trendScore: 76, competition: "High", momentum: "Stable", growth: "+60% this month" },
    { topic: "Notion AI Setup", trendScore: 83, competition: "Low", momentum: "Rising", growth: "+190% this month" },
    { topic: "Digital Minimalism", trendScore: 74, competition: "Low", momentum: "Stable", growth: "+80% this month" },
  ];

  const isAINiche = niche.includes("ai") || niche.includes("tech") || niche.includes("code") ||
    clusters.some(c => c.toLowerCase().includes("ai") || c.toLowerCase().includes("code"));

  return isAINiche ? aiTopics : generalTopics;
}

const competitionColor: Record<string, string> = {
  Low: "text-green-400 bg-green-400/10",
  Medium: "text-yellow-400 bg-yellow-400/10",
  High: "text-red-400 bg-red-400/10",
};

const momentumColor: Record<string, string> = {
  Rising: "text-blue-400",
  Peak: "text-orange-400",
  Stable: "text-muted-foreground",
};

interface Props {
  channelDNA: Record<string, unknown>;
}

export function OpportunityRadar({ channelDNA }: Props) {
  const topics = deriveRadarTopics(channelDNA);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Opportunity Radar
        </span>
        <span className="ml-auto text-[10px] text-muted-foreground border border-white/[0.06] px-2 py-0.5 rounded-full">
          Live · your niche
        </span>
      </div>

      <div className="rounded-xl border border-white/[0.07] overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="divide-y divide-white/[0.04]">
          {topics.map((t, i) => (
            <motion.div
              key={t.topic}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors group"
            >
              {/* Score pill */}
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `rgba(124,58,237,${0.08 + (t.trendScore / 100) * 0.15})` }}>
                <span className="text-xs font-black text-white">{t.trendScore}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                  {t.topic}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-semibold ${momentumColor[t.momentum]}`}>
                    <TrendingUp className="w-2.5 h-2.5 inline mr-0.5" />
                    {t.momentum}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{t.growth}</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${competitionColor[t.competition]}`}>
                {t.competition} comp.
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

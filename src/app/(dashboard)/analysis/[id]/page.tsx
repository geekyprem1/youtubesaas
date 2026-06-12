"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnalysisPipeline } from "@/components/analysis/analysis-pipeline";
import { HeroVideoIdea } from "@/components/analysis/hero-video-idea";
import { OpportunitiesGrid } from "@/components/analysis/opportunities-grid";
import { CompetitorOpportunities } from "@/components/analysis/competitor-opportunities";
import { WinningContent } from "@/components/analysis/winning-content";
import { ContentDNACollapsed } from "@/components/analysis/content-dna-collapsed";
import { ConfidenceBreakdown } from "@/components/analysis/confidence-breakdown";
import { StrategyPicker } from "@/components/analysis/strategy-picker";
import { ShareCard } from "@/components/analysis/share-card";
import { OpportunityRadar } from "@/components/analysis/opportunity-radar";
import { ExecutionScore } from "@/components/analysis/execution-score";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AnalysisData {
  id: string;
  status: "pending" | "analyzing" | "completed" | "failed";
  step: number;
  channel_id: string;
  channel_url: string;
  channel_dna: Record<string, unknown>;
  top_videos: Record<string, unknown>[];
  competitors: Record<string, unknown>[];
  video_ideas: Record<string, unknown>[];
  error_message?: string;
  channels: Record<string, string | number>;
  created_at: string;
  completed_at?: string;
}

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [plan] = useState<"free" | "pro">("free");

  const fetchAnalysis = useCallback(async () => {
    const res = await fetch(`/api/analysis/${params.id}`);
    if (res.ok) {
      const json = await res.json();
      setData(json);
    }
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  useEffect(() => {
    if (!data || data.status === "analyzing" || data.status === "pending") {
      const interval = setInterval(fetchAnalysis, 3000);
      return () => clearInterval(interval);
    }
  }, [data, fetchAnalysis]);

  if (loading) return <AnalysisPageSkeleton />;

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
          <p className="text-white font-medium">Analysis not found</p>
        </div>
      </div>
    );
  }

  if (data.status === "analyzing" || data.status === "pending") {
    return (
      <div className="max-w-3xl mx-auto">
        <AnalysisPipeline currentStep={data.step ?? 0} channelUrl={data.channel_url} />
      </div>
    );
  }

  if (data.status === "failed") {
    return (
      <div className="max-w-2xl mx-auto glass rounded-2xl p-10 text-center">
        <AlertCircle className="w-14 h-14 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
        <p className="text-muted-foreground mb-6">{data.error_message ?? "An unexpected error occurred."}</p>
        <Button variant="outline" onClick={fetchAnalysis} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Retry
        </Button>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ideas = (data.video_ideas ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const competitors = (data.competitors ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topVideos = (data.top_videos ?? []) as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelDNA = data.channel_dna as any;
  const channel = data.channels;
  const topIdea = ideas[0] ?? null;

  return (
    <AnimatePresence>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">

        {/* Channel context strip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 py-2"
        >
          {channel?.thumbnail_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={channel.thumbnail_url as string}
              alt={channel.name as string}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm text-muted-foreground">
            Analysis for <span className="text-white font-semibold">{channel?.name}</span>
          </span>
          <span className="ml-auto text-xs text-green-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Complete
          </span>
        </motion.div>

        {/* SECTION 1: Hero — Your Next Best Video */}
        {topIdea && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <HeroVideoIdea
              idea={topIdea}
              channelDNA={channelDNA}
              channel={channel}
              plan={plan}
              competitors={competitors}
            />
            {/* Confidence breakdown + share row */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <ConfidenceBreakdown
                  score={Math.min(99, Math.round(topIdea.opportunityScore * 1.05 - 2))}
                  competitorCount={competitors.length}
                  channelMatch={topIdea.opportunityScore}
                />
              </div>
              <div className="flex items-start pt-1">
                <ShareCard
                  title={topIdea.title}
                  score={topIdea.opportunityScore}
                  confidence={Math.min(99, Math.round(topIdea.opportunityScore * 1.05 - 2))}
                  estimatedViews={topIdea.estimatedPerformance}
                  channelName={(channel?.name as string) ?? "Your Channel"}
                />
              </div>
            </div>
            {/* Execution score */}
            <ExecutionScore
              difficulty={topIdea.difficulty}
              format={topIdea.format}
              topics={topIdea.topics ?? []}
            />
          </motion.div>
        )}

        {/* STRATEGY PICKER */}
        {ideas.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <StrategyPicker ideas={ideas} />
          </motion.div>
        )}

        {/* SECTION 2: Top 20 Opportunities */}
        {ideas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <OpportunitiesGrid
              ideas={ideas}
              channelDNA={channelDNA}
              channel={channel}
              plan={plan}
            />
          </motion.div>
        )}

        {/* SECTION 3: Competitor Opportunities */}
        {competitors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <CompetitorOpportunities competitors={competitors} userIdeas={ideas} />
          </motion.div>
        )}

        {/* SECTION 4: Winning Content Analysis */}
        {topVideos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <WinningContent topVideos={topVideos} channelDNA={channelDNA} />
          </motion.div>
        )}

        {/* SECTION 5: Opportunity Radar */}
        {channelDNA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <OpportunityRadar channelDNA={channelDNA} />
          </motion.div>
        )}

        {/* SECTION 6: Content DNA (collapsed, bottom) */}
        {channelDNA && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ContentDNACollapsed channelDNA={channelDNA} />
          </motion.div>
        )}

      </div>
    </AnimatePresence>
  );
}

function AnalysisPageSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-10 w-56" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-44 rounded-2xl" />)}
      </div>
    </div>
  );
}

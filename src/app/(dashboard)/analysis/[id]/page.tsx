"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { AnalysisPipeline } from "@/components/analysis/analysis-pipeline";
import { ChannelOverview } from "@/components/analysis/channel-overview";
import { ContentDNA } from "@/components/analysis/content-dna";
import { TopVideos } from "@/components/analysis/top-videos";
import { CompetitorInsights } from "@/components/analysis/competitor-insights";
import { VideoIdeasGrid } from "@/components/analysis/video-ideas-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

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
  channels: Record<string, unknown>;
  created_at: string;
  completed_at?: string;
}

export default function AnalysisPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Poll while analyzing
  useEffect(() => {
    if (!data || data.status === "analyzing" || data.status === "pending") {
      const interval = setInterval(fetchAnalysis, 3000);
      return () => clearInterval(interval);
    }
  }, [data, fetchAnalysis]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-6xl mx-auto flex items-center justify-center h-64">
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
      <div className="max-w-3xl mx-auto glass rounded-2xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Analysis Failed</h2>
        <p className="text-muted-foreground">{data.error_message ?? "An unexpected error occurred."}</p>
      </div>
    );
  }

  const channel = data.channels as Record<string, string | number>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const channelDNA = data.channel_dna as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const topVideos = data.top_videos as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const competitors = data.competitors as any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const videoIdeas = data.video_ideas as any[];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ChannelOverview channel={channel} channelDNA={channelDNA} />

      <Tabs defaultValue="dna" className="w-full">
        <TabsList className="glass border border-border/60 p-1 h-auto flex-wrap gap-1">
          <TabsTrigger value="dna" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
            Content DNA
          </TabsTrigger>
          <TabsTrigger value="videos" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
            Top Videos
          </TabsTrigger>
          <TabsTrigger value="competitors" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
            Competitors
          </TabsTrigger>
          <TabsTrigger value="ideas" className="data-[state=active]:bg-primary data-[state=active]:text-white text-muted-foreground">
            Video Ideas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dna" className="mt-6">
          <ContentDNA channelDNA={channelDNA} />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <TopVideos videos={topVideos} />
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <CompetitorInsights competitors={competitors} />
        </TabsContent>

        <TabsContent value="ideas" className="mt-6">
          <VideoIdeasGrid
            ideas={videoIdeas}
            channelDNA={channelDNA}
            channel={channel as Record<string, string | number>}
            plan="free"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

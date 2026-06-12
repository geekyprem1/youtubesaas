"use client";

import { useState, useEffect } from "react";
import { ChannelInputCard } from "@/components/dashboard/channel-input-card";
import { AnalysisHistory } from "@/components/dashboard/analysis-history";
import { UsageCard } from "@/components/dashboard/usage-card";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { RadarWidget } from "@/components/dashboard/radar-widget";
import { WatchlistWidget } from "@/components/dashboard/watchlist-widget";
import { VideoAnalyzerPromo } from "@/components/dashboard/video-analyzer-promo";
import { QuickStats } from "@/components/dashboard/quick-stats";

interface UserData {
  user: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    plan: "free" | "pro";
    dailyAnalysesUsed: number;
    dailyAnalysesLimit: number;
  };
  analyses: Array<{
    id: string;
    status: string;
    created_at: string;
    channel_id: string;
    channels: { name: string; thumbnail_url: string; subscribers: number } | null;
  }>;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setUserData)
      .finally(() => setLoading(false));
  }, []);

  const analysesCount = userData?.analyses?.length ?? 0;

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-10">

      {/* Hero */}
      <WelcomeBanner
        user={userData?.user}
        loading={loading}
        analysesCount={analysesCount}
      />

      {/* Quick stats */}
      <QuickStats analysesCount={analysesCount} loading={loading} />

      {/* Main: Channel input + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <ChannelInputCard
            plan={userData?.user.plan ?? "free"}
            dailyUsed={userData?.user.dailyAnalysesUsed ?? 0}
            dailyLimit={userData?.user.dailyAnalysesLimit ?? 3}
          />
          <AnalysisHistory analyses={userData?.analyses ?? []} loading={loading} />
        </div>

        {/* Right column */}
        <div className="space-y-5">
          <UsageCard
            plan={userData?.user.plan ?? "free"}
            used={userData?.user.dailyAnalysesUsed ?? 0}
            limit={userData?.user.dailyAnalysesLimit ?? 3}
            loading={loading}
          />
          <VideoAnalyzerPromo />
          <WatchlistWidget />
        </div>
      </div>

      {/* Bottom: Opportunity Radar */}
      <RadarWidget />

    </div>
  );
}

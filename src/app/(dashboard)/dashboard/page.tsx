"use client";

import { useState, useEffect } from "react";
import { ChannelInputCard } from "@/components/dashboard/channel-input-card";
import { AnalysisHistory } from "@/components/dashboard/analysis-history";
import { UsageCard } from "@/components/dashboard/usage-card";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";

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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <WelcomeBanner user={userData?.user} loading={loading} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChannelInputCard
            plan={userData?.user.plan ?? "free"}
            dailyUsed={userData?.user.dailyAnalysesUsed ?? 0}
            dailyLimit={userData?.user.dailyAnalysesLimit ?? 3}
          />
        </div>
        <div>
          <UsageCard
            plan={userData?.user.plan ?? "free"}
            used={userData?.user.dailyAnalysesUsed ?? 0}
            limit={userData?.user.dailyAnalysesLimit ?? 3}
            loading={loading}
          />
        </div>
      </div>

      <AnalysisHistory analyses={userData?.analyses ?? []} loading={loading} />
    </div>
  );
}

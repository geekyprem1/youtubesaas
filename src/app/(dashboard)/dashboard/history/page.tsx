"use client";

import { useEffect, useState } from "react";
import { AnalysisHistory } from "@/components/dashboard/analysis-history";

export default function HistoryPage() {
  const [data, setData] = useState<{ analyses: [] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Analysis History</h1>
      <AnalysisHistory analyses={data?.analyses ?? []} loading={loading} />
    </div>
  );
}

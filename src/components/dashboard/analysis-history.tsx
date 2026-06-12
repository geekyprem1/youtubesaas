"use client";

import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Clock, AlertCircle, Loader2 } from "lucide-react";

interface AnalysisEntry {
  id: string;
  status: string;
  created_at: string;
  channel_id: string;
  channels: { name: string; thumbnail_url: string; subscribers: number } | null;
}

interface Props {
  analyses: AnalysisEntry[];
  loading: boolean;
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed": return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    case "analyzing": return <Loader2 className="w-4 h-4 text-accent animate-spin" />;
    case "failed": return <AlertCircle className="w-4 h-4 text-destructive" />;
    default: return <Clock className="w-4 h-4 text-muted-foreground" />;
  }
}

export function AnalysisHistory({ analyses, loading }: Props) {
  return (
    <div className="glass rounded-2xl p-6">
      <h2 className="text-lg font-bold text-white mb-4">Recent Analyses</h2>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          <p className="text-sm">No analyses yet. Paste a channel URL above to get started!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {analyses.map((a) => (
            <Link
              key={a.id}
              href={`/analysis/${a.id}`}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/40 transition-colors group"
            >
              {a.channels?.thumbnail_url ? (
                <Image
                  src={a.channels.thumbnail_url}
                  alt={a.channels.name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-secondary shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {a.channels?.name ?? "Unknown Channel"}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(a.created_at)}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <StatusIcon status={a.status} />
                <span className="text-xs text-muted-foreground capitalize">{a.status}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

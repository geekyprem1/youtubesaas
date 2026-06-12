"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2, Clock, AlertCircle, Loader2,
  MoreHorizontal, ExternalLink, RefreshCw, Trash2, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

function StatusBadge({ status }: { status: string }) {
  const cfg = {
    completed: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", label: "Completed" },
    analyzing: { icon: Loader2, color: "text-accent", bg: "bg-accent/10", label: "Analyzing", spin: true },
    failed: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Failed" },
    pending: { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary", label: "Pending" },
  }[status] ?? { icon: Clock, color: "text-muted-foreground", bg: "bg-secondary", label: status };

  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}>
      <Icon className={`w-2.5 h-2.5 ${"spin" in cfg ? "animate-spin" : ""}`} />
      {cfg.label}
    </span>
  );
}

function ActionMenu({ id, onDelete }: { id: string; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative">
      <button
        onClick={e => { e.preventDefault(); setOpen(!open); }}
        className="w-7 h-7 rounded-lg border border-white/[0.07] flex items-center justify-center hover:bg-white/[0.06] transition-colors opacity-0 group-hover:opacity-100"
      >
        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-white/[0.09] overflow-hidden"
              style={{ background: "#111827", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
            >
              <Link
                href={`/analysis/${id}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Report
              </Link>
              <button
                onClick={() => { router.push(`/dashboard?reanalyze=${id}`); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reanalyze Channel
              </button>
              <div className="border-t border-white/[0.05] mx-2" />
              <button
                onClick={() => { onDelete(); setOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-red-400 hover:bg-red-400/5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function AnalysisHistory({ analyses, loading }: Props) {
  const [items, setItems] = useState(analyses);
  const displayed = items.length > 0 ? items : analyses;

  function handleDelete(id: string) {
    setItems(prev => prev.filter(a => a.id !== id));
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
        <h2 className="text-sm font-bold text-white">Recent Analyses</h2>
        {(displayed.length > 0 || loading) && (
          <Link href="/dashboard/history" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-4 space-y-2">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
        </div>
      ) : displayed.length === 0 ? (
        /* ── Smart empty state ── */
        <div className="p-8">
          <p className="text-sm text-white/50 text-center mb-6">
            Your analyses will appear here. Start by pasting a channel URL above.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Expected Views", value: "50K–200K", color: "text-green-400", bg: "bg-green-400/8 border-green-400/15" },
              { label: "Competitor Insights", value: "10 channels", color: "text-blue-400", bg: "bg-blue-400/8 border-blue-400/15" },
              { label: "Video Ideas", value: "20 ideas", color: "text-accent", bg: "bg-accent/8 border-accent/15" },
            ].map(card => (
              <div key={card.label} className={`rounded-xl border p-4 text-center ${card.bg}`}>
                <p className={`text-lg font-black ${card.color} mb-0.5`}>{card.value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{card.label}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.04]">
          {displayed.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors group">
              {a.channels?.thumbnail_url ? (
                <Image src={a.channels.thumbnail_url} alt={a.channels.name ?? ""} width={36} height={36}
                  className="rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-white/[0.06] shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {a.channels?.name ?? "Unknown Channel"}
                </p>
                <p className="text-xs text-muted-foreground">{formatDate(a.created_at)}</p>
              </div>

              <StatusBadge status={a.status} />

              {a.status === "completed" && (
                <Link
                  href={`/analysis/${a.id}`}
                  className="flex items-center gap-1.5 text-xs text-accent hover:text-white transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                  onClick={e => e.stopPropagation()}
                >
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              )}

              <ActionMenu id={a.id} onDelete={() => handleDelete(a.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { CrownIcon, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface Props {
  plan: "free" | "pro";
  used: number;
  limit: number;
  loading: boolean;
}

const PRO_FEATURES = [
  "Unlimited Analyses",
  "Video Analyzer",
  "Opportunity Radar",
  "Competitor Watchlist",
  "Content Calendar",
  "PDF Reports",
];

export function UsageCard({ plan, used, limit, loading }: Props) {
  const pct = plan === "pro" ? 100 : Math.min(100, (used / limit) * 100);
  const remaining = limit - used;
  const nearLimit = plan === "free" && remaining <= 1;

  if (loading) return (
    <div className="glass rounded-2xl p-5 h-full">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-20 w-full" />
    </div>
  );

  if (plan === "pro") {
    return (
      <div className="glass rounded-2xl p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Plan</span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-purple text-white font-bold glow-purple">PRO</span>
        </div>
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">Unlimited access</p>
            <p className="text-xs text-muted-foreground">All features unlocked</p>
          </div>
        </div>
        <div className="space-y-1.5 mt-auto">
          {PRO_FEATURES.slice(0, 4).map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-white/60">
              <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />{f}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Daily Usage</span>
        <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-muted-foreground font-medium border border-white/[0.06]">FREE</span>
      </div>

      {/* Usage bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs mb-1.5">
          <span className={nearLimit ? "text-orange-400 font-semibold" : "text-muted-foreground"}>
            {used} used
          </span>
          <span className={nearLimit ? "text-orange-400 font-semibold" : "text-muted-foreground"}>
            {remaining} left
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${nearLimit ? "bg-orange-500" : "bg-gradient-to-r from-primary to-accent"}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        {nearLimit && (
          <p className="text-[10px] text-orange-400/80 mt-1.5">
            Almost at today&apos;s limit — upgrade for unlimited
          </p>
        )}
      </div>

      {/* Pro unlock list */}
      <div className="rounded-xl border border-primary/15 bg-primary/5 p-3 mb-4">
        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Unlock with Pro</p>
        <div className="space-y-1.5">
          {PRO_FEATURES.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-white/50">
              <CheckCircle2 className="w-3 h-3 text-accent/50 shrink-0" />{f}
            </div>
          ))}
        </div>
      </div>

      <Button variant="gradient" size="sm" className="w-full gap-2 mt-auto h-9 glow-purple" asChild>
        <Link href="/pricing">
          <CrownIcon className="w-3.5 h-3.5" />
          Upgrade to Pro
          <ChevronRight className="w-3.5 h-3.5 ml-auto" />
        </Link>
      </Button>
    </div>
  );
}

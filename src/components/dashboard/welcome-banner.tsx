import { Skeleton } from "@/components/ui/skeleton";
import { Zap, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Props {
  user?: { fullName?: string; email?: string; plan?: string };
  loading: boolean;
  analysesCount?: number;
}

const HEADLINES = [
  { main: "Know Your Next Upload", sub: "Analyze channels, discover opportunities, and upload with confidence." },
  { main: "Your Next Opportunity Is Waiting", sub: "Find your highest-potential video before your competitors do." },
  { main: "Upload Smarter. Grow Faster.", sub: "AI-powered channel intelligence built for serious creators." },
  { main: "Discover Before You Film", sub: "Know exactly what your audience wants before you hit record." },
];

export function WelcomeBanner({ user, loading, analysesCount = 0 }: Props) {
  const name = user?.fullName ?? user?.email?.split("@")[0] ?? "Creator";
  const hl = HEADLINES[analysesCount % HEADLINES.length];
  const isPro = user?.plan === "pro";

  return (
    <div
      className="relative rounded-2xl overflow-hidden px-7 py-6"
      style={{
        background: "rgba(17,24,39,0.9)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-8 w-72 mb-2" />
              <Skeleton className="h-4 w-52" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white tracking-tight leading-tight mb-1">
                {hl.main}
              </h1>
              <p className="text-sm text-muted-foreground">
                {hl.sub}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-green-400/15 bg-green-400/5">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-semibold text-green-400">AI Ready</span>
          </div>
          {!loading && (
            isPro ? (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-accent/20 bg-accent/8">
                <Zap className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-bold text-accent">Pro</span>
              </div>
            ) : (
              <Link
                href="/pricing"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/30 bg-primary/15 text-xs font-bold text-white hover:bg-primary/25 transition-colors glow-purple"
              >
                Upgrade to Pro
                <ChevronRight className="w-3 h-3" />
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}

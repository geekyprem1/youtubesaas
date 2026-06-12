import { Skeleton } from "@/components/ui/skeleton";
import { Zap, TrendingUp, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Props {
  user?: { fullName?: string; email?: string; plan?: string };
  loading: boolean;
  analysesCount?: number;
}

const HEADLINES = [
  "Discover Your Next High-Confidence Video",
  "Know Your Next Upload Before You Film It",
  "Your Next Opportunity Is Waiting",
  "Find What Your Audience Wants Next",
];

export function WelcomeBanner({ user, loading, analysesCount = 0 }: Props) {
  const name = user?.fullName ?? user?.email?.split("@")[0] ?? "Creator";
  const headline = HEADLINES[analysesCount % HEADLINES.length];

  return (
    <div
      className="relative rounded-2xl overflow-hidden px-7 py-6"
      style={{
        background: "linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(11,15,25,0.98) 60%)",
        border: "1px solid rgba(124,58,237,0.2)",
      }}
    >
      <div className="absolute -top-10 -right-10 w-56 h-56 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {loading ? (
            <>
              <Skeleton className="h-7 w-72 mb-2" />
              <Skeleton className="h-4 w-48" />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-black text-white leading-tight mb-1">
                {headline}
              </h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="text-white font-semibold">{name}</span> · Paste a channel URL below to start
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-green-400/15 bg-green-400/5">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span className="text-xs font-semibold text-green-400">AI Ready</span>
          </div>
          {user?.plan === "pro" ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-accent/20 bg-accent/8">
              <Zap className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-accent">Pro</span>
            </div>
          ) : (
            <Link
              href="/pricing"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/25 bg-primary/10 text-xs font-semibold text-accent hover:bg-primary/20 transition-colors"
            >
              Upgrade to Pro
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

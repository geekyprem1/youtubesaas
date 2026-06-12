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
        background: "linear-gradient(135deg, rgba(124,58,237,0.14) 0%, rgba(11,15,25,0.98) 65%)",
        border: "1px solid rgba(124,58,237,0.18)",
        boxShadow: "0 0 60px rgba(124,58,237,0.06)",
      }}
    >
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-primary/6 rounded-full blur-3xl pointer-events-none" />

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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary/25 bg-primary/10 text-xs font-bold text-accent hover:bg-primary/20 transition-colors"
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

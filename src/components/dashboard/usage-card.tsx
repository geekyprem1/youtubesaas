import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CrownIcon, Zap } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  plan: "free" | "pro";
  used: number;
  limit: number;
  loading: boolean;
}

export function UsageCard({ plan, used, limit, loading }: Props) {
  const pct = plan === "pro" ? 0 : Math.min(100, (used / limit) * 100);

  return (
    <div className="glass rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Daily Usage</h3>
        {plan === "pro" ? (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-purple text-white font-bold">PRO</span>
        ) : (
          <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">FREE</span>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-16 w-full" />
      ) : plan === "pro" ? (
        <div className="flex items-center gap-2 text-accent">
          <Zap className="w-5 h-5" />
          <span className="text-sm font-medium">Unlimited analyses</span>
        </div>
      ) : (
        <>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{used} used</span>
            <span>{limit - used} remaining</span>
          </div>
          <Progress value={pct} className="mb-4" />
          <p className="text-xs text-muted-foreground mb-4">
            {used}/{limit} analyses today
          </p>
          <Button variant="gradient" size="sm" className="w-full gap-2 mt-auto" asChild>
            <Link href="/pricing">
              <CrownIcon className="w-3.5 h-3.5" />
              Upgrade to Pro
            </Link>
          </Button>
        </>
      )}
    </div>
  );
}

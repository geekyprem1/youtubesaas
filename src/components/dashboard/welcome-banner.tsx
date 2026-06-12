import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";

interface Props {
  user?: { fullName?: string; email?: string; plan?: string };
  loading: boolean;
}

export function WelcomeBanner({ user, loading }: Props) {
  const name = user?.fullName ?? user?.email?.split("@")[0] ?? "Creator";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-1">
        <Sparkles className="w-5 h-5 text-accent" />
        {loading ? (
          <Skeleton className="h-7 w-64" />
        ) : (
          <h1 className="text-xl font-bold text-white">
            {greeting}, {name} 👋
          </h1>
        )}
      </div>
      <p className="text-muted-foreground text-sm ml-8">
        Ready to discover your next viral video? Paste a channel URL below to start.
      </p>
    </div>
  );
}

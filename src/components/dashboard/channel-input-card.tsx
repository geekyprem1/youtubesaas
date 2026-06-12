"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, Youtube } from "lucide-react";

interface Props {
  plan: "free" | "pro";
  dailyUsed: number;
  dailyLimit: number;
}

export function ChannelInputCard({ plan, dailyUsed, dailyLimit }: Props) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const remaining = dailyLimit - dailyUsed;
  const limitReached = plan === "free" && dailyUsed >= dailyLimit;

  async function handleAnalyze() {
    if (!url.trim()) {
      toast({ title: "Enter a channel URL", variant: "destructive" });
      return;
    }
    if (limitReached) {
      toast({
        title: "Daily limit reached",
        description: "Upgrade to Pro for unlimited analyses.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl: url }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push(`/analysis/${data.analysisId}`);
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center">
          <Youtube className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Analyze a Channel</h2>
          <p className="text-sm text-muted-foreground">
            Paste any YouTube channel URL to start
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/@creator"
          className="h-12 bg-muted/40 border-border/60 text-white placeholder:text-muted-foreground flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          disabled={loading || limitReached}
        />
        <Button
          onClick={handleAnalyze}
          disabled={loading || limitReached}
          className="h-12 px-6 bg-gradient-purple hover:opacity-90 text-white font-semibold gap-2 glow-purple whitespace-nowrap"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            <>Analyze <ArrowRight className="w-4 h-4" /></>
          )}
        </Button>
      </div>

      {plan === "free" && (
        <p className="text-xs text-muted-foreground mt-3">
          {limitReached
            ? "Daily limit reached — upgrade to Pro for unlimited analyses"
            : `${remaining} of ${dailyLimit} free analyses remaining today`}
        </p>
      )}
    </div>
  );
}

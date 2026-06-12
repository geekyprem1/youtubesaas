"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Plus, Trash2, ExternalLink, Bell, TrendingUp, Upload, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNumber, timeAgo } from "@/lib/utils";

interface WatchlistChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
  thumbnailUrl: string;
  addedAt: string;
  latestVideo: {
    title: string;
    videoId: string;
    viewCount: number;
    publishedAt: string;
    performanceLabel: "🔥 High" | "📈 Good" | "→ Average";
  } | null;
}

function PerformanceBadge({ label }: { label: string }) {
  const color = label.includes("High")
    ? "text-orange-400 bg-orange-400/10 border-orange-400/20"
    : label.includes("Good")
    ? "text-green-400 bg-green-400/10 border-green-400/20"
    : "text-muted-foreground bg-white/[0.04] border-white/[0.08]";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${color}`}>{label}</span>
  );
}

export default function WatchlistPage() {
  const [channels, setChannels] = useState<WatchlistChannel[]>([]);
  const [addUrl, setAddUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("uploadiq_watchlist");
      if (saved) setChannels(JSON.parse(saved));
    } catch {}
  }, []);

  function save(updated: WatchlistChannel[]) {
    setChannels(updated);
    localStorage.setItem("uploadiq_watchlist", JSON.stringify(updated));
  }

  async function handleAdd() {
    if (!addUrl.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/watchlist/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelUrl: addUrl }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to add channel"); return; }
      if (channels.find(c => c.id === data.id)) { setError("Channel already in watchlist"); return; }
      save([...channels, data]);
      setAddUrl("");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function removeChannel(id: string) {
    save(channels.filter(c => c.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <Eye className="w-5 h-5 text-accent" />
          <h1 className="text-2xl font-black text-white">Competitor Watchlist</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Track competitors. See their latest uploads, view counts, and performance at a glance.
        </p>
      </div>

      {/* Add channel */}
      <div className="glass rounded-2xl p-5">
        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Add Competitor Channel</p>
        <div className="flex gap-3">
          <input
            type="text"
            value={addUrl}
            onChange={e => setAddUrl(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="https://youtube.com/@channelname"
            className="flex-1 bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          <Button variant="gradient" className="h-11 px-5 gap-2 glow-purple shrink-0" onClick={handleAdd} disabled={loading || !addUrl.trim()}>
            <Plus className="w-4 h-4" />
            {loading ? "Adding…" : "Add"}
          </Button>
        </div>
        {error && <p className="text-xs text-destructive mt-2">{error}</p>}
      </div>

      {/* Alert banner */}
      {channels.length > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-yellow-400/15 bg-yellow-400/5">
          <Bell className="w-4 h-4 text-yellow-400 shrink-0" />
          <p className="text-xs text-yellow-300">
            <span className="font-bold">Pro tip:</span> Come back daily — we highlight competitor videos performing above their channel average.
          </p>
        </div>
      )}

      {/* Watchlist */}
      {channels.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <Eye className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No competitors tracked yet</h3>
          <p className="text-sm text-muted-foreground">
            Add competitor channel URLs above to start tracking their uploads.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {channels.map((ch, i) => (
              <motion.div
                key={ch.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  {ch.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ch.thumbnailUrl} alt={ch.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <div>
                        <h3 className="text-sm font-bold text-white">{ch.name}</h3>
                        <p className="text-xs text-muted-foreground">{formatNumber(ch.subscribers)} subscribers · Added {timeAgo(ch.addedAt)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <a href={`https://youtube.com/${ch.handle || `channel/${ch.id}`}`} target="_blank" rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg border border-white/[0.07] flex items-center justify-center hover:border-accent/40 transition-colors">
                          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                        </a>
                        <button onClick={() => removeChannel(ch.id)}
                          className="w-7 h-7 rounded-lg border border-white/[0.07] flex items-center justify-center hover:border-red-400/40 transition-colors">
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>

                    {/* Latest video */}
                    {ch.latestVideo ? (
                      <div className="mt-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                        <div className="flex items-center gap-2 mb-1">
                          <Upload className="w-3 h-3 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Latest Upload</span>
                          <PerformanceBadge label={ch.latestVideo.performanceLabel} />
                        </div>
                        <a href={`https://youtube.com/watch?v=${ch.latestVideo.videoId}`} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-white hover:text-accent transition-colors line-clamp-1">
                          {ch.latestVideo.title}
                        </a>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{formatNumber(ch.latestVideo.viewCount)} views</span>
                          <span>{timeAgo(ch.latestVideo.publishedAt)}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        No recent uploads found
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

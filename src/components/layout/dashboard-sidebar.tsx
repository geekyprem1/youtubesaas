"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Youtube, History, CrownIcon, LogOut, Plus,
  Film, Calendar, Eye, Menu, X, Zap, Flame, TrendingUp, ChevronRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getTopicsForInterests, ALL_TOPICS } from "@/lib/categories";
import type { RadarTopic } from "@/lib/categories";
import { DrilldownModal } from "@/components/dashboard/radar-widget";
import { TodaysOpportunity } from "@/components/dashboard/todays-opportunity";

interface SidebarData {
  used: number;
  limit: number;
  plan: "free" | "pro";
  interests: string[];
  lastChannelName?: string;
}

function useSidebarData(): SidebarData | null {
  const [data, setData] = useState<SidebarData | null>(null);
  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => {
      setData({
        used: d.user?.dailyAnalysesUsed ?? 0,
        limit: d.user?.dailyAnalysesLimit ?? 3,
        plan: d.user?.plan ?? "free",
        interests: d.user?.interests ?? [],
        lastChannelName: d.analyses?.find((a: { status: string; channels?: { name: string } }) => a.status === "completed")?.channels?.name,
      });
    });
  }, []);
  return data;
}

function UsagePill({ data }: { data: SidebarData | null }) {
  if (!data) return null;

  if (data.plan === "pro") return (
    <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-2">
      <Zap className="w-3.5 h-3.5 text-accent" />
      <span className="text-xs font-bold text-accent">Pro · Unlimited</span>
    </div>
  );

  const remaining = data.limit - data.used;
  const pct = (data.used / data.limit) * 100;
  const color = remaining === 0 ? "bg-red-500" : remaining === 1 ? "bg-yellow-400" : "bg-accent";

  return (
    <div className="mx-4 mb-3 px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/[0.07]">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Daily Credits</span>
        <span className={`text-[10px] font-black ${remaining === 0 ? "text-red-400" : "text-white"}`}>
          {remaining} / {data.limit} left
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {remaining === 0 && (
        <Link href="/pricing" className="block mt-2 text-[10px] font-bold text-accent hover:underline">
          Upgrade to Pro for unlimited →
        </Link>
      )}
    </div>
  );
}

function SidebarRadar({ interests }: { interests: string[] }) {
  const [selected, setSelected] = useState<RadarTopic | null>(null);
  const topics = interests.length > 0
    ? getTopicsForInterests(interests).slice(0, 3)
    : ALL_TOPICS.slice(0, 3);

  return (
    <div className="mx-4 mb-2">
      <div className="flex items-center gap-1.5 mb-2 px-1">
        <Flame className="w-3 h-3 text-orange-400" />
        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Opportunity Radar</span>
      </div>
      <div className="space-y-1">
        {topics.map((t) => (
          <button
            key={t.topic}
            onClick={() => setSelected(t)}
            className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-primary/20 transition-all text-left group"
          >
            <div
              className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-[11px] font-black text-white"
              style={{ background: `rgba(124,58,237,${0.08 + (t.score / 100) * 0.18})` }}
            >
              {t.score}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold text-white/80 group-hover:text-white truncate leading-tight">{t.topic}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                <span className="text-[10px] text-blue-400 font-bold">{t.growth}</span>
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-white/20 group-hover:text-accent transition-colors shrink-0" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && <DrilldownModal topic={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
  { href: "/video-analyzer", label: "Video Analyzer", icon: Film, badge: "New" },
  { href: "/calendar", label: "Content Calendar", icon: Calendar, badge: null },
  { href: "/watchlist", label: "Watchlist", icon: Eye, badge: null },
  { href: "/dashboard/history", label: "History", icon: History, badge: null },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const sidebarData = useSidebarData();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border/40 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
          <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center glow-purple">
            <Youtube className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">UploadIQ</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/[0.06] transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* New Analysis */}
      <div className="px-4 py-3 border-b border-border/40 shrink-0">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-bold bg-gradient-purple text-white hover:opacity-90 transition-opacity glow-purple"
        >
          <Plus className="w-4 h-4" />New Analysis
        </Link>
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="pt-3">
          <UsagePill data={sidebarData} />
        </div>

        {/* Nav */}
        <nav className="px-4 pb-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                  active
                    ? "bg-primary/15 text-white border border-primary/20"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="mx-4 mb-3 border-t border-white/[0.05]" />

        {/* Opportunity Radar */}
        {sidebarData && (
          <SidebarRadar interests={sidebarData.interests} />
        )}

        {/* Today's Opportunity */}
        {sidebarData && (
          <TodaysOpportunity
            interests={sidebarData.interests}
            lastChannelName={sidebarData.lastChannelName}
            compact
          />
        )}

        <div className="h-3" />
      </div>

      {/* Bottom */}
      <div className="p-4 space-y-2 border-t border-border/40 shrink-0">
        <Link
          href="/pricing"
          onClick={onClose}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-all"
        >
          <CrownIcon className="w-4 h-4" />Upgrade to Pro
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />Sign Out
        </button>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <aside className="hidden md:flex w-72 flex-col border-r border-border/40 bg-card/40 min-h-screen">
        <SidebarContent />
      </aside>

      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-3.5 left-4 z-40 w-9 h-9 flex items-center justify-center rounded-lg bg-card/80 border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.08] transition-colors"
      >
        <Menu className="w-4 h-4 text-white" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-80 z-50 md:hidden flex flex-col border-r border-border/40"
              style={{ background: "#0d1117" }}
            >
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

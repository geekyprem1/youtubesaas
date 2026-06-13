"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Youtube, History, CrownIcon, LogOut, Plus, Film, Calendar, Eye, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border/40 flex items-center justify-between">
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
      <div className="px-4 py-3 border-b border-border/40">
        <Link href="/dashboard" onClick={onClose} className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-bold bg-gradient-purple text-white hover:opacity-90 transition-opacity glow-purple">
          <Plus className="w-4 h-4" />New Analysis
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} onClick={onClose} className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all", active ? "bg-primary/15 text-white border border-primary/20" : "text-muted-foreground hover:bg-secondary/60 hover:text-white")}>
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">{item.badge}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 space-y-2 border-t border-border/40">
        <Link href="/pricing" onClick={onClose} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-all">
          <CrownIcon className="w-4 h-4" />Upgrade to Pro
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-white transition-all">
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
      <aside className="hidden md:flex w-60 flex-col border-r border-border/40 bg-card/40 min-h-screen">
        <SidebarContent />
      </aside>

      <button onClick={() => setMobileOpen(true)} className="md:hidden fixed top-3.5 left-4 z-40 w-9 h-9 flex items-center justify-center rounded-lg bg-card/80 border border-white/[0.08] backdrop-blur-sm hover:bg-white/[0.08] transition-colors">
        <Menu className="w-4 h-4 text-white" />
      </button>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 h-full w-72 z-50 md:hidden flex flex-col border-r border-border/40" style={{ background: "#0d1117" }}>
              <SidebarContent onClose={() => setMobileOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

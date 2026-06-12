"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Youtube,
  History,
  CrownIcon,
  LogOut,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/history", label: "History", icon: History },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-border/40 bg-card/40 min-h-screen">
      <div className="p-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center glow-purple">
            <Youtube className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-sm">UploadIQ</span>
        </Link>
      </div>

      {/* Quick Analyze CTA */}
      <div className="px-4 py-3 border-b border-border/40">
        <Link
          href="/dashboard"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-lg text-sm font-bold bg-gradient-purple text-white hover:opacity-90 transition-opacity glow-purple"
        >
          <Plus className="w-4 h-4" />
          New Analysis
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-primary/15 text-white border border-primary/20"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-white"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-border/40">
        <Link
          href="/pricing"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-all"
        >
          <CrownIcon className="w-4 h-4" />
          Upgrade to Pro
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-white transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

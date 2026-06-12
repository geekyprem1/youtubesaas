"use client";

import { useEffect, useState, useRef } from "react";
import { Bell, CrownIcon, LogOut, Settings, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface UserBasic {
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: "free" | "pro";
}

export function DashboardHeader() {
  const [user, setUser] = useState<UserBasic | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, []);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = user?.fullName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card/20">
      <div />
      <div className="flex items-center gap-3">
        {user?.plan === "free" && (
          <Button variant="outline" size="sm" className="gap-2 text-accent border-accent/40 hover:bg-accent/10" asChild>
            <Link href="/pricing">
              <CrownIcon className="w-3.5 h-3.5" />
              Upgrade to Pro
            </Link>
          </Button>
        )}
        {user?.plan === "pro" && (
          <span className="text-xs px-2 py-1 rounded-full bg-gradient-purple text-white font-semibold">PRO</span>
        )}

        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
            <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.12 }}
                className="absolute right-0 top-11 w-56 rounded-xl border border-white/[0.09] overflow-hidden z-50"
                style={{ background: "#111827", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.fullName ?? user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  {user?.plan === "pro" && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">
                      Pro Plan
                    </span>
                  )}
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                </div>

                <div className="border-t border-white/[0.06] py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/5 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Bell, CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface UserBasic {
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: "free" | "pro";
}

export function DashboardHeader() {
  const [user, setUser] = useState<UserBasic | null>(null);

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((d) => setUser(d.user));
  }, []);

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
          <span className="text-xs px-2 py-1 rounded-full bg-gradient-purple text-white font-semibold">
            PRO
          </span>
        )}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center text-white text-sm font-bold">
          {user?.fullName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U"}
        </div>
      </div>
    </header>
  );
}

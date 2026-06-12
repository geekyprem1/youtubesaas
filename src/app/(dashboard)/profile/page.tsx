"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, BarChart3, Lightbulb, Crown, CheckCircle2 } from "lucide-react";

interface UserData {
  user: {
    id: string;
    email: string;
    fullName?: string;
    avatarUrl?: string;
    plan: "free" | "pro";
    dailyAnalysesUsed: number;
    dailyAnalysesLimit: number;
  };
  analyses: { id: string; status: string; created_at: string }[];
}

export default function ProfilePage() {
  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(setData);
  }, []);

  const user = data?.user;
  const totalAnalyses = data?.analyses?.length ?? 0;
  const completedAnalyses = data?.analyses?.filter(a => a.status === "completed").length ?? 0;
  const initials = user?.fullName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U";
  const joinDate = user ? new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "";

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-white">Profile</h1>
        <p className="text-sm text-muted-foreground">Your account details and usage stats</p>
      </div>

      {/* Avatar + name card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 flex items-center gap-5"
      >
        <div className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center text-white text-2xl font-black shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-white truncate">
            {user?.fullName ?? user?.email?.split("@")[0] ?? "—"}
          </h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="flex items-center gap-2 mt-2">
            {user?.plan === "pro" ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/20">
                <Crown className="w-3 h-3" /> Pro Plan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.06] text-muted-foreground border border-white/[0.08]">
                Free Plan
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-bold text-white">Account Info</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[
            { icon: User, label: "Name", value: user?.fullName ?? "Not set" },
            { icon: Mail, label: "Email", value: user?.email ?? "—" },
            { icon: Calendar, label: "Member since", value: joinDate },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        {[
          { icon: BarChart3, label: "Total Analyses", value: totalAnalyses, color: "text-accent" },
          { icon: CheckCircle2, label: "Completed", value: completedAnalyses, color: "text-green-400" },
          { icon: Lightbulb, label: "Ideas Saved", value: (() => {
            try { return JSON.parse(localStorage.getItem("uploadiq_calendar") ?? "[]").length; } catch { return 0; }
          })(), color: "text-yellow-400" },
          { icon: User, label: "Competitors Tracked", value: (() => {
            try { return JSON.parse(localStorage.getItem("uploadiq_watchlist") ?? "[]").length; } catch { return 0; }
          })(), color: "text-blue-400" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass rounded-2xl p-5">
            <Icon className={`w-5 h-5 ${color} mb-2`} />
            <p className={`text-2xl font-black ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

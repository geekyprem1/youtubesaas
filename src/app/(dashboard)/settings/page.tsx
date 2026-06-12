"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Bell, Shield, Trash2, Crown, CheckCircle2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserData {
  user: {
    email: string;
    fullName?: string;
    plan: "free" | "pro";
  };
}

export default function SettingsPage() {
  const [data, setData] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(setData);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you sure? This will permanently delete your account and all data.")) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const user = data?.user;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-accent" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Plan */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Crown className="w-4 h-4 text-accent" /> Plan</h3>
          {user?.plan === "pro" && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/20">Active</span>
          )}
        </div>
        <div className="p-6">
          {user?.plan === "pro" ? (
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-white">Pro Plan</p>
                <p className="text-xs text-muted-foreground mt-0.5">Unlimited analyses, Video Analyzer, Competitor Watchlist, Content Calendar</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Free Plan</p>
                <p className="text-xs text-muted-foreground mt-0.5">3 analyses/day · Limited features</p>
              </div>
              <Link href="/pricing" className="px-4 py-2 rounded-xl bg-gradient-purple text-white text-xs font-bold hover:opacity-90 transition-opacity">
                Upgrade to Pro →
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Bell className="w-4 h-4 text-muted-foreground" /> Notifications</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Analysis complete alerts</p>
              <p className="text-xs text-muted-foreground mt-0.5">Get notified when your analysis finishes</p>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-10 h-6 rounded-full transition-colors relative ${notifications ? "bg-accent" : "bg-white/[0.1]"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${notifications ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Account */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2"><Shield className="w-4 h-4 text-muted-foreground" /> Account</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Email</p>
              <p className="text-xs text-muted-foreground">{user?.email ?? "—"}</p>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Sign out</p>
              <p className="text-xs text-muted-foreground">Sign out of your account</p>
            </div>
            <button onClick={handleSignOut} className="px-4 py-2 rounded-xl border border-white/[0.1] text-xs font-semibold text-white/70 hover:text-white hover:border-white/20 transition-colors">
              Sign Out
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl overflow-hidden border border-red-500/20 bg-red-500/5">
        <div className="px-6 py-4 border-b border-red-500/10">
          <h3 className="text-sm font-bold text-red-400 flex items-center gap-2"><Trash2 className="w-4 h-4" /> Danger Zone</h3>
        </div>
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Delete account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="px-4 py-2 rounded-xl border border-red-500/30 text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

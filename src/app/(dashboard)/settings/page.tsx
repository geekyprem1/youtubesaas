"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Shield, Trash2, Crown, CheckCircle2, Loader2, Sparkles, Check, Save, Youtube } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

interface UserData {
  user: {
    email: string;
    fullName?: string;
    plan: "free" | "pro";
    interests?: string[];
    onboardingChannelUrl?: string;
  };
}

export default function SettingsPage() {
  const [data, setData] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [interests, setInterests] = useState<string[]>([]);
  const [channelUrl, setChannelUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/user").then(r => r.json()).then(d => {
      setData(d);
      setInterests(d.user?.interests ?? []);
      setChannelUrl(d.user?.onboardingChannelUrl ?? "");
    });
  }, []);

  function toggleCategory(id: string) {
    setInterests(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
    setSaveStatus("idle");
  }

  async function savePreferences() {
    if (interests.length === 0) {
      setSaveError("Select at least one category");
      setSaveStatus("error");
      return;
    }
    setSaving(true);
    setSaveStatus("idle");
    setSaveError("");
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests, channelUrl }),
    });
    if (res.ok) {
      setSaveStatus("success");
    } else {
      const d = await res.json();
      setSaveError(d.error ?? "Something went wrong");
      setSaveStatus("error");
    }
    setSaving(false);
  }

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

      {/* Content Niche */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }} className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.05]">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" /> Content Niche
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Pick up to <span className="text-white font-semibold">3 categories</span> — Opportunity Radar and Today&apos;s Pick use these to show relevant trending topics.
          </p>
        </div>
        <div className="p-6 space-y-4">
          {/* Channel URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Youtube className="w-3.5 h-3.5" /> Your YouTube Channel (optional)
            </label>
            <input
              type="text"
              value={channelUrl}
              onChange={e => { setChannelUrl(e.target.value); setSaveStatus("idle"); }}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm"
            />
          </div>

          {/* Category grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {CATEGORIES.map(cat => {
              const selected = interests.includes(cat.id);
              const maxed = interests.length >= 3 && !selected;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  disabled={maxed}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                    selected
                      ? "bg-primary/15 border-primary/40 text-white"
                      : maxed
                      ? "bg-white/[0.02] border-white/[0.04] text-muted-foreground/40 cursor-not-allowed"
                      : "bg-white/[0.03] border-white/[0.07] text-white/80 hover:border-primary/25 hover:bg-primary/8"
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-sm font-semibold leading-tight">{cat.label}</span>
                  {selected && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">{interests.length}/3 selected</span>
            {saveStatus === "error" && <span className="text-xs text-red-400">{saveError}</span>}
            {saveStatus === "success" && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check className="w-3 h-3" /> Saved! Radar updated.
              </span>
            )}
          </div>

          <button
            onClick={savePreferences}
            disabled={saving || interests.length === 0}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-purple text-white font-bold text-sm hover:opacity-90 transition-opacity glow-purple disabled:opacity-40"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="w-4 h-4" /> Save Preferences</>
            )}
          </button>
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

"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users, CrownIcon, BarChart3, RefreshCw,
  ShieldBan, ShieldCheck, TrendingUp, TrendingDown,
  Search, ChevronDown, ChevronUp, Zap, Lock, Eye, EyeOff
} from "lucide-react";

interface User {
  id: string;
  email: string;
  fullName: string | null;
  plan: "free" | "pro";
  createdAt: string;
  lastSignIn: string | null;
  banned: boolean;
  totalAnalyses: number;
  usedToday: number;
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m}mo ago`;
  return `${Math.floor(m / 12)}y ago`;
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number | string; color: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-white">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(false);
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      onSuccess();
    } else {
      setError(true);
    }
    setChecking(false);
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-black text-white">Admin Access</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Admin password"
              className={`w-full px-4 py-3 pr-10 rounded-xl bg-white/[0.04] border text-white placeholder:text-muted-foreground focus:outline-none transition-colors ${
                error ? "border-red-500/50 focus:border-red-500" : "border-white/[0.07] focus:border-primary/40"
              }`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
            >
              {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 text-center">Wrong password. Try again.</p>
          )}

          <button
            type="submit"
            disabled={!password || checking}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            {checking ? "Verifying..." : "Enter Admin Panel"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "totalAnalyses" | "usedToday">("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { if (unlocked) fetchUsers(); }, [fetchUsers, unlocked]);

  if (!unlocked) return <PasswordGate onSuccess={() => setUnlocked(true)} />;

  async function doAction(userId: string, action: string) {
    setActionLoading(userId + action);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, action }),
    });
    const data = await res.json();
    setToast(data.message ?? data.error);
    setTimeout(() => setToast(null), 3000);
    await fetchUsers();
    setActionLoading(null);
  }

  const filtered = users
    .filter(u => !search || u.email?.toLowerCase().includes(search.toLowerCase()) || u.fullName?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = sortBy === "createdAt" ? new Date(a.createdAt).getTime() : sortBy === "totalAnalyses" ? a.totalAnalyses : a.usedToday;
      const bv = sortBy === "createdAt" ? new Date(b.createdAt).getTime() : sortBy === "totalAnalyses" ? b.totalAnalyses : b.usedToday;
      return sortAsc ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });

  const totalUsers = users.length;
  const proUsers = users.filter(u => u.plan === "pro").length;
  const activeToday = users.filter(u => u.usedToday > 0).length;
  const totalAnalysesToday = users.reduce((s, u) => s + u.usedToday, 0);

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortAsc(!sortAsc);
    else { setSortBy(col); setSortAsc(false); }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="border-b border-white/[0.07] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-black text-white">UploadIQ Admin</h1>
            <p className="text-[10px] text-muted-foreground">User Management</p>
          </div>
        </div>
        <button onClick={fetchUsers} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.07] text-xs text-muted-foreground hover:text-white hover:border-white/20 transition-all">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Users" value={totalUsers} color="bg-blue-500/20" />
          <StatCard icon={CrownIcon} label="Pro Users" value={proUsers} color="bg-violet-500/20" />
          <StatCard icon={Zap} label="Active Today" value={activeToday} color="bg-green-500/20" />
          <StatCard icon={BarChart3} label="Analyses Today" value={totalAnalysesToday} color="bg-orange-500/20" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by email or name..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.07] text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
          />
        </div>

        {/* Table */}
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 px-5 py-3 bg-white/[0.02] border-b border-white/[0.07] text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-center">Plan</div>
            <div className="col-span-1 text-center cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("usedToday")}>
              <span className="flex items-center justify-center gap-1">Today {sortBy === "usedToday" ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}</span>
            </div>
            <div className="col-span-1 text-center cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("totalAnalyses")}>
              <span className="flex items-center justify-center gap-1">Total {sortBy === "totalAnalyses" ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}</span>
            </div>
            <div className="col-span-2 text-center cursor-pointer hover:text-white transition-colors" onClick={() => toggleSort("createdAt")}>
              <span className="flex items-center justify-center gap-1">Joined {sortBy === "createdAt" ? (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />) : null}</span>
            </div>
            <div className="col-span-2 text-center">Actions</div>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="py-16 text-center text-muted-foreground text-sm">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">No users found</div>
          ) : (
            filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.02 }}
                className={`grid grid-cols-12 px-5 py-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors items-center ${user.banned ? "opacity-50" : ""}`}
              >
                {/* User */}
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shrink-0 text-xs font-black text-white">
                    {(user.fullName ?? user.email ?? "?")[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{user.fullName ?? "—"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  {user.banned && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/20 shrink-0">BANNED</span>}
                </div>

                {/* Plan */}
                <div className="col-span-2 flex justify-center">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                    user.plan === "pro"
                      ? "bg-violet-500/15 text-violet-300 border-violet-500/25"
                      : "bg-white/[0.04] text-muted-foreground border-white/[0.08]"
                  }`}>
                    {user.plan.toUpperCase()}
                  </span>
                </div>

                {/* Used today */}
                <div className="col-span-1 text-center">
                  <span className={`text-sm font-black ${user.usedToday > 0 ? "text-green-400" : "text-white/20"}`}>
                    {user.usedToday}
                  </span>
                </div>

                {/* Total */}
                <div className="col-span-1 text-center">
                  <span className="text-sm font-semibold text-white/60">{user.totalAnalyses}</span>
                </div>

                {/* Joined */}
                <div className="col-span-2 text-center">
                  <span className="text-xs text-muted-foreground">{timeAgo(user.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-center gap-1.5">
                  {/* Plan toggle */}
                  {user.plan === "free" ? (
                    <button
                      onClick={() => doAction(user.id, "upgrade")}
                      disabled={!!actionLoading}
                      title="Upgrade to Pro"
                      className="w-7 h-7 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center hover:bg-violet-500/30 transition-colors disabled:opacity-40"
                    >
                      {actionLoading === user.id + "upgrade" ? <RefreshCw className="w-3 h-3 text-violet-300 animate-spin" /> : <TrendingUp className="w-3 h-3 text-violet-300" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => doAction(user.id, "downgrade")}
                      disabled={!!actionLoading}
                      title="Downgrade to Free"
                      className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center hover:bg-orange-500/30 transition-colors disabled:opacity-40"
                    >
                      {actionLoading === user.id + "downgrade" ? <RefreshCw className="w-3 h-3 text-orange-300 animate-spin" /> : <TrendingDown className="w-3 h-3 text-orange-300" />}
                    </button>
                  )}

                  {/* Reset credits */}
                  <button
                    onClick={() => doAction(user.id, "reset_credits")}
                    disabled={!!actionLoading}
                    title="Reset today's credits"
                    className="w-7 h-7 rounded-lg bg-green-500/15 border border-green-500/25 flex items-center justify-center hover:bg-green-500/30 transition-colors disabled:opacity-40"
                  >
                    {actionLoading === user.id + "reset_credits" ? <RefreshCw className="w-3 h-3 text-green-300 animate-spin" /> : <Zap className="w-3 h-3 text-green-300" />}
                  </button>

                  {/* Ban / Unban */}
                  {user.banned ? (
                    <button
                      onClick={() => doAction(user.id, "unban")}
                      disabled={!!actionLoading}
                      title="Unban user"
                      className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center hover:bg-blue-500/30 transition-colors disabled:opacity-40"
                    >
                      {actionLoading === user.id + "unban" ? <RefreshCw className="w-3 h-3 text-blue-300 animate-spin" /> : <ShieldCheck className="w-3 h-3 text-blue-300" />}
                    </button>
                  ) : (
                    <button
                      onClick={() => doAction(user.id, "ban")}
                      disabled={!!actionLoading}
                      title="Ban user"
                      className="w-7 h-7 rounded-lg bg-red-500/15 border border-red-500/25 flex items-center justify-center hover:bg-red-500/30 transition-colors disabled:opacity-40"
                    >
                      {actionLoading === user.id + "ban" ? <RefreshCw className="w-3 h-3 text-red-300 animate-spin" /> : <ShieldBan className="w-3 h-3 text-red-300" />}
                    </button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">{filtered.length} users shown</p>
      </div>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-sm font-semibold text-white"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
}

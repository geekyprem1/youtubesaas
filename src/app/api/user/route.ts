import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileRes, usageRes, analysesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("daily_usage").select("count").eq("user_id", user.id),
    supabase.from("analyses")
      .select("id, status, created_at, channel_id, channel_url")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const plan = profileRes.data?.plan ?? "free";
  const dailyUsed = (usageRes.data ?? []).reduce((sum, row) => sum + (row.count ?? 0), 0);
  const dailyLimit = plan === "pro" ? 999 : 3;

  // Fetch channel data separately for analyses that have a channel_id
  const analyses = analysesRes.data ?? [];
  const channelIds = [...new Set(analyses.map((a) => a.channel_id).filter(Boolean))];

  let channelMap: Record<string, { name: string; thumbnail_url: string | null; subscribers: number }> = {};
  if (channelIds.length > 0) {
    const { data: channelsData } = await supabase
      .from("channels")
      .select("id, name, thumbnail_url, subscribers")
      .in("id", channelIds);
    if (channelsData) {
      for (const ch of channelsData) {
        channelMap[ch.id] = { name: ch.name, thumbnail_url: ch.thumbnail_url, subscribers: ch.subscribers };
      }
    }
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: profileRes.data?.full_name ?? user.user_metadata?.full_name,
      avatarUrl: profileRes.data?.avatar_url ?? user.user_metadata?.avatar_url,
      plan,
      dailyAnalysesUsed: dailyUsed,
      dailyAnalysesLimit: dailyLimit,
    },
    analyses: analyses.map((a) => ({
      id: a.id,
      status: a.status,
      created_at: a.created_at,
      channel_id: a.channel_id,
      channels: a.channel_id && channelMap[a.channel_id]
        ? channelMap[a.channel_id]
        : { name: extractNameFromUrl(a.channel_url), thumbnail_url: null, subscribers: 0 },
    })),
  });
}

function extractNameFromUrl(url: string | null): string {
  if (!url) return "Unknown Channel";
  try {
    const u = new URL(url);
    // Skip video URLs — these are not channel URLs
    if (u.searchParams.has("v") || u.pathname.startsWith("/watch")) return "Unknown Channel";
    const parts = u.pathname.split("/").filter(Boolean);
    // Skip common non-channel path segments
    const skip = new Set(["watch", "shorts", "playlist", "results", "feed"]);
    const handle = parts.find((p) => p.startsWith("@") && !skip.has(p))
      ?? parts.find((p) => p.startsWith("c/") || p.startsWith("channel/"))
      ?? parts.find((p) => !skip.has(p) && p.length > 2);
    return handle ? decodeURIComponent(handle) : "Unknown Channel";
  } catch {
    return url.length < 60 ? url : "Unknown Channel";
  }
}

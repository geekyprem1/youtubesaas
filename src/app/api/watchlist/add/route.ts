import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveChannelId, fetchChannelData, fetchChannelVideos } from "@/lib/youtube";
import { calculatePerformanceScore } from "@/lib/utils";

function parseChannelUrl(url: string): { type: "handle" | "channelId" | "username"; value: string } | null {
  try {
    const u = new URL(url.trim());
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts[0]?.startsWith("@")) return { type: "handle", value: parts[0].slice(1) };
    if (parts[0] === "channel" && parts[1]) return { type: "channelId", value: parts[1] };
    if (parts[0] === "user" && parts[1]) return { type: "username", value: parts[1] };
    if (parts[0] && !["watch", "shorts", "playlist"].includes(parts[0])) return { type: "username", value: parts[0] };
    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { channelUrl } = await req.json();
    if (!channelUrl) return NextResponse.json({ error: "Channel URL required" }, { status: 400 });

    const identifier = parseChannelUrl(channelUrl);
    if (!identifier) return NextResponse.json({ error: "Invalid YouTube channel URL" }, { status: 400 });

    const channelId = await resolveChannelId(identifier.type, identifier.value);
    const channel = await fetchChannelData(channelId);
    const videos = await fetchChannelVideos(channelId, 10);

    const avgViews = videos.reduce((s, v) => s + v.viewCount, 0) / Math.max(videos.length, 1);
    const latest = videos.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())[0];

    let latestVideo = null;
    if (latest) {
      const score = calculatePerformanceScore(latest.viewCount, latest.likeCount, latest.commentCount, latest.publishedAt, avgViews);
      latestVideo = {
        title: latest.title,
        videoId: latest.id,
        viewCount: latest.viewCount,
        publishedAt: latest.publishedAt,
        performanceLabel: score >= 80 ? "🔥 High" : score >= 55 ? "📈 Good" : "→ Average",
      };
    }

    return NextResponse.json({
      id: channelId,
      name: channel.name,
      handle: channel.handle,
      subscribers: channel.subscribers,
      thumbnailUrl: channel.thumbnailUrl,
      addedAt: new Date().toISOString(),
      latestVideo,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractVideoId, fetchVideoById } from "@/lib/youtube";
import { analyzeVideo } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const admin = createAdminClient();
    const today = new Date().toISOString().split("T")[0];

    // Check daily limit
    const [{ data: usageData }, { data: profile }] = await Promise.all([
      admin.from("daily_usage").select("count").eq("user_id", user.id).eq("date", today).single(),
      admin.from("profiles").select("plan").eq("id", user.id).single(),
    ]);

    const dailyLimit = profile?.plan === "pro" ? Infinity : 3;
    const currentUsage = usageData?.count ?? 0;

    if (currentUsage >= dailyLimit) {
      return NextResponse.json(
        { error: "Daily limit reached. Upgrade to Pro for unlimited analyses." },
        { status: 429 }
      );
    }

    const { videoUrl } = await req.json();
    if (!videoUrl) return NextResponse.json({ error: "Video URL is required" }, { status: 400 });

    const videoId = extractVideoId(videoUrl);
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube video URL" }, { status: 400 });

    const video = await fetchVideoById(videoId);
    const analysis = await analyzeVideo(video);

    // Increment usage atomically
    const { error: rpcErr } = await admin.rpc("increment_daily_usage", {
      p_user_id: user.id,
      p_date: today,
    });
    if (rpcErr) {
      await admin.from("daily_usage").upsert(
        { user_id: user.id, date: today, count: currentUsage + 1 },
        { onConflict: "user_id,date" }
      );
    }

    return NextResponse.json({ video, analysis });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}

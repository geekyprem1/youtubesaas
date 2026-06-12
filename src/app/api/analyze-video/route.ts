import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractVideoId, fetchVideoById } from "@/lib/youtube";
import { analyzeVideo } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { videoUrl } = await req.json();
    if (!videoUrl) return NextResponse.json({ error: "Video URL is required" }, { status: 400 });

    const videoId = extractVideoId(videoUrl);
    if (!videoId) return NextResponse.json({ error: "Invalid YouTube video URL" }, { status: 400 });

    const video = await fetchVideoById(videoId);
    const analysis = await analyzeVideo(video);

    return NextResponse.json({ video, analysis });
  } catch (error) {
    console.error("Video analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}

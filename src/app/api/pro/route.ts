import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateProContent } from "@/lib/gemini";
import type { VideoIdea, ChannelDNA, YoutubeChannel } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    if (profile?.plan !== "pro") {
      return NextResponse.json(
        { error: "Pro plan required", upgrade: true },
        { status: 403 }
      );
    }

    const { videoIdea, channelDNA, channel } = await req.json() as {
      videoIdea: VideoIdea;
      channelDNA: ChannelDNA;
      channel: YoutubeChannel;
    };

    const proContent = await generateProContent(videoIdea, channelDNA, channel);
    return NextResponse.json(proContent);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate pro content" },
      { status: 500 }
    );
  }
}

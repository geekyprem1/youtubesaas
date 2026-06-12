import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  resolveChannelId,
  fetchChannelData,
  fetchChannelVideos,
  searchCompetitorChannels,
  fetchMultipleChannels,
  fetchCompetitorTopVideos,
} from "@/lib/youtube";
import {
  analyzeChannelDNA,
  generateVideoIdeas,
  findCompetitorKeywords,
} from "@/lib/gemini";
import { calculatePerformanceScore, extractChannelIdentifier } from "@/lib/utils";
import type { Competitor, VideoPerformance } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check daily usage limit
    const today = new Date().toISOString().split("T")[0];
    const admin = createAdminClient();

    const { data: usageData } = await admin
      .from("daily_usage")
      .select("count")
      .eq("user_id", user.id)
      .eq("date", today)
      .single();

    const { data: profile } = await admin
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();

    const dailyLimit = profile?.plan === "pro" ? Infinity : 3;
    const currentUsage = usageData?.count ?? 0;

    if (currentUsage >= dailyLimit) {
      return NextResponse.json(
        { error: "Daily analysis limit reached. Upgrade to Pro for unlimited analyses." },
        { status: 429 }
      );
    }

    const { channelUrl } = await req.json();
    if (!channelUrl) {
      return NextResponse.json({ error: "Channel URL is required" }, { status: 400 });
    }

    // Create analysis record
    const { data: analysis, error: createError } = await admin
      .from("analyses")
      .insert({
        user_id: user.id,
        status: "analyzing",
        channel_url: channelUrl,
        step: 0,
      })
      .select()
      .single();

    if (createError) {
      console.error("Create analysis error:", createError);
      throw createError;
    }

    const analysisId = analysis.id;

    // Run pipeline in background
    runAnalysisPipeline(analysisId, channelUrl, admin);

    // Increment usage
    await admin.from("daily_usage").upsert({
      user_id: user.id,
      date: today,
      count: currentUsage + 1,
    });

    return NextResponse.json({ analysisId });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runAnalysisPipeline(analysisId: string, channelUrl: string, admin: any) {
  try {
    // STEP 1: Resolve channel
    const identifier = extractChannelIdentifier(channelUrl);
    if (identifier.type === "invalid") throw new Error("Invalid YouTube channel URL");

    await admin.from("analyses").update({ step: 1 }).eq("id", analysisId);

    const channelId = await resolveChannelId(identifier.type, identifier.value);
    const channel = await fetchChannelData(channelId);
    const videos = await fetchChannelVideos(channelId, 50);

    // Save channel
    await admin.from("channels").upsert({
      id: channelId,
      name: channel.name,
      handle: channel.handle,
      subscribers: channel.subscribers,
      total_videos: channel.totalVideos,
      total_views: channel.totalViews,
      description: channel.description,
      thumbnail_url: channel.thumbnailUrl,
      country: channel.country,
      published_at: channel.publishedAt,
    });

    // Update analysis with channel_id
    await admin.from("analyses").update({ channel_id: channelId, step: 1 }).eq("id", analysisId);

    // Save videos
    if (videos.length > 0) {
      await admin.from("videos").upsert(
        videos.map((v) => ({
          id: v.id,
          channel_id: channelId,
          title: v.title,
          description: v.description,
          thumbnail_url: v.thumbnailUrl,
          published_at: v.publishedAt,
          view_count: v.viewCount,
          like_count: v.likeCount,
          comment_count: v.commentCount,
          duration: v.duration,
          tags: v.tags,
        }))
      );
    }

    // STEP 2: Channel DNA
    await admin.from("analyses").update({ step: 2 }).eq("id", analysisId);
    const channelDNA = await analyzeChannelDNA(channel, videos);
    await admin.from("analyses").update({ channel_dna: channelDNA }).eq("id", analysisId);

    // STEP 3: Top performing videos
    await admin.from("analyses").update({ step: 3 }).eq("id", analysisId);
    const avgViews = videos.reduce((s, v) => s + v.viewCount, 0) / Math.max(videos.length, 1);
    const topVideos: VideoPerformance[] = videos
      .map((v) => ({
        videoId: v.id,
        title: v.title,
        views: v.viewCount,
        likes: v.likeCount,
        comments: v.commentCount,
        publishedAt: v.publishedAt,
        thumbnailUrl: v.thumbnailUrl,
        performanceScore: calculatePerformanceScore(
          v.viewCount, v.likeCount, v.commentCount, v.publishedAt, avgViews
        ),
        recencyWeight: Math.max(0, 1 - Math.floor(
          (Date.now() - new Date(v.publishedAt).getTime()) / (1000 * 60 * 60 * 24)
        ) / 365),
        engagementRate: v.viewCount > 0 ? (v.likeCount + v.commentCount * 2) / v.viewCount : 0,
      }))
      .sort((a, b) => b.performanceScore - a.performanceScore)
      .slice(0, 10);

    await admin.from("analyses").update({ top_videos: topVideos }).eq("id", analysisId);

    // STEP 4: Competitors
    await admin.from("analyses").update({ step: 4 }).eq("id", analysisId);
    const competitorKeywords = await findCompetitorKeywords(channelDNA);
    const competitorChannelIds = await searchCompetitorChannels(competitorKeywords, channelId, 10);
    const competitorChannels = await fetchMultipleChannels(competitorChannelIds);

    const competitors: Competitor[] = await Promise.all(
      competitorChannels.map(async (ch) => {
        const topVids = await fetchCompetitorTopVideos(ch.id, 10);
        return {
          channelId: ch.id,
          channelName: ch.name,
          handle: ch.handle,
          subscribers: ch.subscribers,
          thumbnailUrl: ch.thumbnailUrl,
          similarityScore: Math.floor(Math.random() * 30) + 70,
          topVideos: topVids,
        };
      })
    );

    // Save competitors
    if (competitors.length > 0) {
      await admin.from("competitors").insert(
        competitors.map((c) => ({
          analysis_id: analysisId,
          channel_id: c.channelId,
          channel_name: c.channelName,
          handle: c.handle,
          subscribers: c.subscribers,
          thumbnail_url: c.thumbnailUrl,
          similarity_score: c.similarityScore,
          top_videos: c.topVideos,
        }))
      );
    }

    // STEPS 5 & 6: Ideas
    await admin.from("analyses").update({ step: 6 }).eq("id", analysisId);
    const videoIdeas = await generateVideoIdeas(channel, channelDNA, topVideos, competitors);

    await admin.from("analyses").update({
      video_ideas: videoIdeas,
      status: "completed",
      completed_at: new Date().toISOString(),
    }).eq("id", analysisId);

  } catch (error) {
    console.error("Pipeline error:", error);
    await admin.from("analyses").update({
      status: "failed",
      error_message: error instanceof Error ? error.message : "Unknown error",
    }).eq("id", analysisId);
  }
}

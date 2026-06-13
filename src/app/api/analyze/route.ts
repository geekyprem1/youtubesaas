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
  discoverOpportunities,
  findCompetitorKeywords,
} from "@/lib/gemini";
import { calculatePerformanceScore, extractChannelIdentifier } from "@/lib/utils";
import {
  toDNAProfile,
  medianDurationSeconds,
  bandFromSeconds,
  tokenizeContent,
  buildProof,
  channelDnaMatch,
  opportunityScore,
  confidenceScore,
  classifyOpportunity,
  trendMomentum,
  competitionLevel,
  expectedViewRange,
  termOverlap,
  explain,
} from "@/lib/scoring";
import type { Competitor, VideoPerformance, VideoIdea } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Atomic increment — avoid race condition where multiple fast requests all read count=0
    const { error: upsertErr } = await admin.rpc("increment_daily_usage", {
      p_user_id: user.id,
      p_date: today,
    });
    // Fallback if RPC not available
    if (upsertErr) {
      await admin.from("daily_usage").upsert(
        { user_id: user.id, date: today, count: currentUsage + 1 },
        { onConflict: "user_id,date" }
      );
    }

    return NextResponse.json({ analysisId });
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}

function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
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

    // STEP 2: Channel DNA (structured extraction; length band computed in code)
    await admin.from("analyses").update({ step: 2 }).eq("id", analysisId);
    const channelDNA = await analyzeChannelDNA(channel, videos);
    const lengthBand = bandFromSeconds(medianDurationSeconds(videos.map((v) => v.duration)));
    channelDNA.lengthBand = lengthBand;
    const dnaProfile = toDNAProfile(channelDNA, lengthBand);
    await admin
      .from("analyses")
      .update({ channel_dna: channelDNA, dna_profile: dnaProfile })
      .eq("id", analysisId);
    // Cache DNA on the channel for reuse
    await admin
      .from("channels")
      .update({ dna_profile: dnaProfile, dna_extracted_at: new Date().toISOString(), last_analyzed_at: new Date().toISOString() })
      .eq("id", channelId);

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
        // Real similarity: overlap between this competitor's video topics and our channel's topics
        const compTokens = [
          ...new Set(topVids.flatMap((v) => tokenizeContent(v.title, v.tags ?? []))),
        ];
        const similarity = Math.round(termOverlap(dnaProfile.primaryTopics, compTokens));
        return {
          channelId: ch.id,
          channelName: ch.name,
          handle: ch.handle,
          subscribers: ch.subscribers,
          thumbnailUrl: ch.thumbnailUrl,
          similarityScore: similarity,
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

    // STEP 5: Discover opportunities (structured features only — no AI scores)
    await admin.from("analyses").update({ step: 5 }).eq("id", analysisId);
    const drafts = await discoverOpportunities(channel, channelDNA, topVideos, competitors);

    // Build the competitor video corpus (MVP: title+tag tokens as topic proxy)
    const corpus = competitors.flatMap((c) =>
      c.topVideos.map((v) => ({
        channelId: c.channelId,
        views: v.viewCount,
        publishedAt: v.publishedAt,
        topics: tokenizeContent(v.title, v.tags ?? []),
      }))
    );
    const totalChannels = competitors.length;

    // STEP 6: Deterministic scoring via scoring.ts
    await admin.from("analyses").update({ step: 6 }).eq("id", analysisId);

    const scored = drafts.map((d, i) => {
      const oppFeatures = {
        topics: d.topics ?? [],
        format: d.format ?? "",
        audience: d.audience ?? [],
        tone: d.tone ?? [],
        lengthBand: d.lengthBand ?? lengthBand,
      };
      const proof = buildProof(oppFeatures.topics, corpus, totalChannels);
      const dna = channelDnaMatch(oppFeatures, dnaProfile);
      const opp = opportunityScore(dna.score, proof);
      const conf = confidenceScore(dna.score, dna.breakdown.audience, proof);
      const trend = Math.round(trendMomentum(proof));
      const competition = Math.round(competitionLevel(proof));
      const oppType = classifyOpportunity(proof);
      const range = expectedViewRange(proof);
      const why = explain(dna, opp, proof);
      const estimatedPerformance =
        range.high > 0
          ? `${fmtViews(range.low)}-${fmtViews(range.high)} views based on competitor data`
          : "Estimate forming — limited competitor data";

      const idea: VideoIdea = {
        id: String(i + 1),
        title: d.title,
        opportunityScore: opp.score,
        reason: d.reason,
        expectedAudienceInterest:
          conf.score >= 80 ? "Very High" : conf.score >= 65 ? "High" : "Medium",
        difficulty: d.difficulty,
        estimatedPerformance,
        topics: oppFeatures.topics,
        format: oppFeatures.format,
        dnaMatchScore: dna.score,
        confidenceScore: conf.score,
        trendScore: trend,
        competitionScore: competition,
        opportunityType: oppType,
        whyBullets: why,
        alternativeAngles: d.alternativeAngles ?? [],
        confidenceBreakdown: conf.breakdown as VideoIdea["confidenceBreakdown"],
      };

      return { idea, proof, range, dna, opp, conf, trend, competition, oppType };
    });

    // Sort by opportunity score (best first)
    scored.sort((a, b) => b.idea.opportunityScore - a.idea.opportunityScore);
    const videoIdeas = scored.map((s) => s.idea);

    // Persist the queryable recommendations table
    await admin.from("recommendations").delete().eq("analysis_id", analysisId);
    await admin.from("recommendations").insert(
      scored.map((s) => ({
        analysis_id: analysisId,
        title: s.idea.title,
        dna_match_score: s.dna.score,
        opportunity_score: s.opp.score,
        confidence_score: s.conf.score,
        trend_score: s.trend,
        competition_score: s.competition,
        opportunity_type: s.oppType,
        expected_views_low: s.range.low,
        expected_views_high: s.range.high,
        difficulty: s.idea.difficulty,
        upload_window: s.oppType === "Emerging" || s.oppType === "Rising" ? "Next 14 days" : "Next 30 days",
        why_bullets: s.idea.whyBullets,
        competitor_proof: s.proof,
        alternative_angles: s.idea.alternativeAngles,
        score_breakdown: { dna: s.dna.breakdown, opportunity: s.opp.breakdown, confidence: s.conf.breakdown },
        topics: s.idea.topics,
        format: s.idea.format,
      }))
    );

    await admin.from("analyses").update({
      video_ideas: videoIdeas,
      scoring_version: 1,
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

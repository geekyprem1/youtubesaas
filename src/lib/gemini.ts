import type {
  YoutubeChannel,
  YoutubeVideo,
  ChannelDNA,
  VideoIdea,
  ProContent,
  Competitor,
} from "@/types";

const OPENROUTER_BASE = "https://openrouter.ai/api/v1";
const MODEL = "google/gemini-2.5-flash";

function getApiKey() {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY is not set");
  return key;
}

async function generateJSON<T>(prompt: string): Promise<T> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
      "X-Title": "UploadIQ",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: prompt + "\n\nIMPORTANT: Return ONLY valid JSON with no markdown, no code blocks, no extra text.",
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim() ?? "";
  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  return JSON.parse(cleaned) as T;
}

export async function analyzeChannelDNA(
  channel: YoutubeChannel,
  videos: YoutubeVideo[]
): Promise<ChannelDNA> {
  const videoSummary = videos
    .slice(0, 30)
    .map((v) => `- "${v.title}" (${v.viewCount.toLocaleString()} views, ${v.likeCount.toLocaleString()} likes)`)
    .join("\n");

  const prompt = `
You are extracting the repeatable formula of a YouTube channel from its top videos.
Return STRUCTURED features as normalized, lowercase arrays — not prose, not scores.

Channel: ${channel.name}
Subscribers: ${channel.subscribers.toLocaleString()}
Description: ${channel.description.slice(0, 500)}

Recent Videos:
${videoSummary}

Return this exact JSON structure:
{
  "primaryNiche": "string (main content niche, e.g., 'AI Tools')",
  "secondaryNiche": "string (secondary niche, e.g., 'Productivity')",
  "audienceType": "string (single primary audience, e.g., 'Developers')",
  "contentStyle": "string (single primary style, e.g., 'Tutorial')",
  "contentFormat": "string ('Long-form', 'Short-form', or 'Mixed')",
  "topicClusters": ["5-8 main topic clusters, human-readable"],
  "uniqueValueProp": "string (what makes this channel unique, 1-2 sentences)",
  "toneAndVoice": "string (e.g., 'Casual and friendly')",
  "primaryTopics": ["6-8 normalized lowercase topic tags, e.g., 'ai agents', 'saas', 'automation'"],
  "formats": ["normalized lowercase formats, e.g., 'tutorial', 'case study', 'review'"],
  "audience": ["normalized lowercase audience segments, e.g., 'developers', 'indie hackers'"],
  "tone": ["normalized lowercase tone descriptors, e.g., 'educational', 'practical'"]
}
`;

  return generateJSON<ChannelDNA>(prompt);
}

export interface OpportunityDraft {
  title: string;
  topics: string[];
  format: string;
  audience: string[];
  tone: string[];
  lengthBand: "short" | "mid" | "long";
  reason: string;
  difficulty: "Easy" | "Medium" | "Hard";
  alternativeAngles: string[];
}

/**
 * STEP 3+4 (discovery): find topics competitors win on that this channel has
 * NOT covered. Returns STRUCTURED FEATURES ONLY — no scores. All scoring is
 * computed deterministically in scoring.ts.
 */
export async function discoverOpportunities(
  channel: YoutubeChannel,
  channelDNA: ChannelDNA,
  topVideos: Array<{ title: string; views: number; performanceScore: number }>,
  competitors: Competitor[]
): Promise<OpportunityDraft[]> {
  const coveredTitles = topVideos
    .slice(0, 12)
    .map((v) => `- "${v.title}"`)
    .join("\n");

  const competitorTopics = competitors
    .flatMap((c) =>
      c.topVideos.slice(0, 6).map((v) => `[${c.channelName}] "${v.title}" (${v.viewCount.toLocaleString()} views)`)
    )
    .slice(0, 60)
    .join("\n");

  const prompt = `
You are a YouTube growth strategist. Find 20 video OPPORTUNITIES for this channel.

CHANNEL: ${channel.name}
Primary niche: ${channelDNA.primaryNiche}
Audience: ${channelDNA.audienceType}
Formats: ${(channelDNA.formats ?? [channelDNA.contentStyle]).join(", ")}
Topic clusters: ${channelDNA.topicClusters.join(", ")}

THIS CHANNEL HAS ALREADY COVERED (do not repeat these):
${coveredTitles}

COMPETITOR TOP VIDEOS (mine these for proven, uncovered topics):
${competitorTopics}

Pick topics that competitors are winning with but this channel has NOT covered,
and that fit this channel's niche and audience.

Return STRUCTURED FEATURES ONLY. DO NOT assign any scores, ratings, or numbers —
scoring is computed separately. Return a JSON array of exactly 20 items:
[
  {
    "title": "specific, clickable video title",
    "topics": ["2-4 normalized lowercase topic tags matching competitor topics"],
    "format": "single normalized lowercase format (e.g., 'tutorial')",
    "audience": ["1-2 normalized lowercase audience segments"],
    "tone": ["1-2 normalized lowercase tone descriptors"],
    "lengthBand": "short | mid | long",
    "reason": "2-3 sentences on why this is an uncovered opportunity",
    "difficulty": "Easy | Medium | Hard",
    "alternativeAngles": ["2-3 alternative title angles for the same topic"]
  }
]
`;

  return generateJSON<OpportunityDraft[]>(prompt);
}

export type ProContentType = "titles" | "thumbnails" | "outline" | "seo" | "all";

export async function generateProContent(
  videoIdea: VideoIdea,
  channelDNA: ChannelDNA,
  channel: YoutubeChannel,
  contentType: ProContentType = "all"
): Promise<Partial<ProContent>> {
  const ctx = `Channel: ${channel.name}
Channel Niche: ${channelDNA?.primaryNiche ?? "General"}
Audience: ${channelDNA?.audienceType ?? "General audience"}
Content Style: ${channelDNA?.contentStyle ?? "Educational"}
Video Idea: "${videoIdea.title}"
Opportunity Score: ${videoIdea.opportunityScore}/100
Topics: ${(videoIdea.topics ?? []).join(", ")}`;

  if (contentType === "titles") {
    const prompt = `You are a YouTube title expert. Generate 10 unique highly clickable title variations.\n\n${ctx}\n\nReturn JSON: { "titles": ["title1", "title2", ...10 titles] }`;
    return generateJSON<Pick<ProContent, "titles">>(prompt);
  }

  if (contentType === "thumbnails") {
    const prompt = `You are a YouTube thumbnail expert. Generate 3 visual thumbnail concepts.\n\n${ctx}\n\nReturn JSON: { "thumbnailConcepts": [{ "concept": "", "description": "", "colorScheme": "", "textOverlay": "" }, ...3 items] }`;
    return generateJSON<Pick<ProContent, "thumbnailConcepts">>(prompt);
  }

  if (contentType === "outline") {
    const prompt = `You are a YouTube content strategist. Generate a hook script and video outline.\n\n${ctx}\n\nReturn JSON: { "hookScript": "30-60 second hook script", "videoOutline": [{ "timestamp": "0:00", "section": "Hook", "description": "" }, ...], "ctaSuggestions": ["cta1", ...5 items] }`;
    return generateJSON<Pick<ProContent, "hookScript" | "videoOutline" | "ctaSuggestions">>(prompt);
  }

  if (contentType === "seo") {
    const prompt = `You are a YouTube SEO expert. Generate SEO description and tags.\n\n${ctx}\n\nReturn JSON: { "seoDescription": "400-500 word SEO description", "tags": ["tag1", ...20-25 tags] }`;
    return generateJSON<Pick<ProContent, "seoDescription" | "tags">>(prompt);
  }

  // "all" — full pack
  const prompt = `You are an expert YouTube content strategist. Generate complete production assets for this video idea.\n\n${ctx}\n\nReturn this exact JSON:\n{\n  "titles": ["10 unique, highly clickable title variations with different hooks"],\n  "thumbnailConcepts": [\n    { "concept": "name", "description": "visual description", "colorScheme": "colors", "textOverlay": "text" },\n    { "concept": "name 2", "description": "visual description", "colorScheme": "colors", "textOverlay": "text" },\n    { "concept": "name 3", "description": "visual description", "colorScheme": "colors", "textOverlay": "text" }\n  ],\n  "seoDescription": "Full SEO-optimized YouTube description (400-500 words)",\n  "tags": ["20-25 relevant YouTube tags"],\n  "videoOutline": [\n    { "timestamp": "0:00", "section": "Hook", "description": "What to cover" },\n    { "timestamp": "0:30", "section": "Intro", "description": "What to cover" }\n  ],\n  "hookScript": "A compelling 30-60 second hook script",\n  "ctaSuggestions": ["5 different call-to-action suggestions"]\n}`;
  return generateJSON<ProContent>(prompt);
}

export interface VideoAnalysis {
  viralityScore: number;
  hookStrength: number;
  titleStrength: number;
  thumbnailStrength: number;
  audienceMatch: number;
  retentionPotential: number;
  whyItWorked: string;
  hookBreakdown: string;
  titleBreakdown: string;
  emotionalTriggers: string[];
  videoFramework: {
    hook: string;
    problem: string;
    story: string;
    proof: string;
    cta: string;
  };
  timeline: Array<{ timestamp: string; section: string; description: string }>;
  strengths: string[];
  weaknesses: string[];
  similarOpportunities: Array<{
    title: string;
    angle: string;
    hook: string;
    whyItWillWork: string;
  }>;
}

export async function analyzeVideo(video: {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  duration: string;
  publishedAt: string;
}): Promise<VideoAnalysis> {
  const engagementRate = video.viewCount > 0
    ? (((video.likeCount + video.commentCount * 2) / video.viewCount) * 100).toFixed(2)
    : "0";

  const prompt = `
You are a YouTube viral video analyst. Deeply analyze this video and return a comprehensive breakdown.

VIDEO DATA:
Title: "${video.title}"
Channel: ${video.channelTitle}
Views: ${video.viewCount.toLocaleString()}
Likes: ${video.likeCount.toLocaleString()}
Comments: ${video.commentCount.toLocaleString()}
Engagement Rate: ${engagementRate}%
Duration: ${video.duration}
Published: ${video.publishedAt}
Tags: ${video.tags.slice(0, 15).join(", ")}
Description Preview: ${video.description.slice(0, 400)}

Analyze the TITLE deeply for: curiosity gap, power words, specificity, emotional triggers, search intent.
Analyze the HOOK based on title + description: what problem does it promise to solve?
Explain WHY this video performed well (or poorly) based on the metrics.

Return this exact JSON:
{
  "viralityScore": 0-100,
  "hookStrength": 0-100,
  "titleStrength": 0-100,
  "thumbnailStrength": 0-100,
  "audienceMatch": 0-100,
  "retentionPotential": 0-100,
  "whyItWorked": "2-3 sentences explaining the core reason for performance",
  "hookBreakdown": "Specific analysis of hook technique used",
  "titleBreakdown": "Specific analysis of title formula and power words used",
  "emotionalTriggers": ["fear", "curiosity", "aspiration", "etc — list the specific triggers"],
  "videoFramework": {
    "hook": "What the first 30 seconds likely set up",
    "problem": "The core problem/pain addressed",
    "story": "The story or journey structure",
    "proof": "How credibility/proof was established",
    "cta": "Likely call to action"
  },
  "timeline": [
    { "timestamp": "0:00", "section": "Hook", "description": "What likely happens" },
    { "timestamp": "0:30", "section": "Problem Setup", "description": "What likely happens" },
    { "timestamp": "2:00", "section": "Main Content", "description": "What likely happens" },
    { "timestamp": "8:00", "section": "Proof/Results", "description": "What likely happens" },
    { "timestamp": "10:00", "section": "CTA", "description": "What likely happens" }
  ],
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["area for improvement 1", "area for improvement 2"],
  "similarOpportunities": [
    {
      "title": "new unique video title (not a copy)",
      "angle": "different angle/perspective",
      "hook": "suggested opening hook",
      "whyItWillWork": "why this opportunity exists"
    },
    { "title": "...", "angle": "...", "hook": "...", "whyItWillWork": "..." },
    { "title": "...", "angle": "...", "hook": "...", "whyItWillWork": "..." },
    { "title": "...", "angle": "...", "hook": "...", "whyItWillWork": "..." },
    { "title": "...", "angle": "...", "hook": "...", "whyItWillWork": "..." }
  ]
}
`;

  return generateJSON<VideoAnalysis>(prompt);
}

export async function findCompetitorKeywords(
  channelDNA: ChannelDNA
): Promise<string[]> {
  const prompt = `
Generate 8-10 YouTube search keywords to find competitor channels in this niche.

Primary Niche: ${channelDNA.primaryNiche}
Secondary Niche: ${channelDNA.secondaryNiche}
Content Style: ${channelDNA.contentStyle}
Topic Clusters: ${channelDNA.topicClusters.join(", ")}

Return a JSON array of search keyword strings:
["keyword 1", "keyword 2", "keyword 3"]

Make keywords specific and likely to surface competitor YouTube channels.
`;

  return generateJSON<string[]>(prompt);
}

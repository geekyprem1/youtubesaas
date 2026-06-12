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
Analyze this YouTube channel and return a JSON object with its DNA.

Channel: ${channel.name}
Subscribers: ${channel.subscribers.toLocaleString()}
Description: ${channel.description.slice(0, 500)}

Recent Videos:
${videoSummary}

Return this exact JSON structure:
{
  "primaryNiche": "string (main content niche, e.g., 'AI Tools')",
  "secondaryNiche": "string (secondary niche, e.g., 'Productivity')",
  "audienceType": "string (e.g., 'Beginners', 'Professionals', 'Students')",
  "contentStyle": "string (e.g., 'Tutorial', 'Entertainment', 'Educational', 'Review')",
  "contentFormat": "string (e.g., 'Long-form', 'Short-form', 'Mixed')",
  "topicClusters": ["array", "of", "5-8", "main", "topic", "clusters"],
  "uniqueValueProp": "string (what makes this channel unique, 1-2 sentences)",
  "toneAndVoice": "string (e.g., 'Casual and friendly', 'Professional and authoritative')"
}
`;

  return generateJSON<ChannelDNA>(prompt);
}

export async function generateVideoIdeas(
  channel: YoutubeChannel,
  channelDNA: ChannelDNA,
  topVideos: Array<{ title: string; views: number; performanceScore: number }>,
  competitors: Competitor[]
): Promise<VideoIdea[]> {
  const topVideoList = topVideos
    .slice(0, 10)
    .map((v) => `- "${v.title}" (${v.views.toLocaleString()} views, score: ${v.performanceScore})`)
    .join("\n");

  const competitorTopics = competitors
    .flatMap((c) =>
      c.topVideos.slice(0, 5).map((v) => `[${c.channelName}] "${v.title}" (${v.viewCount.toLocaleString()} views)`)
    )
    .slice(0, 50)
    .join("\n");

  const prompt = `
You are a YouTube strategy expert. Generate 20 unique, high-potential video ideas for this channel.

CHANNEL: ${channel.name}
Primary Niche: ${channelDNA.primaryNiche}
Secondary Niche: ${channelDNA.secondaryNiche}
Audience: ${channelDNA.audienceType}
Style: ${channelDNA.contentStyle}
Topic Clusters: ${channelDNA.topicClusters.join(", ")}

TOP PERFORMING VIDEOS:
${topVideoList}

COMPETITOR TOP VIDEOS (topics to analyze for opportunities):
${competitorTopics}

Generate 20 video ideas. Find topics that:
1. Competitors covered with high views but this channel hasn't covered yet
2. Align with this channel's niche and audience
3. Have high potential based on competitor performance

Return a JSON array:
[
  {
    "id": "1",
    "title": "specific, clickable video title",
    "opportunityScore": 0-100,
    "reason": "2-3 sentences explaining why this is a great opportunity",
    "expectedAudienceInterest": "High/Medium/Very High with brief explanation",
    "difficulty": "Easy/Medium/Hard",
    "estimatedPerformance": "e.g., '50K-200K views based on competitor data'",
    "topics": ["tag1", "tag2", "tag3"],
    "format": "Tutorial/Review/Analysis/etc"
  }
]
`;

  return generateJSON<VideoIdea[]>(prompt);
}

export async function generateProContent(
  videoIdea: VideoIdea,
  channelDNA: ChannelDNA,
  channel: YoutubeChannel
): Promise<ProContent> {
  const prompt = `
You are an expert YouTube content strategist. Generate complete production assets for this video idea.

Channel: ${channel.name}
Channel Niche: ${channelDNA.primaryNiche}
Audience: ${channelDNA.audienceType}
Content Style: ${channelDNA.contentStyle}

Video Idea: "${videoIdea.title}"
Opportunity Score: ${videoIdea.opportunityScore}/100
Topics: ${videoIdea.topics.join(", ")}

Return this exact JSON:
{
  "titles": ["10 unique, highly clickable title variations with different hooks"],
  "thumbnailConcepts": [
    {
      "concept": "Concept name",
      "description": "Detailed visual description",
      "colorScheme": "e.g., Dark background with bright yellow text",
      "textOverlay": "Main text on thumbnail"
    },
    {
      "concept": "Concept name 2",
      "description": "Detailed visual description",
      "colorScheme": "Color description",
      "textOverlay": "Main text on thumbnail"
    },
    {
      "concept": "Concept name 3",
      "description": "Detailed visual description",
      "colorScheme": "Color description",
      "textOverlay": "Main text on thumbnail"
    }
  ],
  "seoDescription": "Full SEO-optimized YouTube description (400-500 words)",
  "tags": ["20-25 relevant YouTube tags"],
  "videoOutline": [
    { "timestamp": "0:00", "section": "Hook", "description": "What to cover" },
    { "timestamp": "0:30", "section": "Intro", "description": "What to cover" }
  ],
  "hookScript": "A compelling 30-60 second hook script",
  "ctaSuggestions": ["5 different call-to-action suggestions"]
}
`;

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

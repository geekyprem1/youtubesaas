export interface YoutubeChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: number;
  totalVideos: number;
  totalViews: number;
  description: string;
  thumbnailUrl: string;
  country?: string;
  publishedAt: string;
}

export interface YoutubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  tags?: string[];
}

export interface ChannelDNA {
  primaryNiche: string;
  secondaryNiche: string;
  audienceType: string;
  contentStyle: string;
  contentFormat: string;
  topicClusters: string[];
  uniqueValueProp: string;
  toneAndVoice: string;
  // Structured arrays for the DNA Match Engine (scoring.ts)
  primaryTopics?: string[];
  formats?: string[];
  audience?: string[];
  tone?: string[];
  lengthBand?: "short" | "mid" | "long";
}

export interface VideoPerformance {
  videoId: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  publishedAt: string;
  thumbnailUrl: string;
  performanceScore: number;
  recencyWeight: number;
  engagementRate: number;
}

export interface Competitor {
  channelId: string;
  channelName: string;
  handle: string;
  subscribers: number;
  thumbnailUrl: string;
  similarityScore: number;
  topVideos: YoutubeVideo[];
}

export interface VideoOpportunity {
  topic: string;
  opportunityScore: number;
  trendScore: number;
  channelMatchScore: number;
  competitorsCovering: string[];
  estimatedViews: string;
  searchVolume: string;
}

export interface VideoIdea {
  id: string;
  title: string;
  opportunityScore: number;
  reason: string;
  expectedAudienceInterest: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedPerformance: string;
  topics: string[];
  format: string;
  // Deterministic scores from the DNA Match Engine (optional = older analyses)
  dnaMatchScore?: number;
  confidenceScore?: number;
  trendScore?: number;
  competitionScore?: number;
  opportunityType?: "Emerging" | "Rising" | "Validated" | "Saturated";
  whyBullets?: string[];
  alternativeAngles?: string[];
  confidenceBreakdown?: { dnaMatch: number; competitorSuccess: number; trend: number; audienceFit: number };
}

export interface ProContent {
  titles: string[];
  thumbnailConcepts: ThumbnailConcept[];
  seoDescription: string;
  tags: string[];
  videoOutline: OutlineSection[];
  hookScript: string;
  ctaSuggestions: string[];
}

export interface ThumbnailConcept {
  concept: string;
  description: string;
  colorScheme: string;
  textOverlay: string;
}

export interface OutlineSection {
  timestamp: string;
  section: string;
  description: string;
}

export interface Analysis {
  id: string;
  userId: string;
  channelId: string;
  channel: YoutubeChannel;
  channelDna: ChannelDNA;
  topVideos: VideoPerformance[];
  competitors: Competitor[];
  opportunities: VideoOpportunity[];
  videoIdeas: VideoIdea[];
  status: "pending" | "analyzing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  plan: "free" | "pro";
  dailyAnalysesUsed: number;
  dailyAnalysesLimit: number;
  totalAnalyses: number;
  createdAt: string;
}

export interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  status: "pending" | "running" | "completed" | "failed";
}

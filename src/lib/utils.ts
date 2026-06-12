import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return `${(num / 1_000_000_000).toFixed(1)}B`;
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

export function extractChannelIdentifier(url: string): {
  type: "handle" | "channelId" | "username" | "invalid";
  value: string;
} {
  const cleaned = url.trim();

  const handleMatch = cleaned.match(/youtube\.com\/@([\w.-]+)/);
  if (handleMatch) return { type: "handle", value: handleMatch[1] };

  const channelMatch = cleaned.match(/youtube\.com\/channel\/(UC[\w-]+)/);
  if (channelMatch) return { type: "channelId", value: channelMatch[1] };

  const userMatch = cleaned.match(/youtube\.com\/user\/([\w.-]+)/);
  if (userMatch) return { type: "username", value: userMatch[1] };

  if (cleaned.startsWith("UC") && cleaned.length === 24) {
    return { type: "channelId", value: cleaned };
  }

  if (cleaned.startsWith("@")) {
    return { type: "handle", value: cleaned.slice(1) };
  }

  if (!cleaned.includes("/") && !cleaned.includes(".")) {
    return { type: "handle", value: cleaned };
  }

  return { type: "invalid", value: cleaned };
}

export function calculatePerformanceScore(
  views: number,
  likes: number,
  comments: number,
  publishedAt: string,
  avgViews: number
): number {
  const recencyDays = Math.floor(
    (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24)
  );
  const recencyWeight = Math.max(0, 1 - recencyDays / 365);
  const engagementRate = views > 0 ? (likes + comments * 2) / views : 0;
  const viewsRatio = avgViews > 0 ? views / avgViews : 0;

  const score =
    viewsRatio * 40 +
    engagementRate * 1000 * 30 +
    recencyWeight * 30;

  return Math.min(100, Math.round(score));
}

export function scoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function difficultyColor(difficulty: string): string {
  switch (difficulty) {
    case "Easy": return "text-green-400 bg-green-400/10";
    case "Medium": return "text-yellow-400 bg-yellow-400/10";
    case "Hard": return "text-red-400 bg-red-400/10";
    default: return "text-muted-foreground";
  }
}

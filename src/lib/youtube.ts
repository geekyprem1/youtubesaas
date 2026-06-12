import type { YoutubeChannel, YoutubeVideo } from "@/types";

const YT_BASE = "https://www.googleapis.com/youtube/v3";

function apiKey() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) throw new Error("YOUTUBE_API_KEY is not set");
  return key;
}

export async function resolveChannelId(
  type: "handle" | "channelId" | "username",
  value: string
): Promise<string> {
  if (type === "channelId") return value;

  const param =
    type === "handle"
      ? `forHandle=%40${encodeURIComponent(value)}`
      : `forUsername=${encodeURIComponent(value)}`;

  const res = await fetch(
    `${YT_BASE}/channels?part=id&${param}&key=${apiKey()}`
  );
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel not found for ${type}: ${value}`);
  }

  return data.items[0].id;
}

export async function fetchChannelData(channelId: string): Promise<YoutubeChannel> {
  const res = await fetch(
    `${YT_BASE}/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey()}`
  );
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error(`Channel not found: ${channelId}`);
  }

  const ch = data.items[0];
  const sn = ch.snippet;
  const st = ch.statistics;

  return {
    id: ch.id,
    name: sn.title,
    handle: sn.customUrl || "",
    subscribers: parseInt(st.subscriberCount || "0"),
    totalVideos: parseInt(st.videoCount || "0"),
    totalViews: parseInt(st.viewCount || "0"),
    description: sn.description || "",
    thumbnailUrl:
      sn.thumbnails?.high?.url ||
      sn.thumbnails?.medium?.url ||
      sn.thumbnails?.default?.url ||
      "",
    country: sn.country,
    publishedAt: sn.publishedAt,
  };
}

export async function fetchChannelVideos(
  channelId: string,
  maxResults = 50
): Promise<YoutubeVideo[]> {
  // Get uploads playlist ID
  const chRes = await fetch(
    `${YT_BASE}/channels?part=contentDetails&id=${channelId}&key=${apiKey()}`
  );
  const chData = await chRes.json();

  if (!chData.items || chData.items.length === 0) {
    throw new Error("Could not get channel content details");
  }

  const uploadsPlaylistId =
    chData.items[0].contentDetails.relatedPlaylists.uploads;

  // Fetch playlist items
  const videoIds: string[] = [];
  let pageToken = "";

  while (videoIds.length < maxResults) {
    const url =
      `${YT_BASE}/playlistItems?part=contentDetails&playlistId=${uploadsPlaylistId}` +
      `&maxResults=50${pageToken ? `&pageToken=${pageToken}` : ""}&key=${apiKey()}`;

    const plRes = await fetch(url);
    const plData = await plRes.json();

    if (!plData.items) break;

    plData.items.forEach((item: { contentDetails: { videoId: string } }) => {
      if (videoIds.length < maxResults) {
        videoIds.push(item.contentDetails.videoId);
      }
    });

    if (!plData.nextPageToken || videoIds.length >= maxResults) break;
    pageToken = plData.nextPageToken;
  }

  if (videoIds.length === 0) return [];

  // Fetch video details in batches of 50
  const videos: YoutubeVideo[] = [];

  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50).join(",");
    const vidRes = await fetch(
      `${YT_BASE}/videos?part=snippet,statistics,contentDetails&id=${batch}&key=${apiKey()}`
    );
    const vidData = await vidRes.json();

    if (vidData.items) {
      vidData.items.forEach((v: {
        id: string;
        snippet: {
          title: string;
          description: string;
          publishedAt: string;
          tags?: string[];
          thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
        };
        statistics: {
          viewCount?: string;
          likeCount?: string;
          commentCount?: string;
        };
        contentDetails: { duration: string };
      }) => {
        videos.push({
          id: v.id,
          title: v.snippet.title,
          description: v.snippet.description,
          thumbnailUrl:
            v.snippet.thumbnails?.high?.url ||
            v.snippet.thumbnails?.medium?.url ||
            v.snippet.thumbnails?.default?.url ||
            "",
          publishedAt: v.snippet.publishedAt,
          viewCount: parseInt(v.statistics.viewCount || "0"),
          likeCount: parseInt(v.statistics.likeCount || "0"),
          commentCount: parseInt(v.statistics.commentCount || "0"),
          duration: v.contentDetails.duration,
          tags: v.snippet.tags,
        });
      });
    }
  }

  return videos;
}

export async function searchCompetitorChannels(
  keywords: string[],
  excludeChannelId: string,
  maxResults = 10
): Promise<string[]> {
  const query = keywords.slice(0, 3).join(" ");
  const res = await fetch(
    `${YT_BASE}/search?part=snippet&type=channel&q=${encodeURIComponent(query)}&maxResults=20&key=${apiKey()}`
  );
  const data = await res.json();

  if (!data.items) return [];

  const channelIds = data.items
    .filter((item: { id: { channelId: string } }) => item.id.channelId !== excludeChannelId)
    .map((item: { id: { channelId: string } }) => item.id.channelId)
    .slice(0, maxResults);

  return channelIds;
}

export async function fetchMultipleChannels(
  channelIds: string[]
): Promise<YoutubeChannel[]> {
  if (channelIds.length === 0) return [];

  const ids = channelIds.join(",");
  const res = await fetch(
    `${YT_BASE}/channels?part=snippet,statistics&id=${ids}&key=${apiKey()}`
  );
  const data = await res.json();

  if (!data.items) return [];

  return data.items.map((ch: {
    id: string;
    snippet: {
      title: string;
      customUrl?: string;
      description: string;
      publishedAt: string;
      country?: string;
      thumbnails?: { high?: { url: string }; medium?: { url: string }; default?: { url: string } };
    };
    statistics: {
      subscriberCount?: string;
      videoCount?: string;
      viewCount?: string;
    };
  }) => ({
    id: ch.id,
    name: ch.snippet.title,
    handle: ch.snippet.customUrl || "",
    subscribers: parseInt(ch.statistics.subscriberCount || "0"),
    totalVideos: parseInt(ch.statistics.videoCount || "0"),
    totalViews: parseInt(ch.statistics.viewCount || "0"),
    description: ch.snippet.description,
    thumbnailUrl:
      ch.snippet.thumbnails?.high?.url ||
      ch.snippet.thumbnails?.medium?.url ||
      ch.snippet.thumbnails?.default?.url ||
      "",
    country: ch.snippet.country,
    publishedAt: ch.snippet.publishedAt,
  }));
}

export async function fetchCompetitorTopVideos(
  channelId: string,
  maxResults = 10
): Promise<YoutubeVideo[]> {
  try {
    const videos = await fetchChannelVideos(channelId, 30);
    return videos
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, maxResults);
  } catch {
    return [];
  }
}

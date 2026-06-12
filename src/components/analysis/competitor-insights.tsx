import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { Users, ExternalLink } from "lucide-react";

interface Competitor {
  channel_id: string;
  channel_name: string;
  handle: string;
  subscribers: number;
  thumbnail_url: string;
  similarity_score: number;
  top_videos: Array<{ id: string; title: string; viewCount: number }>;
}

interface Props {
  competitors: Competitor[];
}

export function CompetitorInsights({ competitors }: Props) {
  if (!competitors?.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {competitors.map((c) => (
        <div key={c.channel_id} className="glass rounded-xl p-5">
          <div className="flex items-center gap-3 mb-4">
            {c.thumbnail_url ? (
              <Image
                src={c.thumbnail_url}
                alt={c.channel_name}
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-11 h-11 rounded-full bg-secondary" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{c.channel_name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Users className="w-3 h-3" />
                {formatNumber(c.subscribers)} subscribers
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-sm font-bold text-accent">{c.similarity_score}%</div>
              <div className="text-xs text-muted-foreground">similar</div>
            </div>
          </div>

          {c.top_videos?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Top Videos</p>
              {c.top_videos.slice(0, 3).map((v) => (
                <a
                  key={v.id}
                  href={`https://youtube.com/watch?v=${v.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group text-xs hover:bg-secondary/40 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-muted-foreground shrink-0" />
                  <span className="text-white/80 line-clamp-1 flex-1 group-hover:text-white">{v.title}</span>
                  <span className="text-muted-foreground shrink-0">{formatNumber(v.viewCount)}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

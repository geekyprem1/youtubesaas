import Image from "next/image";
import { formatNumber } from "@/lib/utils";
import { Users, Video, Eye, Globe } from "lucide-react";

interface Props {
  channel: Record<string, string | number>;
  channelDNA: {
    primaryNiche: string;
    secondaryNiche: string;
    audienceType: string;
    contentStyle: string;
  };
}

export function ChannelOverview({ channel, channelDNA }: Props) {
  if (!channel) return null;

  const stats = [
    { icon: Users, label: "Subscribers", value: formatNumber(Number(channel.subscribers)) },
    { icon: Video, label: "Videos", value: formatNumber(Number(channel.total_videos)) },
    { icon: Eye, label: "Total Views", value: formatNumber(Number(channel.total_views)) },
    { icon: Globe, label: "Country", value: (channel.country as string) || "Global" },
  ];

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {channel.thumbnail_url && (
          <Image
            src={channel.thumbnail_url as string}
            alt={channel.name as string}
            width={80}
            height={80}
            className="rounded-2xl object-cover shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-white">{channel.name}</h1>
              {channel.handle && (
                <p className="text-muted-foreground text-sm mt-0.5">{channel.handle}</p>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-accent text-xs font-semibold">
                {channelDNA?.primaryNiche}
              </span>
              {channelDNA?.secondaryNiche && (
                <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground text-xs font-semibold">
                  {channelDNA.secondaryNiche}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-secondary/40 rounded-xl p-3">
                  <Icon className="w-4 h-4 text-accent mb-1" />
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

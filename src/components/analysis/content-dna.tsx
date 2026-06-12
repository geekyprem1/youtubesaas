import { Brain, Users, Palette, Layout, Tag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChannelDNA {
  primaryNiche: string;
  secondaryNiche: string;
  audienceType: string;
  contentStyle: string;
  contentFormat: string;
  topicClusters: string[];
  uniqueValueProp: string;
  toneAndVoice: string;
}

interface Props {
  channelDNA: ChannelDNA;
}

const dnaFields = [
  { key: "primaryNiche", label: "Primary Niche", icon: Brain, color: "text-purple-400" },
  { key: "secondaryNiche", label: "Secondary Niche", icon: Tag, color: "text-blue-400" },
  { key: "audienceType", label: "Audience Type", icon: Users, color: "text-green-400" },
  { key: "contentStyle", label: "Content Style", icon: Palette, color: "text-yellow-400" },
  { key: "contentFormat", label: "Content Format", icon: Layout, color: "text-orange-400" },
  { key: "toneAndVoice", label: "Tone & Voice", icon: Star, color: "text-pink-400" },
];

export function ContentDNA({ channelDNA }: Props) {
  if (!channelDNA) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dnaFields.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-xs text-muted-foreground font-medium">{label}</span>
            </div>
            <p className="text-white font-semibold text-sm">
              {channelDNA[key as keyof ChannelDNA] as string}
            </p>
          </div>
        ))}
      </div>

      {channelDNA.uniqueValueProp && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Unique Value Proposition</h3>
          <p className="text-white leading-relaxed">{channelDNA.uniqueValueProp}</p>
        </div>
      )}

      {channelDNA.topicClusters?.length > 0 && (
        <div className="glass rounded-xl p-5">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Topic Clusters</h3>
          <div className="flex flex-wrap gap-2">
            {channelDNA.topicClusters.map((topic: string) => (
              <Badge key={topic} variant="purple">{topic}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

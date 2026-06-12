"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Brain, Users, Palette, Layout, Tag, Star } from "lucide-react";

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

const fields = [
  { key: "primaryNiche", label: "Primary Niche", icon: Brain, color: "text-purple-400" },
  { key: "secondaryNiche", label: "Secondary Niche", icon: Tag, color: "text-blue-400" },
  { key: "audienceType", label: "Audience", icon: Users, color: "text-green-400" },
  { key: "contentStyle", label: "Style", icon: Palette, color: "text-yellow-400" },
  { key: "contentFormat", label: "Format", icon: Layout, color: "text-orange-400" },
  { key: "toneAndVoice", label: "Tone", icon: Star, color: "text-pink-400" },
];

export function ContentDNACollapsed({ channelDNA }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden border border-border/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full bg-muted-foreground/40" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            Channel DNA — Supporting Info
          </span>
          <span className="text-xs text-muted-foreground/60 ml-2">
            (not required for action)
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="overflow-hidden border-t border-border/40"
          >
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {fields.map(({ key, label, icon: Icon, color }) => (
                  <div key={key} className="bg-secondary/30 rounded-xl p-3 text-center">
                    <Icon className={`w-4 h-4 ${color} mx-auto mb-1.5`} />
                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                    <p className="text-xs font-semibold text-white leading-tight">
                      {channelDNA[key as keyof ChannelDNA] as string}
                    </p>
                  </div>
                ))}
              </div>

              {channelDNA.uniqueValueProp && (
                <div className="bg-secondary/20 rounded-xl p-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">Unique Value Proposition</p>
                  <p className="text-sm text-white/70">{channelDNA.uniqueValueProp}</p>
                </div>
              )}

              {channelDNA.topicClusters?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {channelDNA.topicClusters.map((t: string) => (
                    <span key={t} className="px-2.5 py-1 rounded-full bg-primary/10 text-accent text-xs border border-primary/15">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

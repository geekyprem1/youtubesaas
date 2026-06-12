"use client";

import { useState, useEffect } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, CrownIcon, Copy, Check } from "lucide-react";
import Link from "next/link";
import type { ProContent } from "@/types";

interface VideoIdea {
  id: string;
  title: string;
  opportunityScore: number;
  topics: string[];
}

interface Props {
  idea: VideoIdea;
  channelDNA: Record<string, unknown>;
  channel: Record<string, string | number>;
  plan: "free" | "pro";
  onClose: () => void;
}

export function ProContentModal({ idea, channelDNA, channel, plan, onClose }: Props) {
  const [content, setContent] = useState<ProContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (plan !== "pro") return;
    setLoading(true);
    fetch("/api/pro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoIdea: idea, channelDNA, channel }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setContent(d);
      })
      .catch(() => setError("Failed to generate content"))
      .finally(() => setLoading(false));
  }, [idea, channelDNA, channel, plan]);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pr-6 leading-snug">{idea.title}</DialogTitle>
        </DialogHeader>
        <DialogBody className="pt-4">
          {plan !== "pro" ? (
            <div className="text-center py-8">
              <CrownIcon className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">Pro Feature</h3>
              <p className="text-muted-foreground mb-6 text-sm">
                Upgrade to Pro to get 10 titles, 3 thumbnail concepts, SEO description, video outline, hook script, and CTA suggestions for every idea.
              </p>
              <Button variant="gradient" size="lg" className="gap-2 glow-purple" asChild>
                <Link href="/pricing">
                  <CrownIcon className="w-4 h-4" />
                  Upgrade to Pro — $19/mo
                </Link>
              </Button>
            </div>
          ) : loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-muted-foreground text-sm">Generating your content pack...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">{error}</div>
          ) : content ? (
            <Tabs defaultValue="titles">
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger value="titles">Titles</TabsTrigger>
                <TabsTrigger value="thumbnails">Thumbnails</TabsTrigger>
                <TabsTrigger value="outline">Outline</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
              </TabsList>

              <TabsContent value="titles" className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">10 clickable title variations</p>
                {content.titles.map((title, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-secondary/40 rounded-xl group">
                    <span className="text-xs text-muted-foreground w-5 shrink-0 mt-0.5">{i + 1}.</span>
                    <span className="text-sm text-white flex-1">{title}</span>
                    <button
                      onClick={() => copyText(title, `title-${i}`)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {copied === `title-${i}` ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-white" />
                      )}
                    </button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="thumbnails" className="space-y-4">
                {content.thumbnailConcepts.map((t, i) => (
                  <div key={i} className="p-4 bg-secondary/40 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{t.concept}</span>
                      <Badge variant="purple" className="text-xs">{t.colorScheme}</Badge>
                    </div>
                    <p className="text-sm text-white/70 mb-2">{t.description}</p>
                    <div className="text-xs bg-muted/40 rounded-lg px-3 py-2 text-accent font-mono">
                      Text: &quot;{t.textOverlay}&quot;
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="outline" className="space-y-3">
                <div className="p-4 bg-secondary/40 rounded-xl mb-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2">HOOK SCRIPT</p>
                  <p className="text-sm text-white/80 leading-relaxed whitespace-pre-line">{content.hookScript}</p>
                </div>
                {content.videoOutline.map((section, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-secondary/40 rounded-xl">
                    <span className="text-xs text-accent font-mono w-12 shrink-0 mt-0.5">{section.timestamp}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{section.section}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{section.description}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="seo" className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">SEO DESCRIPTION</p>
                  <div className="relative">
                    <p className="text-sm text-white/80 bg-secondary/40 rounded-xl p-4 leading-relaxed whitespace-pre-line">
                      {content.seoDescription}
                    </p>
                    <button
                      className="absolute top-2 right-2"
                      onClick={() => copyText(content.seoDescription, "desc")}
                    >
                      {copied === "desc" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">TAGS</p>
                  <div className="flex flex-wrap gap-1.5">
                    {content.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">CTA SUGGESTIONS</p>
                  {content.ctaSuggestions.map((cta, i) => (
                    <p key={i} className="text-sm text-white/80 py-2 border-b border-border/40 last:border-0">
                      {i + 1}. {cta}
                    </p>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : null}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

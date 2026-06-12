"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Plus, Trash2, ChevronLeft, ChevronRight, Flame, Clock, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SavedIdea {
  id: string;
  title: string;
  score: number;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedViews: string;
  day: string | null; // ISO date string or null
  badge: string;
}

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(offset = 0): Date[] {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday
  const monday = new Date(now);
  monday.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1) + offset * 7);
  return DAYS_OF_WEEK.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function formatDay(d: Date): string {
  return d.toISOString().split("T")[0];
}

const BADGE_ICONS: Record<string, string> = {
  "🔥 Make This Now": "🔥",
  "⚡ Rising Fast": "⚡",
  "📈 High Potential": "📈",
  "💎 Hidden": "💎",
};

export default function CalendarPage() {
  const [ideas, setIdeas] = useState<SavedIdea[]>([]);
  const [weekOffset, setWeekOffset] = useState(0);
  const [dragging, setDragging] = useState<string | null>(null);
  const weekDates = getWeekDates(weekOffset);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("uploadiq_calendar");
      if (saved) setIdeas(JSON.parse(saved));
    } catch {}
  }, []);

  function save(updated: SavedIdea[]) {
    setIdeas(updated);
    localStorage.setItem("uploadiq_calendar", JSON.stringify(updated));
  }

  function removeIdea(id: string) {
    save(ideas.filter(i => i.id !== id));
  }

  function scheduleIdea(ideaId: string, day: string | null) {
    save(ideas.map(i => i.id === ideaId ? { ...i, day } : i));
  }

  function handleDrop(e: React.DragEvent, day: string) {
    e.preventDefault();
    if (dragging) scheduleIdea(dragging, day);
    setDragging(null);
  }

  const unscheduled = ideas.filter(i => !i.day);
  const diffColor = (d: string) => d === "Easy" ? "text-green-400" : d === "Medium" ? "text-yellow-400" : "text-red-400";

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Calendar className="w-5 h-5 text-accent" />
            <h1 className="text-2xl font-black text-white">Content Calendar</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Schedule your saved ideas. Drag ideas to days to build your upload plan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.04] transition-colors">
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button onClick={() => setWeekOffset(0)}
            className="px-3 py-1.5 text-xs text-muted-foreground border border-white/[0.08] rounded-lg hover:bg-white/[0.04] transition-colors">
            This Week
          </button>
          <button onClick={() => setWeekOffset(w => w + 1)}
            className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.04] transition-colors">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date, i) => {
          const dayStr = formatDay(date);
          const isToday = dayStr === formatDay(new Date());
          const dayIdeas = ideas.filter(id => id.day === dayStr);

          return (
            <div
              key={dayStr}
              onDragOver={e => e.preventDefault()}
              onDrop={e => handleDrop(e, dayStr)}
              className={`min-h-36 rounded-xl border p-2.5 transition-all ${
                isToday
                  ? "border-primary/40 bg-primary/8"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.12]"
              }`}
            >
              <div className="mb-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? "text-accent" : "text-muted-foreground"}`}>
                  {DAYS_OF_WEEK[i]}
                </p>
                <p className={`text-sm font-black ${isToday ? "text-white" : "text-white/50"}`}>
                  {date.getDate()}
                </p>
              </div>

              <AnimatePresence>
                {dayIdeas.map(idea => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    draggable
                    onDragStart={() => setDragging(idea.id)}
                    className="mb-1.5 p-2 rounded-lg border border-primary/20 cursor-grab active:cursor-grabbing group"
                    style={{ background: "rgba(124,58,237,0.1)" }}
                  >
                    <p className="text-[10px] text-white leading-snug font-medium line-clamp-2 mb-1">{idea.title}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-[9px] font-bold ${diffColor(idea.difficulty)}`}>{idea.difficulty}</span>
                      <button onClick={() => scheduleIdea(idea.id, null)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-2.5 h-2.5 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {dayIdeas.length === 0 && (
                <div className="flex items-center justify-center h-12 border-2 border-dashed border-white/[0.06] rounded-lg">
                  <Plus className="w-3.5 h-3.5 text-white/[0.15]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unscheduled ideas pool */}
      {unscheduled.length > 0 ? (
        <div className="glass rounded-2xl p-5">
          <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">
            Ideas Queue — drag to schedule
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {unscheduled.map(idea => (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                draggable
                onDragStart={() => setDragging(idea.id)}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.07] cursor-grab active:cursor-grabbing hover:border-primary/30 transition-all group"
                style={{ background: "rgba(255,255,255,0.025)" }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
                  <span className="text-sm">{BADGE_ICONS[idea.badge] ?? "💡"}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-1">{idea.title}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${diffColor(idea.difficulty)}`}>{idea.difficulty}</span>
                    <span className="text-[10px] text-muted-foreground">{idea.estimatedViews}</span>
                  </div>
                </div>
                <button onClick={() => removeIdea(idea.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl p-10 text-center">
          <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No ideas saved yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Save ideas from your analysis results to schedule them here.
          </p>
          <Button variant="gradient" className="gap-2" asChild>
            <a href="/dashboard">Start New Analysis</a>
          </Button>
        </div>
      )}
    </div>
  );
}

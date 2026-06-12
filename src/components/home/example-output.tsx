"use client";
import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Users, Zap } from "lucide-react";
export function ExampleOutput() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Real Example Output</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">See What UploadIQ <span className="gradient-text">Actually Finds</span></h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">This is what your dashboard looks like after a 90-second analysis.</p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(13,17,23,0.98) 60%)", border: "1px solid rgba(124,58,237,0.3)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-orange-400 border border-orange-400/20 bg-orange-400/10 px-2 py-0.5 rounded-full">🔥 #1 Recommendation</span>
              <span className="text-[10px] font-bold text-green-400 border border-green-400/20 bg-green-400/10 px-2 py-0.5 rounded-full">Low Competition</span>
            </div>
            <h3 className="text-xl font-black text-white mb-1 leading-tight">Claude Code Beginner Guide: Build Your First App in 30 Minutes</h3>
            <p className="text-sm text-muted-foreground mb-5">AI coding tutorial</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[{label:"Confidence",value:"90%",color:"text-accent"},{label:"Est. Views",value:"70K-150K",color:"text-green-400"},{label:"Trend",value:"+340%",color:"text-blue-400"},{label:"Competition",value:"Low",color:"text-green-400"}].map((m)=>(
                <div key={m.label} className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-2.5 text-center">
                  <p className={'text-sm font-black '+m.color}>{m.value}</p>
                  <p className="text-[9px] text-muted-foreground mt-0.5">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-green-400/5 border border-green-400/15 p-4">
              <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-2">Why This Will Work</p>
              {["Competitors generated 2.1M combined views on this topic","Matches your top 3 performing content patterns","Audience demand increasing week over week","Only 12 videos exist on this angle — huge gap"].map((r)=>(
                <div key={r} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-white/70">{r}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="space-y-4">
            {[{rank:"#2",title:"MCP Servers Explained: The Future of AI Tools",confidence:87,views:"40K-90K",trend:"+280%"},{rank:"#3",title:"Vibe Coding My First App: Full Timelapse",confidence:83,views:"30K-70K",trend:"+180%"},{rank:"#4",title:"I Built a SaaS in 24 Hours Using Claude Code",confidence:79,views:"25K-60K",trend:"+145%"}].map((card,i)=>(
              <motion.div key={card.rank} initial={{opacity:0,x:20}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.08}} className="glass rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xs font-black text-white/40 w-6 shrink-0">{card.rank}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white leading-snug mb-1">{card.title}</p>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-400 font-bold">{card.views}</span>
                      <span className="text-blue-400 flex items-center gap-1"><TrendingUp className="w-3 h-3"/>{card.trend}</span>
                      <span className="text-white/40">{card.confidence}% conf.</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground">+ 16 more ideas ranked by opportunity score</p>
              <p className="text-xs text-accent font-semibold mt-1">Each with confidence score, view range and execution plan</p>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1"><Users className="w-3.5 h-3.5 text-muted-foreground"/><p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Competitor Intelligence</p></div>
              <p className="text-xs text-white/60">10 competitor channels analyzed · Top videos surfaced · Gaps identified</p>
            </div>
          </div>
        </div>
        <motion.div initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="text-center mt-10">
          <p className="text-sm text-muted-foreground mb-4">Specific, data-backed, ready to film — generated for your channel in 90 seconds.</p>
          <a href="/signup" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-purple text-white font-bold text-sm hover:opacity-90 transition-opacity">
            Get My Free Analysis <Zap className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

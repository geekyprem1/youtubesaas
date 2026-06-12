"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, CrownIcon, Zap } from "lucide-react";
import Link from "next/link";
const plans = [
  { name: "Free", price: "$0", period: "forever", tagline: "Start discovering opportunities today", features: ["3 analyses per day","Full 6-step AI pipeline","20 video ideas per analysis","Competitor gap detection","Confidence scores + view ranges","Opportunity Radar access"], cta: "Start For Free", href: "/signup", highlight: false },
  { name: "Pro", price: "$19", period: "per month", tagline: "For creators serious about growth", features: ["Unlimited analyses","Everything in Free","10 title variations per idea","3 thumbnail concepts","SEO description + tags","Hook script + video outline","Full execution plan","Priority processing"], cta: "Start Growing Today", href: "/signup?plan=pro", highlight: true },
];
export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">One winning video pays for <span className="gradient-text">a full year</span></h2>
          <p className="text-xl text-muted-foreground max-w-lg mx-auto">Less than the cost of one failed upload. Start free — upgrade when you are ready to go all in.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className={'relative rounded-2xl p-8 '+(plan.highlight?'bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/40':'glass border border-border/60')}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-purple text-white text-xs font-bold">
                    <CrownIcon className="w-3 h-3" />Most Popular
                  </div>
                </div>
              )}
              <div className="mb-2">
                <h3 className="text-lg font-bold text-white mb-0.5">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.tagline}</p>
              </div>
              {plan.highlight && (
                <div className="my-4 py-3 px-4 rounded-xl bg-green-400/8 border border-green-400/15">
                  <p className="text-xs text-green-400 font-semibold flex items-center gap-1.5"><Zap className="w-3 h-3" />One winning video can return 50x the cost of a year of Pro.</p>
                </div>
              )}
              <ul className="space-y-3 mb-8 mt-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </ul>
              <Button variant={plan.highlight?'gradient':'outline'} size="lg" className={'w-full '+(plan.highlight?'glow-purple font-bold':'')} asChild>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center text-sm text-muted-foreground mt-8">
          No contracts. Cancel anytime. Your data stays private.
        </motion.p>
      </div>
    </section>
  );
}

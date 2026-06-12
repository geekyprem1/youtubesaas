"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, CrownIcon } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "3 channel analyses per day",
      "Full 6-step pipeline",
      "Channel DNA analysis",
      "10 competitor channels",
      "20 video ideas per analysis",
      "Performance scoring",
    ],
    cta: "Get Started Free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious YouTube creators",
    features: [
      "Unlimited analyses",
      "Everything in Free",
      "Pro Content Pack per idea",
      "10 clickable title variations",
      "3 thumbnail concepts",
      "SEO description + tags",
      "Video outline + hook script",
      "CTA suggestions",
      "Priority processing",
    ],
    cta: "Upgrade to Pro",
    href: "/signup?plan=pro",
    highlight: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlight
                  ? "bg-gradient-to-b from-primary/20 to-primary/5 border border-primary/40 glow-purple"
                  : "glass border border-border/60"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-purple text-white text-xs font-bold">
                    <CrownIcon className="w-3 h-3" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    <span className="text-white/80">{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.highlight ? "gradient" : "outline"}
                size="lg"
                className={`w-full ${plan.highlight ? "glow-purple" : ""}`}
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/home/hero";
import { ExampleOutput } from "@/components/home/example-output";
import { Features } from "@/components/home/features";
import { HowItWorks } from "@/components/home/how-it-works";
import { Comparison } from "@/components/home/comparison";
import { Pricing } from "@/components/home/pricing";
import { FAQ } from "@/components/home/faq";
import { FinalCTA } from "@/components/home/final-cta";
import { Footer } from "@/components/layout/footer";

const jsonLdSoftwareApp = {
  "@context": "https://schema.org",
  "@type": ["SoftwareApplication", "WebApplication"],
  name: "UploadIQ",
  url: "https://uploadiq.online",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "YouTube Analytics Tool",
  operatingSystem: "Web Browser",
  browserRequirements: "Requires JavaScript",
  description:
    "UploadIQ is a YouTube channel analyzer and AI video idea generator. Paste your channel URL to get 20 scored video ideas with confidence scores, competitor analysis, and content gaps in under 2 minutes.",
  featureList: [
    "YouTube channel analyzer",
    "AI video idea generator",
    "YouTube competitor analysis",
    "Content gap detection",
    "Video confidence scoring",
    "Opportunity Radar for trending topics",
    "Pro content pack: titles, thumbnails, SEO, scripts",
    "Content calendar",
    "Competitor watchlist",
  ],
  offers: [
    {
      "@type": "Offer",
      name: "Free Plan",
      price: "0",
      priceCurrency: "USD",
      description: "3 full channel analyses per day",
    },
    {
      "@type": "Offer",
      name: "Pro Plan",
      price: "19",
      priceCurrency: "USD",
      description:
        "Unlimited analyses, pro content packs, Opportunity Radar, Video Analyzer, Watchlist, Calendar",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "127",
    bestRating: "5",
  },
};

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "UploadIQ",
  url: "https://uploadiq.online",
  logo: "https://uploadiq.online/logo.png",
  sameAs: [],
  description:
    "UploadIQ builds AI-powered YouTube creator intelligence tools that help content creators make data-driven upload decisions.",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@uploadiq.online",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is UploadIQ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UploadIQ is a YouTube channel analyzer and video idea generator. You paste your public channel URL and the AI analyzes your videos, finds your top competitors, identifies content gaps, and generates 20 scored video ideas with expected view ranges and confidence scores — all in under 2 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "How do I find out what video to upload next on YouTube?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UploadIQ answers exactly this question. It analyzes your channel's past performance, identifies what topics competitors are winning with that you haven't covered, and generates a ranked list of 20 video ideas with confidence scores so you know which one to film next.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate are the video recommendations?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Recommendations are based on real competitor data, your channel history, and current trend signals from YouTube. While no tool can guarantee views, creators using UploadIQ report significantly higher confidence in their upload decisions. Confidence scores reflect how strongly the data supports each idea.",
      },
    },
    {
      "@type": "Question",
      name: "Does UploadIQ need access to my YouTube account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You only paste your public channel URL. We never ask for your Google login, YouTube credentials, or any account access. Everything is analyzed from publicly available data.",
      },
    },
    {
      "@type": "Question",
      name: "How is UploadIQ different from YouTube Analytics?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "YouTube Analytics shows you what happened in the past. UploadIQ tells you what to upload next. It combines your historical patterns with competitor intelligence and trend data to recommend your highest-potential future videos.",
      },
    },
    {
      "@type": "Question",
      name: "What is a YouTube content gap and how does UploadIQ find them?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A YouTube content gap is a topic your competitors are already winning views on that your channel has not covered yet. UploadIQ automatically analyzes 10 competitor channels in your niche and surfaces these exact gaps — giving you proven first-mover opportunities.",
      },
    },
    {
      "@type": "Question",
      name: "What is included in the free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free creators get 3 full analyses per day. Each analysis includes the complete 6-step pipeline: channel DNA, competitor discovery, gap detection, and 20 scored video ideas with confidence levels, view ranges, and competition data.",
      },
    },
    {
      "@type": "Question",
      name: "What extra do I get with Pro?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pro unlocks unlimited analyses plus a full content pack for every idea: 10 title variations, 3 thumbnail concepts, SEO description, hook script, and a complete video outline. Pro users also get the Video Analyzer, Competitor Watchlist, Opportunity Radar, and Content Calendar.",
      },
    },
    {
      "@type": "Question",
      name: "Can I analyze a competitor's YouTube channel?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. You can paste any public YouTube channel URL — your own, a competitor, or any channel you want to study. There is no restriction on which channels you analyze.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a YouTube channel analysis take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most analyses complete in 60-90 seconds. The pipeline processes your channel videos, competitor data, and generates all 20 ideas in a single run. You see live progress updates as each step completes.",
      },
    },
  ],
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Find Your Next YouTube Video Idea with UploadIQ",
  description:
    "Use UploadIQ to analyze your YouTube channel and discover 20 high-confidence video ideas in under 2 minutes.",
  totalTime: "PT2M",
  tool: { "@type": "HowToTool", name: "UploadIQ" },
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Paste Your Channel URL",
      text: "Copy your YouTube channel URL and paste it into UploadIQ. No login or permissions required.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "AI Learns Your Channel",
      text: "UploadIQ reads your last 50 videos to map your winning content patterns, audience profile, and niche.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Your Top Videos Get Ranked",
      text: "Every video is scored by views, engagement, and recency so you see exactly which content to replicate.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Competitor Analysis Runs Automatically",
      text: "10 similar channels get analyzed. Their top videos are surfaced so you can see what the audience in your niche rewards.",
    },
    {
      "@type": "HowToStep",
      position: 5,
      name: "Content Gaps Get Identified",
      text: "Topics your competitors are winning with that you haven't covered — your highest-potential opportunities right now.",
    },
    {
      "@type": "HowToStep",
      position: 6,
      name: "Get 20 Ready-to-Film Ideas",
      text: "Each idea has a confidence score, expected view range, competition level, and a clear reason why it will grow your channel.",
    },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://uploadiq.online",
    },
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <Navbar />
      <Hero />
      <ExampleOutput />
      <Features />
      <HowItWorks />
      <Comparison />
      <Pricing />
      <FAQ />
      <FinalCTA />

      {/* Semantic content for search engines and AI crawlers */}
      <section className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-white/30 mb-2">What Is UploadIQ?</h2>
            <p className="text-xs text-white/20 leading-relaxed">
              UploadIQ is a YouTube channel analyzer and video idea generator
              that helps creators discover what video to upload next by analyzing
              their channel performance, competitors, and content opportunities.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/25 mb-2">Who Is UploadIQ For?</h3>
            <p className="text-xs text-white/15 leading-relaxed">
              UploadIQ is built for YouTube creators at every level — from solo creators trying to grow their first
              1,000 subscribers to established channels with millions of views who want a systematic, data-driven
              content strategy. If you create YouTube videos and want to know what to upload next, UploadIQ is for you.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/25 mb-2">YouTube Channel Analyzer</h3>
            <p className="text-xs text-white/15 leading-relaxed">
              The UploadIQ YouTube channel analyzer reads your public channel data to identify your strongest
              performing content, audience patterns, and niche positioning. No login required — just your channel URL.
              It processes your last 50 videos and ranks them by a weighted performance score.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/25 mb-2">YouTube Video Idea Generator</h3>
            <p className="text-xs text-white/15 leading-relaxed">
              UploadIQ's AI video idea generator doesn't generate random ideas — it generates ideas validated by
              competitor performance data. Every suggestion is backed by actual view counts from channels in your niche,
              scored by opportunity size, competition level, and fit with your channel's existing audience.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/25 mb-2">YouTube Competitor Analysis Tool</h3>
            <p className="text-xs text-white/15 leading-relaxed">
              The competitor analysis feature automatically identifies up to 10 YouTube channels competing in your
              content space and surfaces their highest-performing videos. Content gaps — topics competitors win on
              that you haven't covered — become your highest-confidence content opportunities.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

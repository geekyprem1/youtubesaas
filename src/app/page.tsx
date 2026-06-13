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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <ExampleOutput />
      <Features />
      <HowItWorks />
      <Comparison />
      <Pricing />
      <FAQ />
      <FinalCTA />

      {/* SEO — semantic content for search engines and AI crawlers */}
      <section className="border-t border-white/[0.04] py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-white/30 mb-2">What Is UploadIQ?</h2>
          <p className="text-xs text-white/20 leading-relaxed">
            UploadIQ is a YouTube channel analyzer and video idea generator
            that helps creators discover what video to upload next by analyzing
            their channel performance, competitors, and content opportunities.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

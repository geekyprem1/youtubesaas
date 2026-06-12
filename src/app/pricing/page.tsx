import { Navbar } from "@/components/layout/navbar";
import { Pricing } from "@/components/home/pricing";
import { Footer } from "@/components/layout/footer";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}

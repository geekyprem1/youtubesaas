export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-black text-white mb-3">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: June 13, 2026</p>
        </div>

        <div className="space-y-10 text-sm text-white/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By creating an account or using UploadIQ, you agree to these Terms of Service. If you do not agree, do not use the service. These terms apply to all users, including free and Pro plan subscribers.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. Description of Service</h2>
            <p className="mb-3">UploadIQ is a Creator Intelligence Platform that analyzes public YouTube channel data and uses AI to generate video recommendations, competitor insights, and content opportunities.</p>
            <p>The service includes: channel analysis, competitor discovery, video idea generation, confidence scoring, Video Analyzer, Competitor Watchlist, Content Calendar, and Opportunity Radar.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. Accounts</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>You must provide a valid email address to create an account.</li>
              <li>You are responsible for maintaining the security of your account credentials.</li>
              <li>You may not share your account with others or create multiple accounts to bypass usage limits.</li>
              <li>You must be at least 13 years old to use UploadIQ.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. Free Plan and Usage Limits</h2>
            <p className="mb-3">Free plan users receive 3 channel analyses per day. This limit resets at midnight UTC. Attempting to bypass usage limits (including creating multiple accounts) is a violation of these terms and may result in account suspension.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Pro Plan and Billing</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Pro plan is billed monthly at the price displayed at the time of purchase.</li>
              <li>Payments are processed securely by Stripe.</li>
              <li>You may cancel your Pro subscription at any time. Access continues until the end of the current billing period.</li>
              <li>We do not offer refunds for partial billing periods, except where required by law.</li>
              <li>We reserve the right to change Pro pricing with 30 days notice to existing subscribers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Acceptable Use</h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Use UploadIQ to scrape, harvest, or systematically extract data for commercial redistribution</li>
              <li>Attempt to reverse-engineer, copy, or replicate the UploadIQ platform or its AI models</li>
              <li>Use automated scripts or bots to interact with the service</li>
              <li>Submit channel URLs for the purpose of harassing or targeting specific creators</li>
              <li>Violate any applicable laws or regulations in your use of the service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. YouTube API Compliance</h2>
            <p>UploadIQ uses the YouTube Data API v3. By using UploadIQ, you also agree to the <a href="https://www.youtube.com/t/terms" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">YouTube Terms of Service</a>. All channel data we access is publicly available — we do not access private or restricted data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Intellectual Property</h2>
            <p className="mb-3">UploadIQ and its original content, features, and functionality are owned by UploadIQ and are protected by copyright and other intellectual property laws.</p>
            <p>AI-generated video ideas and recommendations produced for your channel are yours to use. We do not claim ownership over content recommendations generated based on your channel data.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Disclaimers</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>UploadIQ provides recommendations based on data patterns and AI analysis. We do not guarantee any specific view count, subscriber growth, or channel performance.</li>
              <li>Confidence scores and view range estimates are projections based on available data — not promises.</li>
              <li>The service is provided "as is" without warranties of any kind, express or implied.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, UploadIQ shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">11. Termination</h2>
            <p className="mb-3">We may suspend or terminate your account if you violate these terms, abuse the service, or engage in fraudulent activity. You may delete your account at any time from Settings.</p>
            <p>Upon termination, your data will be deleted within 30 days.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">12. Changes to Terms</h2>
            <p>We may update these terms from time to time. We will notify you of significant changes via email. Continued use of UploadIQ after changes means you accept the new terms.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">13. Contact</h2>
            <p>Questions about these Terms? Email us at <span className="text-accent">legal@uploadiq.com</span>.</p>
          </section>

        </div>
      </div>
    </main>
  );
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <p className="text-xs font-bold text-accent uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-black text-white mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: June 13, 2026</p>
        </div>

        <div className="space-y-10 text-sm text-white/70 leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-white mb-3">1. What We Collect</h2>
            <p className="mb-3">When you use UploadIQ, we collect the following information:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li><span className="text-white/90 font-semibold">Account data:</span> Your email address and name when you sign up.</li>
              <li><span className="text-white/90 font-semibold">YouTube channel URLs:</span> The public channel URLs you submit for analysis. We do not ask for or store your YouTube login credentials.</li>
              <li><span className="text-white/90 font-semibold">Usage data:</span> Number of analyses run, features used, and general activity within the dashboard.</li>
              <li><span className="text-white/90 font-semibold">Payment data:</span> If you upgrade to Pro, payment is processed by Stripe. We never store your card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">2. What We Do Not Collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Your YouTube account login or OAuth tokens</li>
              <li>Private channel data or analytics from your YouTube Studio</li>
              <li>Any data from channels you have not explicitly submitted</li>
              <li>Cookies beyond what is required for authentication</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">3. How We Use Your Data</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>To run channel analyses and generate video recommendations</li>
              <li>To manage your account, plan, and daily usage limits</li>
              <li>To improve the accuracy and quality of our AI recommendations</li>
              <li>To send transactional emails (analysis complete, account updates)</li>
            </ul>
            <p className="mt-3">We do not sell your data to third parties. We do not use your data for advertising.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">4. YouTube API Data</h2>
            <p className="mb-3">UploadIQ uses the YouTube Data API v3 to fetch publicly available channel data. All data accessed is public — the same information visible to any YouTube visitor.</p>
            <p>We comply with the <a href="https://developers.google.com/youtube/terms/api-services-terms-of-service" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">YouTube API Services Terms of Service</a> and the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Google Privacy Policy</a>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">5. Data Storage and Security</h2>
            <p className="mb-3">Your data is stored securely using Supabase (PostgreSQL) with row-level security. We use HTTPS for all data in transit.</p>
            <p>Analysis results, saved ideas, and watchlist data are stored to power your dashboard experience. You can delete your account and all associated data at any time from Settings.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">6. Third-Party Services</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><span className="text-white/90 font-semibold">Supabase</span> — Database and authentication</li>
              <li><span className="text-white/90 font-semibold">Stripe</span> — Payment processing (Pro plan)</li>
              <li><span className="text-white/90 font-semibold">Google (YouTube API)</span> — Public channel and video data</li>
              <li><span className="text-white/90 font-semibold">OpenRouter / Google Gemini</span> — AI analysis and idea generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">7. Your Rights</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Request a copy of all data we hold about you</li>
              <li>Delete your account and all associated data</li>
              <li>Opt out of non-transactional emails at any time</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email us at <span className="text-accent">privacy@uploadiq.com</span>.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">8. Changes to This Policy</h2>
            <p>We may update this policy from time to time. If we make significant changes, we will notify you via email or an in-app notice. Continued use of UploadIQ after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-3">9. Contact</h2>
            <p>Questions about this Privacy Policy? Email us at <span className="text-accent">privacy@uploadiq.com</span>.</p>
          </section>

        </div>
      </div>
    </main>
  );
}

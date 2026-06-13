export const CATEGORIES = [
  { id: "tech",          label: "Tech & AI",               emoji: "💻" },
  { id: "gaming",        label: "Gaming",                   emoji: "🎮" },
  { id: "finance",       label: "Finance & Money",          emoji: "💰" },
  { id: "fitness",       label: "Fitness & Health",         emoji: "🏋️" },
  { id: "cooking",       label: "Cooking & Food",           emoji: "🍳" },
  { id: "travel",        label: "Travel & Vlog",            emoji: "✈️" },
  { id: "education",     label: "Education & Learning",     emoji: "📚" },
  { id: "entertainment", label: "Entertainment & Comedy",   emoji: "🎭" },
  { id: "business",      label: "Business & Entrepreneurship", emoji: "💼" },
  { id: "lifestyle",     label: "Lifestyle & Wellness",     emoji: "🌿" },
] as const;

export type CategoryId = typeof CATEGORIES[number]["id"];

export interface RadarTopic {
  topic: string;
  growth: string;
  score: number;
  comp: "Low" | "Medium" | "High";
  momentum: string;
  forecast: string;
  combinedViews: string;
  videosPublished: number;
  whyNow: string;
  opportunities: string[];
  categories: CategoryId[];
}

export const ALL_TOPICS: RadarTopic[] = [
  // ── Tech & AI ─────────────────────────────────────────────────
  {
    topic: "Claude Code Tutorials",
    growth: "+340%", score: 94, comp: "Low", momentum: "Exploding",
    forecast: "Likely to grow 14+ more days",
    combinedViews: "12.4M", videosPublished: 847,
    whyNow: "Claude Code launched to the public — massive creator interest with very few tutorials yet. First-movers are getting millions of views.",
    opportunities: [
      "Claude Code for Beginners: Your First AI App in 30 Minutes",
      "Claude Code vs Cursor vs Copilot: Which Is Actually Better?",
      "I Built a SaaS in 24 Hours Using Claude Code (Full Walkthrough)",
      "10 Claude Code Tricks That Save Me 5 Hours a Day",
      "Claude Code MCP Setup Guide: Supercharge Your AI Workflow",
    ],
    categories: ["tech"],
  },
  {
    topic: "MCP Server Setup",
    growth: "+280%", score: 91, comp: "Low", momentum: "Exploding",
    forecast: "Accelerating — demand outpacing content",
    combinedViews: "8.1M", videosPublished: 312,
    whyNow: "MCP is becoming the standard for AI tool integration. Barely any tutorial content exists — massive first-mover gap.",
    opportunities: [
      "MCP Servers Explained: The Future of AI Tools",
      "Build Your First MCP Server in 10 Minutes",
      "Top 10 MCP Servers Every Developer Should Know",
      "MCP vs Traditional APIs: Why It Changes Everything",
      "Claude + MCP: Build Anything Automation Workflow",
    ],
    categories: ["tech"],
  },
  {
    topic: "AI Agents 2025",
    growth: "+210%", score: 87, comp: "Medium", momentum: "Rising",
    forecast: "Growing steadily — high audience interest",
    combinedViews: "31.2M", videosPublished: 2840,
    whyNow: "Autonomous AI agents are the #1 trend in tech. Competition is rising but audience demand is growing faster.",
    opportunities: [
      "AI Agents Are Taking Over: What You Need to Know in 2025",
      "Build a Real AI Agent From Scratch (No Code Required)",
      "5 AI Agents That Replaced My Entire Workflow",
      "AI Agents vs ChatGPT: What's Actually Different?",
      "The AI Agent Stack: Tools, Frameworks, and Use Cases",
    ],
    categories: ["tech", "business"],
  },
  {
    topic: "Vibe Coding",
    growth: "+180%", score: 83, comp: "Low", momentum: "Rising",
    forecast: "New category forming — early opportunity",
    combinedViews: "5.6M", videosPublished: 421,
    whyNow: "Vibe coding is redefining how developers build. The term is new, the audience is massive, and the content gap is real.",
    opportunities: [
      "What Is Vibe Coding? The Future of Programming Explained",
      "Vibe Coding My First App: Full Build Timelapse",
      "Vibe Coding vs Traditional Coding: Which Is Better?",
      "I Vibe Coded a $10K App in a Weekend (Here's How)",
      "Vibe Coding Tutorial for Non-Programmers",
    ],
    categories: ["tech", "education"],
  },
  {
    topic: "Gemini CLI Guide",
    growth: "+145%", score: 79, comp: "Low", momentum: "Rising",
    forecast: "Early-stage — low competition window closing",
    combinedViews: "3.2M", videosPublished: 198,
    whyNow: "Google launched Gemini CLI — barely any creator content. Small window to capture first-page search rankings.",
    opportunities: [
      "Gemini CLI: Everything You Need to Know (2025 Guide)",
      "Gemini CLI vs Claude Code: I Tested Both for a Week",
      "Build Anything With Gemini CLI: Full Tutorial",
      "Gemini CLI Setup Guide: From Zero to First Project",
      "Gemini CLI Hidden Features Most Creators Don't Know",
    ],
    categories: ["tech"],
  },

  // ── Gaming ────────────────────────────────────────────────────
  {
    topic: "Game Dev With AI",
    growth: "+190%", score: 88, comp: "Low", momentum: "Exploding",
    forecast: "AI in game dev is exploding — tiny creator base",
    combinedViews: "7.3M", videosPublished: 540,
    whyNow: "Tools like Cursor + Unity are letting solo devs ship full games. Audience is hungry but content is scarce.",
    opportunities: [
      "I Made a Full Game in 7 Days Using AI (No Experience)",
      "AI Game Dev Toolkit: Best Tools in 2025",
      "Unity + Claude Code: Build Your First Game Fast",
      "Indie Game Dev With AI: From Idea to Launch",
      "AI Generated Assets for Games: Full Workflow",
    ],
    categories: ["gaming", "tech"],
  },
  {
    topic: "Indie Game Deep Dives",
    growth: "+175%", score: 85, comp: "Low", momentum: "Rising",
    forecast: "Indie boom — audiences want deep analysis",
    combinedViews: "18.4M", videosPublished: 1200,
    whyNow: "Indie games are outperforming AAA. Deep-dive content on how they succeed drives huge engagement.",
    opportunities: [
      "Why Balatro Became the Biggest Indie Game of 2025",
      "How a Solo Dev Made $2M With One Idea",
      "The Design Secrets Behind Viral Indie Games",
      "Top 10 Upcoming Indie Games Nobody Is Talking About",
      "What Makes an Indie Game Go Viral?",
    ],
    categories: ["gaming", "entertainment"],
  },
  {
    topic: "Gaming Setup Guides 2025",
    growth: "+160%", score: 82, comp: "Medium", momentum: "Rising",
    forecast: "Consistent performer — high search volume",
    combinedViews: "24.1M", videosPublished: 3100,
    whyNow: "New GPUs, monitors, and peripherals keep dropping. Setup guides always rank well with fresh content.",
    opportunities: [
      "Best Budget Gaming Setup Under $500 in 2025",
      "My $5,000 Dream Gaming Setup (Every Item Explained)",
      "Gaming Setup Mistakes 90% of Beginners Make",
      "Best Monitors for Gaming in 2025 (After Testing 12)",
      "Complete Streaming Setup Guide for Beginners",
    ],
    categories: ["gaming"],
  },

  // ── Finance & Money ───────────────────────────────────────────
  {
    topic: "AI Trading & Investing",
    growth: "+260%", score: 91, comp: "Medium", momentum: "Exploding",
    forecast: "Massive interest, growing fast — go now",
    combinedViews: "22.5M", videosPublished: 1870,
    whyNow: "AI-powered investing tools are mainstream now. Everyone wants to know how to use them — very few quality explainers.",
    opportunities: [
      "I Let AI Manage My Portfolio for 30 Days (Results)",
      "Best AI Trading Tools in 2025: Honest Review",
      "How to Use AI for Stock Research (Step by Step)",
      "AI vs Human Investor: Who Won in 2025?",
      "Build Your Own AI Trading Bot (No Coding)",
    ],
    categories: ["finance", "tech"],
  },
  {
    topic: "Passive Income 2025",
    growth: "+200%", score: 88, comp: "Medium", momentum: "Rising",
    forecast: "Evergreen topic surging again — new angles needed",
    combinedViews: "45.6M", videosPublished: 5400,
    whyNow: "Recession fears + job market shifts are driving massive search interest in passive income. New AI-powered angles are wide open.",
    opportunities: [
      "7 Passive Income Streams I Built With AI in 2025",
      "Realistic Passive Income: What Actually Works vs Hype",
      "From $0 to $3K/Month Passive (My 12-Month Story)",
      "The Best Passive Income for Beginners in 2025",
      "Digital Products That Generate Income While You Sleep",
    ],
    categories: ["finance", "business"],
  },
  {
    topic: "Budgeting & Frugal Living",
    growth: "+165%", score: 80, comp: "Low", momentum: "Rising",
    forecast: "Inflation keeping this evergreen — low competition",
    combinedViews: "19.8M", videosPublished: 2200,
    whyNow: "Cost of living crisis isn't over. People are desperately searching for practical, real budgeting advice.",
    opportunities: [
      "I Lived on $1,500/Month for 90 Days (Full Breakdown)",
      "Zero-Based Budgeting: The System That Changed My Life",
      "Cut $500/Month From Your Budget Without Feeling It",
      "Best Free Apps to Track Every Dollar in 2025",
      "How I Paid Off $20K Debt in 18 Months",
    ],
    categories: ["finance", "lifestyle"],
  },

  // ── Fitness & Health ──────────────────────────────────────────
  {
    topic: "Zone 2 Cardio Training",
    growth: "+185%", score: 85, comp: "Low", momentum: "Rising",
    forecast: "Science-backed trend — creator content still sparse",
    combinedViews: "9.4M", videosPublished: 760,
    whyNow: "Zone 2 went from niche to mainstream after Peter Attia. Most content is too complex — simple explainers are winning big.",
    opportunities: [
      "Zone 2 Training: The Complete Beginner Guide",
      "I Did Zone 2 Cardio Every Day for 30 Days (Results)",
      "Zone 2 vs HIIT: Which Actually Burns More Fat?",
      "How to Find Your Zone 2 Heart Rate (No Guessing)",
      "Build Your Zone 2 Base in 8 Weeks",
    ],
    categories: ["fitness"],
  },
  {
    topic: "Home Gym Builds",
    growth: "+175%", score: 83, comp: "Medium", momentum: "Rising",
    forecast: "Gym costs rising — home gym searches up 3x",
    combinedViews: "28.7M", videosPublished: 3400,
    whyNow: "Gym memberships are expensive and inconvenient. Home gym build content is getting massive view counts with low competition on new angles.",
    opportunities: [
      "Build the Perfect Home Gym Under $1,000",
      "My Home Gym Transformation: $0 to Fully Equipped",
      "Best Home Gym Equipment in 2025 (After Testing Everything)",
      "Garage Gym Setup Guide: What I Wish I Knew Earlier",
      "Home Gym vs Gym Membership: True Cost Comparison",
    ],
    categories: ["fitness"],
  },
  {
    topic: "Sleep Optimization",
    growth: "+155%", score: 79, comp: "Low", momentum: "Rising",
    forecast: "Health trend with long tail — wide open niche",
    combinedViews: "12.1M", videosPublished: 890,
    whyNow: "Sleep tech (Oura, Whoop) is mainstream. People want science-backed, actionable sleep content — most of what exists is low quality.",
    opportunities: [
      "I Optimized My Sleep for 60 Days (Everything Changed)",
      "The Sleep Protocol That Doubled My Energy",
      "Best Sleep Tracking Devices in 2025: Tested & Ranked",
      "Why You're Always Tired (And How to Fix It)",
      "Evening Routine for Deep Sleep: What Science Says",
    ],
    categories: ["fitness", "lifestyle"],
  },

  // ── Cooking & Food ────────────────────────────────────────────
  {
    topic: "Viral Recipe Recreations",
    growth: "+195%", score: 87, comp: "Medium", momentum: "Rising",
    forecast: "Consistent demand — new viral foods every week",
    combinedViews: "67.3M", videosPublished: 8900,
    whyNow: "TikTok food trends move faster than creators can cover them. First-mover recreations get millions of views every week.",
    opportunities: [
      "I Tried Every Viral Food Trend of 2025 (Ranked)",
      "Recreating the Most Viral Restaurant Dishes at Home",
      "Viral Smash Burger: The Only Recipe You Need",
      "I Made TikTok's Most Popular Recipe — Was It Worth It?",
      "Upgrading Viral Recipes: Making Them Actually Good",
    ],
    categories: ["cooking", "entertainment"],
  },
  {
    topic: "Meal Prep for Busy People",
    growth: "+165%", score: 81, comp: "Medium", momentum: "Rising",
    forecast: "Evergreen + growing — strong search intent",
    combinedViews: "34.2M", videosPublished: 4200,
    whyNow: "Post-COVID work schedules have people time-poor. Practical meal prep content with real weekly savings data is crushing it.",
    opportunities: [
      "My $50/Week Meal Prep That Actually Tastes Good",
      "5 Meals From 1 Chicken: Full Weekly Prep Guide",
      "Meal Prep for One: Stop Wasting Food and Money",
      "The 2-Hour Sunday Meal Prep That Changed My Life",
      "High Protein Meal Prep for Beginners (Full Week)",
    ],
    categories: ["cooking", "fitness"],
  },

  // ── Travel & Vlog ─────────────────────────────────────────────
  {
    topic: "Japan Travel 2025",
    growth: "+210%", score: 89, comp: "Medium", momentum: "Exploding",
    forecast: "Record Japan tourism — content demand at peak",
    combinedViews: "58.4M", videosPublished: 6700,
    whyNow: "Japan tourism hit record highs in 2025. Yen is weak. Everyone wants to go — unique angle content is getting massive views.",
    opportunities: [
      "Japan in 2025: What Nobody Tells You Before You Go",
      "I Spent 2 Weeks in Japan on $80/Day (Full Breakdown)",
      "Hidden Japan: 10 Places Tourists Never Find",
      "Japan Convenience Store Food Tier List (All 47 Items)",
      "First Time in Japan: Mistakes I Made So You Don't Have To",
    ],
    categories: ["travel"],
  },
  {
    topic: "Digital Nomad Life",
    growth: "+175%", score: 83, comp: "Medium", momentum: "Rising",
    forecast: "Remote work normalization driving sustained interest",
    combinedViews: "21.3M", videosPublished: 2800,
    whyNow: "Remote work is permanent for millions. People want real, practical content on how to travel while working — not just aspirational vlogs.",
    opportunities: [
      "How I Work Remotely From 12 Countries (Real Setup)",
      "Best Cities for Digital Nomads in 2025 (Tested Myself)",
      "Digital Nomad Visa Guide: Every Country That Offers One",
      "My Digital Nomad Failures: What Went Wrong Year 1",
      "The Honest Cost of Living as a Digital Nomad",
    ],
    categories: ["travel", "business", "lifestyle"],
  },

  // ── Education & Learning ──────────────────────────────────────
  {
    topic: "AI Study Tools 2025",
    growth: "+220%", score: 90, comp: "Low", momentum: "Exploding",
    forecast: "Student demand massive — very few quality guides",
    combinedViews: "14.7M", videosPublished: 980,
    whyNow: "Students are desperate for AI-powered study tools but most content is vague. Specific, tested walkthroughs are going viral.",
    opportunities: [
      "Best AI Tools for Students in 2025 (I Tested 20+)",
      "How I Use AI to Study 3x Faster (Full System)",
      "AI Flashcard Generator vs Anki: Which Actually Works?",
      "The AI Study Stack That Got Me Straight A's",
      "From Failing to Top of Class Using AI Study Tools",
    ],
    categories: ["education", "tech"],
  },
  {
    topic: "Second Brain Setup",
    growth: "+180%", score: 85, comp: "Medium", momentum: "Rising",
    forecast: "PKM niche growing fast — Notion/Obsidian wars",
    combinedViews: "16.2M", videosPublished: 1900,
    whyNow: "Information overload is a universal problem. Second brain systems (Notion, Obsidian, Roam) are mainstream but most tutorials are overwhelming.",
    opportunities: [
      "Build Your Second Brain in Notion (Beginner to Pro)",
      "My Obsidian Vault Tour: 3 Years of Knowledge Management",
      "Second Brain vs To-Do Apps: What Actually Works",
      "I Rebuilt My Entire Note System With AI (Here's How)",
      "The Simplest Second Brain Setup That Actually Sticks",
    ],
    categories: ["education", "lifestyle", "business"],
  },

  // ── Entertainment & Comedy ────────────────────────────────────
  {
    topic: "Commentary on Viral Events",
    growth: "+185%", score: 84, comp: "Medium", momentum: "Rising",
    forecast: "Evergreen format — new events weekly",
    combinedViews: "89.2M", videosPublished: 11200,
    whyNow: "Commentary channels are the fastest growing format on YouTube. Audiences want smart takes on viral moments — timing is everything.",
    opportunities: [
      "The Real Story Behind [Current Viral Event] (My Take)",
      "Why Everyone's Reaction to This Is Wrong",
      "Breaking Down What Actually Happened With [Trend]",
      "The Internet Went Wild Over This — Here's Why It Matters",
      "Commentary on the Craziest Creator Drama of 2025",
    ],
    categories: ["entertainment"],
  },
  {
    topic: "Storytelling & Narrative",
    growth: "+165%", score: 80, comp: "Low", momentum: "Rising",
    forecast: "Storytelling is the #1 skill gap on YouTube",
    combinedViews: "11.4M", videosPublished: 1300,
    whyNow: "The best-performing videos all have strong narrative structure. Creators are desperate to learn storytelling but great content is rare.",
    opportunities: [
      "The Storytelling Formula Behind Every Viral Video",
      "How to Hook Viewers in the First 5 Seconds",
      "Why Your Videos Lose People at 2 Minutes (And How to Fix It)",
      "Narrative Structure for YouTube: What Hollywood Taught Me",
      "I Rewrote My Worst Video With Better Storytelling (Results)",
    ],
    categories: ["entertainment", "education"],
  },

  // ── Business & Entrepreneurship ───────────────────────────────
  {
    topic: "AI SaaS Building",
    growth: "+250%", score: 92, comp: "Low", momentum: "Exploding",
    forecast: "Indie SaaS + AI = hottest creator niche of 2025",
    combinedViews: "18.9M", videosPublished: 1100,
    whyNow: "Solo founders are building $10K/month SaaS products with AI in weeks. The audience is massive and the how-to content gap is enormous.",
    opportunities: [
      "I Built a $5K/Month SaaS in 30 Days With AI (Full Story)",
      "How to Find a SaaS Idea That Actually Makes Money",
      "No-Code SaaS Stack 2025: Everything I Use",
      "From Idea to First Paying Customer in 7 Days",
      "AI SaaS Mistakes I Made So You Don't Have To",
    ],
    categories: ["business", "tech"],
  },
  {
    topic: "Solopreneur Systems",
    growth: "+195%", score: 87, comp: "Low", momentum: "Rising",
    forecast: "One-person business trend is accelerating",
    combinedViews: "12.3M", videosPublished: 1450,
    whyNow: "More people than ever are building one-person businesses. Content on systems, tools, and workflows for solo operators is in huge demand.",
    opportunities: [
      "My Complete Solopreneur OS (Everything I Use to Run My Business)",
      "How I Run a $20K/Month Business Alone",
      "Solopreneur vs Freelancer vs Agency: Which Is Right for You?",
      "The 5 Systems Every Solopreneur Needs to Build First",
      "I Automated 80% of My Business With AI (Full Walkthrough)",
    ],
    categories: ["business"],
  },
  {
    topic: "Agency Building 2025",
    growth: "+175%", score: 83, comp: "Medium", momentum: "Rising",
    forecast: "SMMA reborn with AI angle — fresh demand",
    combinedViews: "24.6M", videosPublished: 3100,
    whyNow: "AI is lowering the barrier to start agencies. New content on AI-powered agency models is outperforming traditional SMMA content 5:1.",
    opportunities: [
      "Start an AI Agency With $0 (My Exact Playbook)",
      "Agency Niches With the Highest Margins in 2025",
      "How I Landed My First Agency Client in 14 Days",
      "AI Agency vs Traditional Agency: What's Actually Different?",
      "Scale Your Agency to $50K/Month: My Systems",
    ],
    categories: ["business"],
  },

  // ── Lifestyle & Wellness ──────────────────────────────────────
  {
    topic: "Morning Routine Optimization",
    growth: "+165%", score: 80, comp: "Medium", momentum: "Rising",
    forecast: "Perennial top performer — fresh angles still win",
    combinedViews: "43.8M", videosPublished: 5600,
    whyNow: "Morning routine content never dies, but AI-optimized and science-backed versions are crushing generic content. New angle = new views.",
    opportunities: [
      "I Tested 10 Morning Routines for 30 Days (Results Ranked)",
      "The 20-Minute Morning Routine That Actually Works",
      "Morning Routine Mistakes That Are Ruining Your Day",
      "Build Your Ideal Morning Routine With AI in 5 Minutes",
      "What I Learned From Waking Up at 5AM for 6 Months",
    ],
    categories: ["lifestyle", "fitness"],
  },
  {
    topic: "Minimalism & Intentional Living",
    growth: "+155%", score: 78, comp: "Low", momentum: "Rising",
    forecast: "Counter-culture trend gaining steam quietly",
    combinedViews: "16.7M", videosPublished: 2100,
    whyNow: "Overconsumption backlash is growing. Minimalism + intentional living content is finding a massive audience tired of hustle culture.",
    opportunities: [
      "I Got Rid of 90% of My Stuff — Here's What Happened",
      "Minimalism for People Who Love Buying Things",
      "The Intentional Living System That Changed Everything",
      "Digital Minimalism: Delete These Apps From Your Phone",
      "One Year of Buying Nothing New (My Results)",
    ],
    categories: ["lifestyle"],
  },
];

export function getTopicsForInterests(interests: string[]): RadarTopic[] {
  if (!interests || interests.length === 0) return ALL_TOPICS.slice(0, 5);

  const ids = interests as CategoryId[];

  // Score each topic by how many of the user's interests it matches
  const scored = ALL_TOPICS.map(t => ({
    topic: t,
    score: t.categories.filter(c => ids.includes(c)).length,
  }))
    .filter(t => t.score > 0)
    .sort((a, b) => b.score - a.score || b.topic.score - a.topic.score);

  // Return top 5 unique topics
  return scored.slice(0, 5).map(s => s.topic);
}

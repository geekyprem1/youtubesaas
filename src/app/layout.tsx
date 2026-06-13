import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://uploadiq.online"),
  title: {
    default: "UploadIQ — YouTube Channel Analyzer & Video Idea Generator",
    template: "%s | UploadIQ",
  },
  description:
    "UploadIQ is a YouTube channel analyzer and AI video idea generator. Discover your next high-performing video by analyzing your channel, finding competitor gaps, and getting 20 scored content ideas in under 2 minutes. Free to start.",
  keywords: [
    "youtube channel analyzer",
    "youtube video idea generator",
    "youtube content ideas",
    "what video should i make next",
    "youtube competitor analysis",
    "youtube growth tool",
    "youtube analytics tool",
    "youtube opportunity finder",
    "youtube content strategy tool",
    "youtube creator tools",
    "youtube title generator",
    "youtube seo tool",
    "youtube content planner",
    "ai youtube tool",
    "youtube channel growth",
  ],
  authors: [{ name: "UploadIQ", url: "https://uploadiq.online" }],
  creator: "UploadIQ",
  publisher: "UploadIQ",
  category: "SaaS, Creator Tools, YouTube Analytics",
  alternates: {
    canonical: "https://uploadiq.online",
  },
  openGraph: {
    title: "UploadIQ — YouTube Channel Analyzer & Video Idea Generator",
    description:
      "Discover your next high-performing YouTube video idea. AI analyzes your channel, finds competitor content gaps, and generates 20 ready-to-film ideas in under 2 minutes.",
    url: "https://uploadiq.online",
    siteName: "UploadIQ",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://uploadiq.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "UploadIQ — YouTube Channel Analyzer and Video Idea Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UploadIQ — YouTube Channel Analyzer & Video Idea Generator",
    description:
      "Stop guessing your next YouTube video. AI analyzes your channel, finds competitor gaps, and generates 20 high-confidence video ideas in 2 minutes.",
    images: ["https://uploadiq.online/og-image.png"],
    creator: "@uploadiq",
    site: "@uploadiq",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

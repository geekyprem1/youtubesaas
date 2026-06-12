import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "UploadIQ | AI-Powered YouTube Strategy",
  description:
    "Analyze your YouTube channel, discover competitor gaps, and get AI-generated video ideas to grow your audience.",
  keywords: ["YouTube", "content strategy", "video ideas", "YouTube analytics", "competitor analysis"],
  openGraph: {
    title: "UploadIQ",
    description: "Stop guessing your next YouTube video. Use AI to find your highest-potential opportunities.",
    type: "website",
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

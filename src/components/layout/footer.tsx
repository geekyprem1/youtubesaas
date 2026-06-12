import Link from "next/link";
import { Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-12 mt-20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
              <Youtube className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">UploadIQ</span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Sign Up</Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} UploadIQ. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

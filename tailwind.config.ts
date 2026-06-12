import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0F19",
        primary: {
          DEFAULT: "#7C3AED",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#A855F7",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#1E2433",
          foreground: "#94A3B8",
        },
        card: {
          DEFAULT: "#111827",
          foreground: "#FFFFFF",
        },
        border: "#1E2433",
        input: "#1E2433",
        ring: "#7C3AED",
        foreground: "#FFFFFF",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1E2433",
          foreground: "#94A3B8",
        },
        popover: {
          DEFAULT: "#111827",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-purple": "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)",
        "glass": "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(168,85,247,0.05) 100%)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        glow: "0 0 20px rgba(124,58,237,0.3)",
        "glow-lg": "0 0 40px rgba(124,58,237,0.4)",
        glass: "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

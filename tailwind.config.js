import plugin from "tailwindcss/plugin";
import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins"],
        inter: ["Inter", "sans-serif"],
        sf: ['"SF Pro Display"', "sans-serif"],
      },
      fontSize: {
        "c-h": "742px",
      },
      placeholder: {
        "text-xs": { fontSize: "0.75rem" }, // Extra Small
        "text-sm": { fontSize: "0.875rem" }, // Small
        "text-base": { fontSize: "1rem" }, // Base (default)
        "text-lg": { fontSize: "1.125rem" }, // Large
        "text-xl": { fontSize: "1.25rem" }, // Extra Large
        "text-2xl": { fontSize: "1.5rem" }, // 2XL
        "text-3xl": { fontSize: "1.875rem" }, // 3XL
        "text-4xl": { fontSize: "2.25rem" }, // 4XL
        "text-5xl": { fontSize: "3rem" }, // 5XL
        "text-6xl": { fontSize: "3.75rem" }, // 6XL
        "text-7xl": { fontSize: "4.5rem" }, // 7XL
        "text-8xl": { fontSize: "6rem" }, // 8XL
        "text-9xl": { fontSize: "8rem" }, // 9XL
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "detail-medium-contrast": "var(--detail-medium-contrast)",
        "detail-high-contrast": "var(--detail-high-contrast)",
        "text-body": "var(--text-body)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        "slide-spacing": "var(--slide-spacing)",
        "thumbs-slide-spacing": "var(--thumbs-slide-spacing)",
      },
      height: {
        slide: "var(--slide-height)",
        "thumbs-slide": "var(--thumbs-slide-height)",
      },
      flexBasis: {
        slide: "var(--slide-size)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        move: {
          "0%": { transform: "translateX(-200px)" },
          "100%": { transform: "translateX(200px)" },
        },

        marquee: {
          "100%": { transform: "translateX(-50%)" },
        },
        "reverse-marquee": {
          "0%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(80%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "reveal-down": {
          "0%": { opacity: "0", transform: "translateY(-80%)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "content-blur": {
          "0%": { filter: "blur(0.3rem)" },
          "100%": { filter: "blur(0)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.75", scale: "0.9" },
          "50%": { opacity: "1", scale: "1" },
        },
        "transition-in": {
          "100%": {
            opacity: "0",
            backgroundColor: "black",
            transform: "translateX(40)",
            filter: "blur(12px)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        move: "move 5s linear infinite",
        marquee: "marquee var(--duration, 30s) linear infinite",
        "reverse-marquee":
          "reverse-marquee var(--duration, 30s) linear infinite",
        fadeIn: "fadeIn 0.5s ease-in",
        sparkle: "sparkle 2s ease-in-out infinite",
      },
      transitionTimingFunction: {
        "minor-spring": "cubic-bezier(0.18,0.89,0.82,1.04)",
      },
    },
  },
  plugins: [
    import("tailwindcss-animate"),
    plugin(({ addUtilities }) => {
      addUtilities({
        ".touch-pan-y": {
          "touch-action": "pan-y",
        },
        ".touch-pinch-zoom": {
          "touch-action": "pinch-zoom",
        },
        ".translate-3d-0": {
          transform: "translate3d(0, 0, 0)",
        },
      });
    }),
    nextui(),
  ],
};

export default config;

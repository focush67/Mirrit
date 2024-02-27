import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";
import { withUt } from "uploadthing/tw";

const config: Config = withUt({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    // Enable light and dark colors
    colors: {
      light: {
        // Specify your light color palette here
        primary: "#E5E7EB",
        secondary: "#6B7280",
        accent: "#F59E0B",
        // Add more light colors as needed
      },
      dark: {
        // Specify your dark color palette here
        primary: "#4B5563",
        secondary: "#D1D5DB",
        accent: "#FBBF24",
        // Add more dark colors as needed
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            // Specify light colors from Tailwind UI
          },
        },
        dark: {
          colors: {
            // Specify dark colors from Tailwind UI
          },
        },
      },
    }),
  ],
});

export default config;

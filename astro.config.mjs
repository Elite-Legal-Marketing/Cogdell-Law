import { defineConfig, fontProviders } from "astro/config";
import { loadEnv } from "vite";
import sanity from "@sanity/astro";
import react from "@astrojs/react";

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? "development",
  process.cwd(),
  ""
);

export default defineConfig({
  build: {
    // Inline every page's CSS into its <head> rather than emitting <link
    // rel="stylesheet">. The homepage was pulling four blocking stylesheets
    // (~60 kB) before it could paint, which PageSpeed costed at ~640 ms; the
    // whole site is static, so the bytes ride along in the already-brotli'd
    // HTML instead of costing a round trip. The trade is that CSS is no longer
    // cached across navigations — worth it here, where most sessions are one
    // or two pages.
    inlineStylesheets: "always",
  },

  // The canonical origin. Every canonical tag, og:url and sitemap.xml entry is
  // built from this, so it must match the domain Vercel serves as primary —
  // www, with the apex redirecting to it.
  site: "https://www.cogdell-law.com",

  // Self-hosted Google Fonts via Astro's Fonts API (downloaded & served at build time).
  fonts: [
    {
      provider: fontProviders.google(),
      name: "Cormorant Garamond",
      cssVariable: "--font-cormorant",
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
    },
    {
      provider: fontProviders.google(),
      name: "Instrument Sans",
      cssVariable: "--font-instrument",
      weights: [400, 500, 600, 700],
      styles: ["normal"],
    },
  ],
  integrations: [
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false, // false for fresh data in static builds
      studioBasePath: "/admin", // embed the Studio at /admin
    }),
    react(),
  ],
});

import { getImage } from "astro:assets";
import heroLandscape from "../assets/hero-boardroom.jpg";
import heroPortrait from "../assets/cogdell-seated-portrait.jpg";
import heroMobileCrop from "../assets/hero-mobile.jpg";

/**
 * The homepage hero's three art-directed crops, built once and shared.
 *
 * Lives here rather than inside Hero.astro because the same srcsets are needed
 * in two places: the <picture> in the body, and the <link rel="preload"> in the
 * head that tells the browser to start fetching the LCP image before it has
 * parsed its way down to the markup. Both must agree exactly — a preload whose
 * srcset or media query drifts from the <picture> downloads a second image
 * instead of warming the right one.
 *
 * The breakpoints are mirrored in Hero.astro and HeroPreload.astro; if one
 * moves they all move.
 */
export const HERO_MOBILE_MAX = 650;
export const HERO_TABLET_MAX = 900;

export type HeroImages = {
  heroDesktop: Awaited<ReturnType<typeof getImage>>;
  heroTablet: Awaited<ReturnType<typeof getImage>>;
  heroMobile: Awaited<ReturnType<typeof getImage>>;
};

let cached: Promise<HeroImages> | undefined;

async function build(): Promise<HeroImages> {
  // The background art is design, not content: it stays in the repo so it keeps
  // astro:assets optimization. Art direction: landscape desktop, portrait mobile.
  const [heroDesktop, heroTablet, heroMobile] = await Promise.all([
    getImage({ src: heroLandscape, widths: [1200, 1600, 1800], format: "webp" }),
    getImage({ src: heroPortrait, widths: [420, 640, 738], format: "webp" }),
    // Phones get a third crop. The full-length portrait puts Dan mid-frame, and
    // since the copy is bottom-aligned it landed straight across his face on a
    // tall narrow screen. This one is framed to head-and-torso so he reads at
    // the small size, and below 650px it sits as a band above the copy rather
    // than behind it.
    getImage({ src: heroMobileCrop, widths: [420, 640, 738], format: "webp" }),
  ]);

  return { heroDesktop, heroTablet, heroMobile };
}

export function getHeroImages(): Promise<HeroImages> {
  cached ??= build();
  return cached;
}

/** The intrinsic size of the landscape source, for the <img> fallback. */
export const heroLandscapeDimensions = {
  width: heroLandscape.width,
  height: heroLandscape.height,
};

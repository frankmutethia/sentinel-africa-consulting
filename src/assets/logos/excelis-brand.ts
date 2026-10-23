/**
 * Official Excelis brand assets — Brand Manual 1.0 (updated-excelis-logo-kit).
 * See src/assets/updated-excelis-logo-kit/README.md for placement guidance.
 */

import primaryLogo from "@/assets/updated-excelis-logo-kit/svg/excelis-primary-logo.svg";
import primaryLogoDark from "@/assets/updated-excelis-logo-kit/svg/excelis-primary-dark.svg";
import primaryLogoWhite from "@/assets/updated-excelis-logo-kit/svg/excelis-primary-white.svg";

import secondaryHorizontal from "@/assets/updated-excelis-logo-kit/svg/excelis-secondary-horizontal.svg";
import secondaryHorizontalCompact from "@/assets/updated-excelis-logo-kit/svg/excelis-secondary-horizontal-no-tagline.svg";
import secondaryHorizontalDark from "@/assets/updated-excelis-logo-kit/svg/excelis-secondary-dark.svg";
import secondaryHorizontalWhite from "@/assets/updated-excelis-logo-kit/svg/excelis-secondary-white.svg";

import brandIcon from "@/assets/updated-excelis-logo-kit/svg/excelis-brand-icon.svg";
import brandIconOnDark from "@/assets/updated-excelis-logo-kit/svg/excelis-brand-icon-on-dark.svg";

import sidebarExpanded from "@/assets/updated-excelis-logo-kit/web/sidebar-expanded.svg";
import sidebarExpandedDark from "@/assets/updated-excelis-logo-kit/web/sidebar-expanded-dark.svg";
import sidebarCollapsedRing from "@/assets/updated-excelis-logo-kit/web/sidebar-collapsed-ring.svg";
import sidebarCollapsedRingDark from "@/assets/updated-excelis-logo-kit/web/sidebar-collapsed-dark.svg";

import docHeaderPng from "@/assets/updated-excelis-logo-kit/png/doc-header-1600w.png";
import docFooterPng from "@/assets/updated-excelis-logo-kit/png/doc-footer-1600w.png";

import logoMarkJpeg from "@/assets/updated-excelis-logo-kit/Excelis logo one.jpeg";
import logoHorizontalJpeg from "@/assets/updated-excelis-logo-kit/Excelis logo two.jpeg";
import logoStackedJpeg from "@/assets/updated-excelis-logo-kit/Excelis logo three.jpeg";

export const EXCELIS_TAGLINE = "Empowering People. Transforming Organizations.";

export const excelisBrandAssets = {
  primaryLogo,
  primaryLogoDark,
  primaryLogoWhite,
  secondaryHorizontal,
  secondaryHorizontalCompact,
  secondaryHorizontalDark,
  secondaryHorizontalWhite,
  brandIcon,
  brandIconOnDark,
  sidebarExpanded,
  sidebarExpandedDark,
  sidebarCollapsedRing,
  sidebarCollapsedRingDark,
  docHeaderPng,
  docFooterPng,
  /** Circular E brand icon — headers (mobile), compact placements */
  logoMarkJpeg,
  /** Horizontal EX + wordmark — headers (desktop), card fallbacks */
  logoHorizontalJpeg,
  /** Stacked primary lockup — auth pages, Who We Are, footers */
  logoStackedJpeg,
} as const;

/** @deprecated use excelisBrandAssets.logoHorizontalJpeg */
export const satiLogoHorizontal = logoHorizontalJpeg;

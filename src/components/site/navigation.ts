// Every destination stays inside this project. Items without an `href` are pages that
// have not been built yet; the header shows them as "Soon" instead of linking away.

// Pages built in this project. Each one is a Vite entry listed in vite.config.ts.
export const whoWeArePage = "/who-we-are/";
export const howWeDoItPage = "/how-we-do-it/";
export const whyWeDoItPage = "/why-we-do-it/";
export const boardPage = "/board/";
export const teamPage = "/team/";
export const blogPage = "/blog/";
export const sdgPage = "/our-sdgs-commitment/";
export const travelAdvisoryPage = "/travel-advisory/";
export const careersPage = "/join-our-team/";
export const talentShieldPage = "/talent-shield/";

/** Callback form choice for organisations asking about travel risk. */
export const travelInterest = "Travel Risk Intelligence";

// Staff area: sign-in pages and the admin console behind them.
export const staffLoginPage = "/staff-login/";
export const forgotPasswordPage = "/forgot-password/";
export const adminPage = "/admin/";

/** A blog article, shown by the blog page when it has a `post` parameter. */
export const blogPost = (slug: string) => `${blogPage}?post=${slug}`;

/** The services menu: one page per way of working with Sentinel Africa. */
export const servicePages = [
  { label: "Consultancy", href: "/consultancy/" },
  { label: "Managed Services", href: "/managed-services/" },
  { label: "Training", href: "/training/" },
  { label: "Cybershield", href: "/cybershield/" },
  { label: "Our Software Products", href: "/software-products/" },
] as const;

export const toolsPage = "/tools/";

/**
 * Self-service tools, listed together under the Tools menu and on the Tools page.
 * To add a tool: build its page, add it to vite.config.ts and add one entry here.
 */
export const toolPages: {
  label: string;
  href: string;
  /** Short category shown on the tool's card. */
  category: string;
  summary: string;
  /** Option pre-selected in the homepage callback form when visitors ask about this tool. */
  interest: string;
  badge?: string;
}[] = [
  {
    label: "Travel Advisory",
    href: travelAdvisoryPage,
    category: "Travel risk",
    summary:
      "Check official Ebola-related advisories and travel requirements for every country on your route, reviewed by Sentinel Africa editors.",
    interest: travelInterest,
    badge: "New",
  },
  {
    label: "Rwanda DPP Registration",
    href: "/rwanda-dpp-registration/",
    category: "Data protection compliance",
    summary:
      "Find out whether you must register as a data controller or processor under Rwanda’s data protection law, and fast-track your registration.",
    interest: "Rwanda DPP Registration",
  },
  {
    label: "Certification Readiness & Implementation Planner",
    href: "/certification-planner/",
    category: "ISO certification",
    summary:
      "Score your readiness for ISO 27001, 22301, 9001, 27701, 42001 and more, and estimate the time, people and effort needed to get certified.",
    interest: "ISO Certification Readiness",
    badge: "New",
  },
];

/** Links to a homepage section; `base` is "" on the homepage and "/" on other pages. */
export const homeSection = (base: string, id: string) => `${base}#${id}`;

/** Opens the homepage callback form with `interest` already chosen in its dropdown. */
export const contactLink = (interest?: string) =>
  interest ? `/?interest=${encodeURIComponent(interest)}#contact` : "/#contact";

/** `badge` adds a short marker such as "New" beside a top-level link. */
export type NavigationLink = { label: string; href?: string; badge?: string };
export type NavigationItem = NavigationLink | { label: string; children: NavigationLink[] };

export const headerNavigation = (base = ""): NavigationItem[] => [
  { label: "Home", href: homeSection(base, "top") },
  {
    label: "About Us",
    children: [
      { label: "Who We Are", href: whoWeArePage },
      { label: "How We Do It", href: howWeDoItPage },
      { label: "Why We Do It", href: whyWeDoItPage },
      { label: "Alliances", href: homeSection(base, "alliances") },
      { label: "Our Clients", href: homeSection(base, "clients") },
      { label: "Our Board", href: boardPage },
      { label: "Our Team", href: teamPage },
    ],
  },
  {
    label: "Our Services",
    children: [...servicePages],
  },
  {
    label: "Resources",
    children: [
      { label: "Blog", href: blogPage },
      { label: "Our SDG’s Commitment", href: sdgPage },
    ],
  },
  {
    label: "Tools",
    children: [
      { label: "All tools", href: toolsPage },
      ...toolPages.map(({ label, href, badge }) => ({ label, href, ...(badge && { badge }) })),
    ],
  },
  { label: "Upcoming" },
  {
    label: "Careers",
    children: [
      { label: "Join our Team", href: careersPage },
      { label: "SAC Talent Shield", href: talentShieldPage },
    ],
  },
  { label: "FAQ" },
];

export const serviceNavigation = (base = ""): NavigationLink[] => [
  { label: "Information Security Management", href: homeSection(base, "services") },
  { label: "Data Protection & Privacy", href: homeSection(base, "services") },
  { label: "Business Continuity", href: homeSection(base, "services") },
  { label: "Enterprise Risk Management", href: homeSection(base, "services") },
];

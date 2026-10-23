// Every destination stays inside this project. Items without an `href` are pages that
// have not been built yet; the header shows them as "Soon" instead of linking away.

// Pages built in this project. Each one is a Vite entry listed in vite.config.ts.
export const whoWeArePage = "/who-we-are/";
export const howWeDoItPage = "/how-we-do-it/";
export const whyWeDoItPage = "/why-we-do-it/";
export const boardPage = "/board/";
export const teamPage = "/team/";
export const shopPage = "/shop/";
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
  { label: "Automation Tools", href: "/automation-tools/" },
  { label: "Rwanda DPP Registration", href: "/rwanda-dpp-registration/" },
] as const;

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
      { label: "Shop", href: shopPage },
      { label: "Blog", href: blogPage },
      { label: "Our SDG’s Commitment", href: sdgPage },
    ],
  },
  { label: "Travel Advisory", href: travelAdvisoryPage, badge: "New" },
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

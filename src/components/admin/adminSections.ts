import {
  BriefcaseBusiness,
  CalendarCheck,
  FileUser,
  GraduationCap,
  Handshake,
  Home,
  Images,
  Inbox,
  Info,
  Layers,
  LayoutDashboard,
  LibraryBig,
  MessageSquareQuote,
  Newspaper,
  PanelsTopLeft,
  Plane,
  Settings,
  ShoppingBag,
  UserCog,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

export type AdminSection = {
  id: string;
  label: string;
  icon: LucideIcon;
  /** What the section manages. */
  summary: string;
};

/**
 * Sidebar groups. Each section opens at /admin/#<id>. "Website pages" follows the site's
 * own menu; "Content library" holds items reused across pages, edited once.
 */
export const adminNavigation: { heading: string; sections: AdminSection[] }[] = [
  {
    heading: "Overview",
    sections: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        summary: "A summary of activity across the website.",
      },
    ],
  },
  {
    heading: "Inbox",
    sections: [
      {
        id: "feedback",
        label: "Customer feedback",
        icon: MessageSquareQuote,
        summary: "Private visitor feedback, reviewed separately from public testimonials.",
      },
      {
        id: "talent-applications",
        label: "Talent Shield applications",
        icon: FileUser,
        summary: "Programme applications and review stages.",
      },
      {
        id: "enquiries",
        label: "Enquiries",
        icon: Inbox,
        summary: "Free callback requests from the homepage, with the service each visitor chose.",
      },
      {
        id: "applications",
        label: "Job applications",
        icon: FileUser,
        summary: "Applications and expressions of interest from the Join our Team page.",
      },
      {
        id: "bookings",
        label: "Training bookings",
        icon: CalendarCheck,
        summary: "Public and in-house course bookings, delegates and payment status.",
      },
      {
        id: "orders",
        label: "Shop orders",
        icon: ShoppingBag,
        summary: "Self-study course purchases from the shop and their fulfilment.",
      },
    ],
  },
  {
    heading: "Website pages",
    sections: [
      {
        id: "upcoming",
        label: "Upcoming",
        icon: CalendarCheck,
        summary: "Prepare the upcoming events page.",
      },
      {
        id: "faq",
        label: "FAQ",
        icon: Info,
        summary: "Frequently asked questions, answers and categories.",
      },
      {
        id: "homepage",
        label: "Homepage",
        icon: Home,
        summary: "Hero, alliances, who we are, services, contact, clients and testimonials.",
      },
      {
        id: "about-pages",
        label: "About Us",
        icon: Info,
        summary: "Who We Are, How We Do It, Why We Do It, Our Board and Our Team.",
      },
      {
        id: "service-pages",
        label: "Our Services",
        icon: Layers,
        summary: "The six service pages.",
      },
      {
        id: "resource-pages",
        label: "Resources",
        icon: LibraryBig,
        summary: "Shop, Blog and Our SDG’s Commitment pages.",
      },
      {
        id: "career-pages",
        label: "Careers",
        icon: BriefcaseBusiness,
        summary: "Join our Team and SAC Talent Shield.",
      },
      {
        id: "travel",
        label: "Travel advisories",
        icon: Plane,
        summary:
          "Review official-source advisories and travel requirements before they appear on the public Travel Advisory page.",
      },
    ],
  },
  {
    heading: "Content library",
    sections: [
      {
        id: "events",
        label: "Events & sessions",
        icon: CalendarCheck,
        summary: "Event dates, venues and registration details.",
      },
      {
        id: "products",
        label: "Shop products",
        icon: ShoppingBag,
        summary: "Products, pricing and availability.",
      },
      {
        id: "articles",
        label: "Blog articles",
        icon: Newspaper,
        summary: "Write, schedule and publish articles for the blog.",
      },
      {
        id: "courses",
        label: "Training courses",
        icon: GraduationCap,
        summary: "The certification catalogue shown on the Training and Shop pages.",
      },
      {
        id: "people",
        label: "Team & board",
        icon: Users,
        summary: "Profiles, portraits and the order people appear on the Team and Board pages.",
      },
      {
        id: "testimonials",
        label: "Testimonials",
        icon: MessageSquareQuote,
        summary: "Client and delegate feedback.",
      },
      {
        id: "partners",
        label: "Partners & clients",
        icon: Handshake,
        summary: "Alliance and client logos.",
      },
      {
        id: "jobs",
        label: "Job openings",
        icon: BriefcaseBusiness,
        summary: "Roles on the Join our Team page.",
      },
      {
        id: "media",
        label: "Media library",
        icon: Images,
        summary: "Photographs, videos and documents used across the website.",
      },
    ],
  },
  {
    heading: "Administration",
    sections: [
      {
        id: "content-map",
        label: "Pages & API map",
        icon: PanelsTopLeft,
        summary: "Editor coverage, public destinations and proposed API contracts.",
      },
      {
        id: "site",
        label: "Header & footer",
        icon: PanelsTopLeft,
        summary: "Menus, offices and contact details shared by every page.",
      },
      {
        id: "staff",
        label: "Staff accounts",
        icon: UserCog,
        summary: "Invite colleagues, set their roles and remove access.",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        summary: "Organisation details, search defaults and console preferences.",
      },
    ],
  },
];

// Put the most common authoring tasks first; keep transaction inboxes separate.
const groupOrder = ["Overview", "Website pages", "Content library", "Inbox", "Administration"];
adminNavigation.sort((a, b) => groupOrder.indexOf(a.heading) - groupOrder.indexOf(b.heading));
const pagesGroup = adminNavigation.find((group) => group.heading === "Website pages");
const pageOrder = [
  "homepage",
  "about-pages",
  "service-pages",
  "resource-pages",
  "upcoming",
  "career-pages",
  "faq",
  "travel",
];
pagesGroup?.sections.sort((a, b) => pageOrder.indexOf(a.id) - pageOrder.indexOf(b.id));

/** Reached from the profile menu rather than the sidebar. */
export const profileSection: AdminSection = {
  id: "profile",
  label: "My profile",
  icon: UserRound,
  summary: "Your name, photograph, password and sign-in history.",
};

export const allSections = [...adminNavigation.flatMap((group) => group.sections), profileSection];

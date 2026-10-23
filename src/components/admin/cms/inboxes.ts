import { CalendarCheck, FileUser, Inbox, ShoppingBag, UserCog, UserPlus } from "lucide-react";
import { careersPage, contactLink, shopPage } from "../../site/navigation";
import type { InboxDef } from "./InboxView";

export const inboxes: InboxDef[] = [
  {
    id: "feedback",
    title: "Customer feedback",
    description:
      "Private feedback from visitors and clients. Publication as a testimonial requires a separate editorial decision and permission.",
    icon: Inbox,
    source: { label: "View contact section", url: contactLink() },
    today:
      "Feedback collection is not connected. Submissions will appear here after a shared form service is configured; nothing is published automatically.",
    columns: ["Sender", "Subject", "Received", "Assigned to", "Status"],
    statuses: ["New", "In review", "Responded", "Closed"],
  },
  {
    id: "talent-applications",
    title: "Talent Shield applications",
    description: "Review programme applications separately from recruitment.",
    icon: FileUser,
    source: { label: "View Talent Shield", url: "/talent-shield/" },
    today:
      "Application storage is not connected. This workspace will show submissions when the programme application service is configured.",
    columns: ["Applicant", "Cohort", "Received", "Reviewer", "Stage"],
    statuses: [
      "Received",
      "Eligibility review",
      "Documents requested",
      "Interview",
      "Decision recorded",
    ],
  },
  {
    id: "enquiries",
    title: "Enquiries",
    description: "Free callback requests from the homepage, with the service each visitor chose.",
    icon: Inbox,
    source: { label: "View the callback form", url: contactLink() },
    today:
      "Callback requests currently open the visitor’s email app and arrive at info@sentinelafricaconsulting.com. Once a form service is connected they are also listed here to assign and answer.",
    columns: ["Name", "Phone", "Interested in", "Received", "Assigned to", "Status"],
    statuses: ["New", "In progress", "Responded"],
  },
  {
    id: "applications",
    title: "Job applications",
    description: "Applications and expressions of interest from the Join our Team page.",
    icon: FileUser,
    source: { label: "View Join our Team", url: careersPage },
    today:
      "Applications currently arrive by email at each role’s address, with documents attached. Once a form service is connected they are listed here with their CVs.",
    columns: ["Applicant", "Role", "Email", "Phone", "Received", "Stage"],
    statuses: ["New", "Shortlisted", "Interview", "Closed"],
  },
  {
    id: "bookings",
    title: "Training bookings",
    description:
      "Public and in-house course bookings, session dates, delegates and payment status.",
    icon: CalendarCheck,
    source: { label: "View Training page", url: "/training/" },
    today:
      "Training requests currently reach the team through the callback form with “Training” chosen. Bookings appear here once online booking is connected.",
    columns: ["Delegate", "Organisation", "Course", "Format", "Session", "Payment"],
    statuses: ["Pending", "Confirmed", "Paid", "Cancelled"],
  },
  {
    id: "orders",
    title: "Shop orders",
    description: "Self-study course purchases from the shop and their fulfilment.",
    icon: ShoppingBag,
    source: { label: "View Shop", url: shopPage },
    today: "Online checkout is not connected yet. Orders appear here once payments are set up.",
    columns: ["Order", "Customer", "Course", "Amount", "Date", "Status"],
    statuses: ["Pending", "Paid", "Fulfilled", "Refunded"],
  },
  {
    id: "staff",
    title: "Staff accounts",
    description: "Invite colleagues, set their roles and remove access.",
    icon: UserCog,
    source: { label: "View sign-in page", url: "/staff-login/" },
    today:
      "Sign-in is a layout until an account service is connected. Roles will control who can edit content, publish and manage the inbox.",
    columns: ["Name", "Email", "Role", "Last active", "Status"],
    statuses: ["Active", "Invited", "Suspended"],
    rows: [["Administrator", "—", "Super admin", "Now", "Active"]],
    action: { label: "Invite a colleague", icon: UserPlus },
  },
];

export const inboxFor = (id: string) => inboxes.find((inbox) => inbox.id === id);

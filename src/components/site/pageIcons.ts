import {
  Bot,
  ClipboardCheck,
  Briefcase,
  FileCheck2,
  GraduationCap,
  Handshake,
  Plane,
  ShieldHalf,
  type LucideIcon,
} from "lucide-react";

/** Icons for the service and tool pages, shared by every list of them. */
export const pageIcons: Record<string, LucideIcon> = {
  Consultancy: Briefcase,
  "Managed Services": Handshake,
  Training: GraduationCap,
  Cybershield: ShieldHalf,
  "Our Software Products": Bot,
  "Rwanda DPP Registration": FileCheck2,
  "Travel Advisory": Plane,
  "Certification Readiness & Implementation Planner": ClipboardCheck,
};

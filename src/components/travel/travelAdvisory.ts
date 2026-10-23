import rawData from "@/content/travel-advisory.json";

// Records follow the rules of the Sentinel Africa travel portal: every one comes from an
// official source, is reviewed by an editor before it is added, and anything without a
// record is shown as "not verified", never as safe or as having no requirement.

/** An editor-written summary of an official advisory for one country. */
export interface Advisory {
  id: string;
  country: string;
  title: string;
  summary: string;
  /** Affected provinces or regions, as named by the source. */
  regions?: string;
  sourceName: string;
  sourceUrl: string;
  /** Dates are ISO (YYYY-MM-DD). */
  publishedDate: string;
  reviewedAt: string;
}

/** Which part of a journey a requirement applies to in its country. */
export type Direction = "exit" | "entry" | "transit";
export type Category = "restriction" | "declaration" | "screening" | "transit" | "airline";

/** A sourced entry, exit, transit or airline requirement. */
export interface Requirement {
  id: string;
  country: string;
  direction: Direction;
  category: Category;
  /** Set only when the requirement is specific to one airline. */
  airline?: string;
  title: string;
  detail: string;
  sourceName: string;
  sourceUrl: string;
  publishedDate: string;
  effectiveFrom?: string;
  effectiveUntil?: string;
  reviewedAt: string;
}

export interface OfficialSource {
  name: string;
  publisher: string;
  url: string;
}

export interface TravelData {
  /** When an editor last reviewed the records, or null before the first review. */
  lastReviewed: string | null;
  countries: string[];
  airlines: { name: string; url: string }[];
  sources: OfficialSource[];
  advisories: Advisory[];
  requirements: Requirement[];
}

export const travelData = rawData as TravelData;

/** Countries that have no records of their own and only point to the official sources. */
export const unmatchedCountry = "Other country";
export const unmatchedAirline = "Other airline";

export interface Journey {
  from: string;
  to: string;
  /** Empty when the journey is direct. */
  via: string;
  /** ISO date of departure. */
  date: string;
  airline: string;
  flight: string;
}

export type StopRole = "departure" | "transit" | "destination";

/** The checks shown for each part of the journey. */
const checksByRole: Record<
  StopRole,
  { label: string; category: Category; direction: Direction }[]
> = {
  departure: [
    { label: "Exit restrictions", category: "restriction", direction: "exit" },
    { label: "Exit screening", category: "screening", direction: "exit" },
  ],
  transit: [
    { label: "Transit rules", category: "transit", direction: "transit" },
    { label: "Transit screening", category: "screening", direction: "transit" },
  ],
  destination: [
    { label: "Entry restrictions", category: "restriction", direction: "entry" },
    { label: "Health declarations", category: "declaration", direction: "entry" },
    { label: "Arrival screening", category: "screening", direction: "entry" },
  ],
};

export interface CheckResult {
  label: string;
  records: Requirement[];
}

export interface StopReport {
  role: StopRole;
  country: string;
  advisories: Advisory[];
  checks: CheckResult[];
}

export interface JourneyReport {
  stops: StopReport[];
  airline: { name: string; url: string; records: Requirement[] } | null;
  verified: number;
  total: number;
}

const same = (a = "", b = "") => a.localeCompare(b, undefined, { sensitivity: "accent" }) === 0;

/** Whether a requirement is in force on the departure date. Missing bounds are open. */
const inForce = (record: Requirement, date: string) =>
  (!record.effectiveFrom || date >= record.effectiveFrom) &&
  (!record.effectiveUntil || date <= record.effectiveUntil);

/** Matches published records to each country on the journey, in travel order. */
export function buildReport(journey: Journey, data: TravelData = travelData): JourneyReport {
  const stops: [StopRole, string][] = [
    ["departure", journey.from],
    ...(journey.via ? ([["transit", journey.via]] as [StopRole, string][]) : []),
    ["destination", journey.to],
  ];
  // An airline-specific requirement only applies when that airline is chosen.
  const applies = (record: Requirement) =>
    inForce(record, journey.date) && (!record.airline || same(record.airline, journey.airline));

  const report: StopReport[] = stops.map(([role, country]) => ({
    role,
    country,
    advisories: data.advisories
      .filter((advisory) => same(advisory.country, country))
      .sort((a, b) => b.publishedDate.localeCompare(a.publishedDate)),
    checks: checksByRole[role].map(({ label, category, direction }) => ({
      label,
      records: data.requirements.filter(
        (record) =>
          applies(record) &&
          same(record.country, country) &&
          record.category === category &&
          record.direction === direction,
      ),
    })),
  }));

  const chosen = data.airlines.find((airline) => same(airline.name, journey.airline));
  const airline = chosen
    ? {
        ...chosen,
        records: data.requirements.filter(
          (record) => record.category === "airline" && applies(record) && !!record.airline,
        ),
      }
    : null;

  const results = [...report.flatMap((stop) => stop.checks), ...(airline ? [airline] : [])];
  return {
    stops: report,
    airline,
    verified: results.filter((result) => result.records.length > 0).length,
    total: results.length,
  };
}

/** Today's date in the visitor's time zone, as YYYY-MM-DD. */
export const today = () => {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
};

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

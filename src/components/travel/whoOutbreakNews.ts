import { useEffect, useState } from "react";

// Live reports from the WHO Disease Outbreak News (DON) API. WHO allows browsers to call it
// directly and caches answers for 15 minutes, so no server of our own is needed to read it.
// These are WHO's own reports, shown with their title, dates and a link; they are never
// treated as Sentinel Africa reviewed records, which only editors publish.

const api = "https://www.who.int/api/emergencies";
const reportPage = "https://www.who.int/emergencies/disease-outbreak-news/item/";
export const whoNewsPage = "https://www.who.int/emergencies/disease-outbreak-news";

/** Reports from this many days back are fetched. */
const windowDays = 365;
/** A report edited more than this long after it was published is flagged as updated. */
const updatedAfterMs = 24 * 60 * 60 * 1000;

export interface WhoCountry {
  /** WHO's official name, for example "United Republic of Tanzania". */
  name: string;
  /** The same country as named on this site, when it is in the journey list. */
  siteName: string | null;
}

export interface WhoReport {
  donId: string;
  title: string;
  /** ISO timestamps from WHO. */
  published: string;
  modified: string;
  /** Edited by WHO after it was first published. */
  updated: boolean;
  url: string;
  countries: WhoCountry[];
}

// WHO names that differ from the names used in this site's journey list.
const siteNames: Record<string, string> = {
  "United Republic of Tanzania": "Tanzania",
  "United States of America": "United States",
  "United Kingdom of Great Britain and Northern Ireland": "United Kingdom",
};

type RawReport = {
  DonId?: unknown;
  Title?: unknown;
  OverrideTitle?: unknown;
  UseOverrideTitle?: unknown;
  PublicationDate?: unknown;
  LastModified?: unknown;
  UrlName?: unknown;
  regionscountries?: unknown;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const isTimestamp = (value: string) => !Number.isNaN(Date.parse(value));

async function getJson(url: string) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`WHO answered ${response.status}`);
  return (await response.json()) as unknown;
}

// Country names rarely change, so each one is looked up once per visit.
const countryCache = new Map<string, Promise<string>>();

function countryName(id: string) {
  let name = countryCache.get(id);
  if (!name) {
    const query = new URLSearchParams({ $select: "Title" });
    name = getJson(`${api}/hierarchy-taxa(${id})?${query}`)
      .then((data) => text((data as { Title?: unknown }).Title))
      .catch(() => "");
    countryCache.set(id, name);
  }
  return name;
}

/** Fetches WHO's Ebola outbreak reports of the past year, newest first, with their countries. */
export async function fetchEbolaReports(): Promise<WhoReport[]> {
  const since = new Date(Date.now() - windowDays * 86_400_000).toISOString().slice(0, 10);
  const query = new URLSearchParams({
    $filter: `contains(Title,'Ebola') and PublicationDate ge ${since}T00:00:00Z`,
    $orderby: "PublicationDate desc",
    $top: "50",
    $select:
      "DonId,Title,OverrideTitle,UseOverrideTitle,PublicationDate,LastModified,UrlName,regionscountries",
  });
  const data = (await getJson(`${api}/diseaseoutbreaknews?${query}`)) as {
    value?: unknown;
  };
  if (!Array.isArray(data.value)) throw new Error("WHO returned an unexpected response");

  const reports = await Promise.all(
    (data.value as RawReport[]).map(async (raw): Promise<WhoReport | null> => {
      const donId = text(raw.DonId);
      const urlName = text(raw.UrlName);
      const published = text(raw.PublicationDate);
      const modified = text(raw.LastModified) || published;
      const title = (raw.UseOverrideTitle === true && text(raw.OverrideTitle)) || text(raw.Title);
      // Anything malformed is left out rather than shown half-complete.
      if (!donId || !title || !/^[\w-]+$/.test(urlName) || !isTimestamp(published)) return null;
      const ids = Array.isArray(raw.regionscountries)
        ? raw.regionscountries.filter(
            (id): id is string => typeof id === "string" && /^[0-9a-f-]{36}$/i.test(id),
          )
        : [];
      const names = (await Promise.all(ids.map((id) => countryName(id)))).filter(Boolean);
      return {
        donId,
        title,
        published,
        modified,
        updated: Date.parse(modified) - Date.parse(published) > updatedAfterMs,
        url: reportPage + urlName,
        countries: names.map((name) => ({ name, siteName: siteNames[name] ?? name })),
      };
    }),
  );
  return reports.filter((report): report is WhoReport => report !== null);
}

/** WHO reports that name a country of the journey list. */
export const reportsFor = (reports: WhoReport[], country: string) =>
  reports.filter((report) => report.countries.some((entry) => entry.siteName === country));

export type WhoState =
  | { status: "loading" }
  | { status: "ready"; reports: WhoReport[]; checkedAt: Date }
  | { status: "error" };

// One request serves every part of the page that shows WHO reports.
let shared: Promise<{ reports: WhoReport[]; checkedAt: Date }> | null = null;

/** Forgets fetched reports, so the next read asks WHO again. */
export function clearWhoCache() {
  shared = null;
  countryCache.clear();
}

function loadShared() {
  shared ??= fetchEbolaReports().then((reports) => ({ reports, checkedAt: new Date() }));
  shared.catch(() => {
    shared = null;
  });
  return shared;
}

/** WHO's Ebola reports for the page, with loading and error states. `reload` asks WHO again. */
export function useWhoReports() {
  const [state, setState] = useState<WhoState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: "loading" });
    loadShared().then(
      (result) => active && setState({ status: "ready", ...result }),
      () => active && setState({ status: "error" }),
    );
    return () => {
      active = false;
    };
  }, [attempt]);

  const reload = () => {
    clearWhoCache();
    setAttempt((count) => count + 1);
  };
  return { state, reload };
}

export const formatWhoDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

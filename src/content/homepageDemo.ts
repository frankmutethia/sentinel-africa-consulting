import { homepage as original } from "./homepage";
import { alliances as originalAlliances, clients as originalClients } from "./brands";
import { publishedBlock } from "@/components/admin/cms/prototypeStore";
import type { Values } from "@/components/admin/cms/types";

export type HomeSnapshot = Record<string, Values>;
export const homeSources = [
  ["homepage", "home", "hero"],
  ["homepage", "home", "alliances"],
  ["homepage", "home", "about"],
  ["homepage", "home", "services"],
  ["homepage", "home", "contact"],
  ["homepage", "home", "clients"],
  ["homepage", "home", "testimonials"],
  ["testimonials", "testimonials", "items"],
  ["partners", "alliances", "alliances"],
  ["partners", "clients", "clients"],
] as const;
export const sourceId = (editor: string, page: string, block: string) =>
  `${editor}/${page}/${block}`;

export function resolveHomepage(snapshot: HomeSnapshot = {}) {
  const content = structuredClone(original);
  for (const key of Object.keys(content) as (keyof typeof content)[]) {
    Object.assign(content[key], snapshot[sourceId("homepage", "home", key)]);
  }
  const quotes = snapshot["testimonials/testimonials/items"]?.["items"];
  if (Array.isArray(quotes))
    content.testimonials.items = quotes as typeof content.testimonials.items;
  return {
    homepage: content,
    alliances: (snapshot["partners/alliances/alliances"]?.["items"] ??
      originalAlliances) as typeof originalAlliances,
    clients: (snapshot["partners/clients/clients"]?.["items"] ??
      originalClients) as typeof originalClients,
  };
}

function loadSnapshot(): HomeSnapshot {
  const snapshot: HomeSnapshot = {};
  for (const [editor, page, block] of homeSources) {
    const revision = publishedBlock(editor, page, block);
    if (revision) snapshot[sourceId(editor, page, block)] = revision.values;
  }
  try {
    const token = new URLSearchParams(window.location.search).get("homePreview");
    if (token)
      Object.assign(snapshot, JSON.parse(sessionStorage.getItem(`home-preview:${token}`) ?? "{}"));
  } catch {
    /* A missing preview retains the published page. */
  }
  return snapshot;
}

export const { homepage, alliances, clients } = resolveHomepage(loadSnapshot());

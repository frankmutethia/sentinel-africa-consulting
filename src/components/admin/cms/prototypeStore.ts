import type { Values } from "./types";

/** Prototype adapter only. Production replaces this with authenticated HTTP calls. */
export interface ContentRevision {
  values: Values;
  savedAt: string;
}
export interface PageRelease {
  id: string;
  publishedAt: string;
  blocks: Record<string, ContentRevision>;
}
export const draftKey = (editor: string, page: string, block: string) =>
  `sentinel-cms:${editor}:${page}:${block}`;
export function readDraft(key: string): ContentRevision | null {
  try {
    const data = JSON.parse(localStorage.getItem(key) ?? "null");
    return data && typeof data.values === "object" && typeof data.savedAt === "string"
      ? data
      : null;
  } catch {
    return null;
  }
}
export function writeDraft(key: string, draft: ContentRevision | null) {
  try {
    if (draft) localStorage.setItem(key, JSON.stringify(draft));
    else localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}
const releaseKey = (editor: string, page: string) => `sentinel-cms-releases:${editor}:${page}`;
export function releasesFor(editor: string, page: string): PageRelease[] {
  try {
    return JSON.parse(localStorage.getItem(releaseKey(editor, page)) ?? "[]");
  } catch {
    return [];
  }
}
export function publishedBlock(editor: string, page: string, block: string) {
  return releasesFor(editor, page)[0]?.blocks[block];
}
export function publishPrototype(
  editor: string,
  page: string,
  blocks: Record<string, ContentRevision>,
) {
  const previous = releasesFor(editor, page);
  const release: PageRelease = {
    id: crypto.randomUUID(),
    publishedAt: new Date().toISOString(),
    blocks: { ...previous[0]?.blocks, ...blocks },
  };
  // Write the release before removing drafts; a storage failure must never lose work.
  localStorage.setItem(
    releaseKey(editor, page),
    JSON.stringify([release, ...previous].slice(0, 10)),
  );
  for (const block of Object.keys(blocks)) writeDraft(draftKey(editor, page, block), null);
  return release;
}

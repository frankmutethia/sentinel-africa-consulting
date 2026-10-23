import context from "@/content/admin-page-context.json";
import type { Block, ContentEditorDef, Field, Value, Values } from "./types";

const assets = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp,svg,mp4,pdf}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;
const label = (key: string) =>
  key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
function resolve(value: unknown): Value {
  if (typeof value === "string") return assets[value] ?? value;
  if (Array.isArray(value))
    return value.map((item) =>
      typeof item === "object"
        ? Object.fromEntries(Object.entries(item).map(([key, v]) => [key, resolve(v)]))
        : String(item),
    ) as Value;
  return typeof value === "boolean" ? value : String(value ?? "");
}
function fieldsFor(items: Record<string, unknown>[]): Field[] {
  const keys = [...new Set(items.flatMap((item) => Object.keys(item)))];
  return keys
    .filter((key) => !["id", "tone", "className", "icon"].includes(key))
    .map((key) => {
      const example = items.find((item) => item[key] !== undefined)?.[key];
      if (Array.isArray(example)) {
        if (example.some((item) => typeof item === "object"))
          return {
            key,
            label: label(key),
            type: "list",
            itemLabel: "Item",
            fields: fieldsFor(example.filter((item) => typeof item === "object")),
            wide: true,
          };
        return { key, label: label(key), type: "paragraphs", wide: true };
      }
      if (typeof example === "boolean") return { key, label: label(key), type: "toggle" };
      if (typeof example === "string" && /\.(png|jpe?g|webp|svg)$/.test(example))
        return { key, label: label(key), type: "image" };
      return {
        key,
        label: label(key),
        type: typeof example === "string" && example.length > 100 ? "textarea" : "text",
        wide: true,
      };
    });
}

/** Exact source fixtures for the handoff prototype, kept separate from UI and future API. */
export function populatePageContexts(editors: ContentEditorDef[]) {
  for (const editor of editors)
    for (const page of editor.pages) {
      const seed = (context as unknown as Record<string, (typeof context)["who-we-are"]>)[page.id];
      if (!seed) continue;
      const header = page.blocks.find((block) => block.id === "header");
      if (header) {
        header.values = { ...header.values, ...seed.hero } as Values;
        header.source = "live";
      }
      const shared = page.blocks.filter((block) => block.collection);
      const controls = page.blocks.filter((block) =>
        ["status", "testimonial", "eligibility", "interest"].includes(block.id),
      );
      const media: Block[] = Object.keys(seed.media).length
        ? [
            {
              id: "page-media",
              label: "Page photos & video",
              description:
                "Current media used by this page. Replace files without changing the page layout.",
              source: "live",
              fields: Object.entries(seed.media).map(([key, path]): Field => ({
                key,
                label: label(key),
                type: /\.mp4$/.test(path) ? "video" : /\.pdf$/.test(path) ? "file" : "image",
                wide: true,
              })),
              values: Object.fromEntries(
                Object.entries(seed.media).map(([key, path]) => [key, assets[path] ?? path]),
              ),
            },
          ]
        : [];
      const sections: Block[] = seed.sections.map((section, index) => {
        const fields: Field[] = [];
        const values: Values = {};
        if (section.headings.length) {
          fields.push({ key: "headings", label: "Headings", type: "paragraphs", wide: true });
          values["headings"] = section.headings;
        }
        if (section.paragraphs.length) {
          fields.push({ key: "paragraphs", label: "Section text", type: "paragraphs", wide: true });
          values["paragraphs"] = section.paragraphs;
        }
        for (const list of section.lists) {
          const items = list.items as unknown[];
          fields.push(
            items.every((item) => typeof item === "string")
              ? { key: list.key, label: label(list.key), type: "paragraphs", wide: true }
              : {
                  key: list.key,
                  label: label(list.key),
                  type: "list",
                  itemLabel: "Item",
                  fields: fieldsFor(items as Record<string, unknown>[]),
                  wide: true,
                },
          );
          values[list.key] = resolve(items);
        }
        return {
          id: `content-${index + 1}`,
          label: section.label.length > 65 ? `${section.label.slice(0, 62)}…` : section.label,
          description: `Section ${index + 1} on ${page.label}. Initial wording comes from the current public page.`,
          source: "live",
          fields,
          values,
        };
      });
      const usedLists = new Set(
        seed.sections.flatMap((section) => section.lists.map((list) => list.key)),
      );
      const extraLists: Block[] = Object.entries(seed.constants).flatMap(([key, items]) => {
        if (!Array.isArray(items) || !items.length || usedLists.has(key)) return [];
        return [
          {
            id: `details-${key}`,
            label: label(key),
            description: `Supporting ${label(key).toLowerCase()} on ${page.label}.`,
            source: "live" as const,
            fields: [
              items.every((item) => typeof item === "string")
                ? { key: "items", label: label(key), type: "paragraphs" as const, wide: true }
                : {
                    key: "items",
                    label: label(key),
                    type: "list" as const,
                    itemLabel: "Item",
                    fields: fieldsFor(items as Record<string, unknown>[]),
                    wide: true,
                  },
            ],
            values: { items: resolve(items) },
          },
        ];
      });
      page.blocks = [
        ...(header ? [header] : []),
        ...media,
        ...sections,
        ...extraLists,
        ...controls,
        ...shared,
        {
          id: "closing-cta",
          label: "Closing invitation",
          description: "Shared closing invitation, where displayed on this page.",
          source: "live",
          fields: [
            { key: "heading", label: "Heading", type: "text" },
            { key: "label", label: "Button label", type: "text" },
            { key: "href", label: "Button destination", type: "text" },
          ],
          values: {
            heading: "Your next step starts with a conversation.",
            label: "Request a free callback",
            href: "/#contact",
          },
        },
      ];
    }
}

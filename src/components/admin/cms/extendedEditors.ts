import type { ContentEditorDef, Field } from "./types";

const text = (key: string, label: string): Field => ({ key, label, type: "text" });
const body = (key: string, label: string): Field => ({ key, label, type: "textarea", wide: true });
const date = (key: string, label: string): Field => ({ key, label, type: "date" });
const image = (key: string, label: string): Field => ({ key, label, type: "image" });
const list = (key: string, label: string, itemLabel: string, fields: Field[]): Field => ({
  key,
  label,
  itemLabel,
  fields,
  type: "list",
  titleKey: "title",
  wide: true,
});

export const extendedEditors: ContentEditorDef[] = [
  {
    id: "upcoming",
    overline: "Website pages",
    title: "Upcoming",
    description:
      "Prepare the events landing page. Event dates and registration details are maintained in Events & sessions.",
    pages: [
      {
        id: "upcoming",
        label: "Upcoming",
        url: "/upcoming/",
        planned: true,
        blocks: [
          {
            id: "intro",
            label: "Page introduction",
            description: "Heading and introduction above the event list.",
            source: "layout",
            fields: [
              text("title", "Heading"),
              body("intro", "Introduction"),
              image("image", "Header image"),
              text("imageAlt", "Image description"),
            ],
          },
          {
            id: "events",
            label: "Events",
            description: "Maintain each event once, including training sessions.",
            source: "layout",
            collection: { editor: "events", label: "Events & sessions", count: 0 },
          },
        ],
      },
    ],
  },
  {
    id: "faq",
    overline: "Website pages",
    title: "FAQ",
    description: "Organise frequently asked questions into clear categories.",
    pages: [
      {
        id: "faq",
        label: "FAQ",
        url: "/faq/",
        planned: true,
        blocks: [
          {
            id: "intro",
            label: "Page introduction",
            description: "Explain how visitors can find help.",
            source: "layout",
            fields: [text("title", "Heading"), body("intro", "Introduction")],
          },
          {
            id: "questions",
            label: "Questions & answers",
            description: "Reorder questions in the order visitors should read them.",
            source: "layout",
            fields: [
              list("items", "Questions", "Question", [
                text("title", "Question"),
                text("category", "Category"),
                body("answer", "Answer"),
                { key: "visible", label: "Show when published", type: "toggle" },
              ]),
            ],
          },
        ],
      },
    ],
  },
  {
    id: "events",
    overline: "Content library",
    title: "Events & sessions",
    description:
      "Shared event records for Upcoming and Training. Each session has its own date, venue and registration destination.",
    pages: [
      {
        id: "events",
        label: "Events & sessions",
        url: "/training/",
        blocks: [
          {
            id: "items",
            label: "Events & sessions",
            description:
              "Prepare events without changing the public training calendar until publishing is connected.",
            source: "layout",
            fields: [
              list("items", "Events", "Event", [
                text("title", "Event title"),
                text("course", "Related course identifier"),
                body("description", "Description"),
                date("startDate", "Start date"),
                date("endDate", "End date"),
                text("time", "Time"),
                text("timezone", "Time zone, e.g. Africa/Nairobi"),
                text("venue", "Venue or online platform"),
                text("format", "Delivery format"),
                text("capacity", "Available places"),
                text("registrationUrl", "Registration destination"),
                image("image", "Event image"),
                text("imageAlt", "Image description"),
                { key: "featured", label: "Feature on Upcoming", type: "toggle" },
              ]),
            ],
          },
        ],
      },
    ],
  },
];

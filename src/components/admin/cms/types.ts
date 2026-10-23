// The shape of every content editor in the staff console. An editor is a list of website
// pages; each page is a list of sections (blocks) in the order they appear on the site;
// each section is a set of fields. One generic editor renders them all.

export type Value = string | boolean | string[] | Item[];
export type Item = { [key: string]: Value };
export type Values = { [key: string]: Value };

interface FieldBase {
  key: string;
  label: string;
  hint?: string;
  /** Spans the full form width. */
  wide?: boolean;
}

export type Field =
  | (FieldBase & { type: "richtext" | "text" | "textarea" | "url" | "email" | "date" })
  /** An image: the current file is shown and can be replaced. */
  | (FieldBase & { type: "image" | "video" | "file" })
  | (FieldBase & { type: "select"; options: { value: string; label: string }[] })
  | (FieldBase & { type: "toggle" })
  /** Short labels, added and removed as chips. */
  | (FieldBase & { type: "tags" })
  /** Several paragraphs of body text. */
  | (FieldBase & { type: "paragraphs" })
  /** Repeatable items such as services, testimonials or logos. */
  | (FieldBase & { type: "list"; itemLabel: string; titleKey?: string; fields: Field[] });

export interface Block {
  id: string;
  label: string;
  description: string;
  /** Anchor or address of this section on the website. */
  view?: string;
  fields?: Field[];
  values?: Values;
  /** The section lists items managed in another editor, such as Testimonials. */
  collection?: { editor: string; page?: string; label: string; count: number };
  /**
   * "live": the fields hold what the website shows now. "layout": the fields are defined,
   * but this section's content has not yet moved out of the page code.
   */
  source: "live" | "layout";
}

export interface ContentPage {
  id: string;
  label: string;
  /** Where the page lives on the website. */
  url: string;
  /** The public page has not been built yet; never link to a nonexistent destination. */
  planned?: boolean;
  blocks: Block[];
}

export interface ContentEditorDef {
  id: string;
  overline: string;
  title: string;
  description: string;
  pages: ContentPage[];
}

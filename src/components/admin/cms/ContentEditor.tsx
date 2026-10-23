import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  ChevronDown,
  CircleDot,
  Database,
  ImageUp,
  Info,
  Layers,
  LayoutTemplate,
  Plus,
  RotateCcw,
  Save,
  Send,
  Trash2,
  X,
} from "lucide-react";
import type { Block, ContentEditorDef, Field, Item, Value, Values } from "./types";
import { navigateAdmin, useAdminLocation } from "../adminLocation";
import {
  draftKey,
  readDraft,
  writeDraft,
  publishedBlock,
  publishPrototype,
  releasesFor,
} from "./prototypeStore";
import { TextEditor } from "./TextEditor";
import { HomePreview } from "./HomePreview";
import { contentEditors } from "./editors";
import { homeSources, sourceId, type HomeSnapshot } from "@/content/homepageDemo";
import { ContentReview } from "./ContentReview";

// Drafts are kept in this browser until a content service is connected; then Publish
// sends them to it and the website reads the published version.
const emptyValue = (field: Field): Value =>
  field.type === "toggle"
    ? false
    : field.type === "list" || field.type === "tags" || field.type === "paragraphs"
      ? []
      : "";

const asText = (value: Value | undefined) => (typeof value === "string" ? value : "");
const asStrings = (value: Value | undefined) =>
  Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
const asItems = (value: Value | undefined) =>
  Array.isArray(value)
    ? value.filter((entry): entry is Item => typeof entry === "object" && entry !== null)
    : [];

const clock = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

// ---------------------------------------------------------------- Fields

function ImageField({
  id,
  value,
  onChange,
  kind = "image",
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  kind?: "image" | "video" | "file";
}) {
  const input = useRef<HTMLInputElement>(null);
  const [note, setNote] = useState("");
  const choose = (file?: File) => {
    if (!file) return;
    if (
      (kind === "image" && !file.type.startsWith("image/")) ||
      (kind === "video" && !file.type.startsWith("video/")) ||
      (kind === "file" && file.type !== "application/pdf")
    ) {
      setNote(`Choose a ${kind === "file" ? "PDF document" : kind + " file"}.`);
      return;
    }
    // Small files are kept with the draft; larger ones are previewed until the page reloads.
    if (file.size <= 400_000) {
      const reader = new FileReader();
      reader.onload = () => onChange(String(reader.result));
      reader.readAsDataURL(file);
      setNote(`${file.name} · browser draft only; publishing is not connected`);
    } else {
      onChange(URL.createObjectURL(file));
      setNote(`${file.name} · preview only, uploaded when publishing is connected`);
    }
  };
  const isImage = kind === "image" && value && !/\.pdf($|\?)/i.test(value);
  return (
    <div className="cms-image">
      <div className="cms-image-preview">
        {kind === "video" && value ? (
          <video src={value} controls preload="metadata" aria-label="Video preview" />
        ) : isImage ? (
          <img src={value} alt="" />
        ) : (
          <span>
            <ImageUp size={22} aria-hidden="true" />
            {value ? "File attached" : "No file"}
          </span>
        )}
      </div>
      <div className="cms-image-actions">
        <button
          type="button"
          className="admin-button is-ghost is-small"
          onClick={() => input.current?.click()}
        >
          <ImageUp size={14} aria-hidden="true" /> {value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            className="admin-button is-ghost is-small"
            onClick={() => {
              onChange("");
              setNote("");
            }}
          >
            Remove
          </button>
        )}
        <input
          ref={input}
          id={id}
          type="file"
          accept={kind === "image" ? "image/*" : kind === "video" ? "video/*" : "application/pdf"}
          hidden
          onChange={(event) => choose(event.target.files?.[0])}
        />
        {note && <p className="admin-field-hint">{note}</p>}
      </div>
    </div>
  );
}

function TagsField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const [draft, setDraft] = useState("");
  const add = () => {
    const entry = draft.trim();
    if (entry && !value.includes(entry)) onChange([...value, entry]);
    setDraft("");
  };
  return (
    <div className="cms-tags">
      {value.map((tag) => (
        <span key={tag} className="cms-tag">
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(value.filter((entry) => entry !== tag))}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        placeholder="Type and press Enter"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
          if (event.key === "Enter" || event.key === ",") {
            event.preventDefault();
            add();
          } else if (event.key === "Backspace" && !draft && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={add}
      />
    </div>
  );
}

function ParagraphsField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const update = (index: number, text: string) =>
    onChange(value.map((entry, i) => (i === index ? text : entry)));
  return (
    <div className="cms-paragraphs">
      {value.map((paragraph, index) => (
        <div key={index} className="cms-paragraph">
          <textarea
            id={index === 0 ? id : undefined}
            aria-label={`Paragraph ${index + 1}`}
            rows={Math.min(8, Math.max(2, Math.ceil(paragraph.length / 90)))}
            value={paragraph}
            onChange={(event) => update(index, event.target.value)}
          />
          <button
            type="button"
            className="cms-icon-button"
            aria-label={`Remove paragraph ${index + 1}`}
            onClick={() => onChange(value.filter((_, i) => i !== index))}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" className="cms-add" onClick={() => onChange([...value, ""])}>
        <Plus size={15} aria-hidden="true" /> Add paragraph
      </button>
    </div>
  );
}

function ListField({
  field,
  value,
  onChange,
  idPrefix,
}: {
  field: Extract<Field, { type: "list" }>;
  value: Item[];
  onChange: (value: Item[]) => void;
  idPrefix: string;
}) {
  const [open, setOpen] = useState<number | null>(value.length ? null : 0);
  const titleOf = (item: Item, index: number) =>
    asText(item[field.titleKey ?? field.fields[0]?.key ?? ""]) || `${field.itemLabel} ${index + 1}`;
  const move = (index: number, step: number) => {
    const next = [...value];
    const [entry] = next.splice(index, 1);
    next.splice(index + step, 0, entry!);
    onChange(next);
    setOpen(open === index ? index + step : open);
  };
  const add = () => {
    onChange([...value, Object.fromEntries(field.fields.map((f) => [f.key, emptyValue(f)]))]);
    setOpen(value.length);
  };
  return (
    <div className="cms-list">
      <p className="cms-list-count">
        {value.length}{" "}
        {value.length === 1 ? field.itemLabel.toLowerCase() : `${field.itemLabel.toLowerCase()}s`}
      </p>
      <button type="button" className="admin-button" onClick={add}>
        <Plus size={15} /> Create {field.itemLabel.toLowerCase()}
      </button>
      <ol>
        {value.map((item, index) => {
          const expanded = open === index;
          const title = titleOf(item, index);
          const thumb = field.fields.find((f) => f.type === "image");
          const thumbSrc = thumb ? asText(item[thumb.key]) : "";
          return (
            <li key={index} className={`cms-list-item ${expanded ? "is-open" : ""}`}>
              <div className="cms-list-head">
                <button
                  type="button"
                  className="cms-list-toggle"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : index)}
                >
                  <span className="cms-list-index">{index + 1}</span>
                  {thumbSrc && !/\.pdf/i.test(thumbSrc) && <img src={thumbSrc} alt="" />}
                  <span className="cms-list-title">{title}</span>
                  <ChevronDown size={16} aria-hidden="true" />
                </button>
                <span className="cms-list-tools">
                  <button
                    type="button"
                    className="cms-icon-button"
                    aria-label={`Move ${title} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    className="cms-icon-button"
                    aria-label={`Move ${title} down`}
                    disabled={index === value.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    className="cms-icon-button is-danger"
                    aria-label={`Remove ${title}`}
                    onClick={() => {
                      onChange(value.filter((_, i) => i !== index));
                      setOpen(null);
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </span>
              </div>
              {expanded && (
                <div className="cms-list-body">
                  <FieldGrid
                    fields={field.fields}
                    values={item}
                    idPrefix={`${idPrefix}-${index}`}
                    onChange={(key, next) =>
                      onChange(
                        value.map((entry, i) => (i === index ? { ...entry, [key]: next } : entry)),
                      )
                    }
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <button type="button" className="cms-add" onClick={add}>
        <Plus size={15} aria-hidden="true" /> Add {field.itemLabel.toLowerCase()}
      </button>
    </div>
  );
}

function FieldInput({
  field,
  id,
  value,
  onChange,
}: {
  field: Field;
  id: string;
  value: Value | undefined;
  onChange: (value: Value) => void;
}) {
  switch (field.type) {
    case "richtext":
      return <TextEditor id={id} value={asText(value)} onChange={onChange} />;
    case "textarea":
      return (
        <textarea
          id={id}
          rows={Math.min(8, Math.max(3, Math.ceil(asText(value).length / 90)))}
          value={asText(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    case "image":
    case "video":
    case "file":
      return <ImageField id={id} value={asText(value)} onChange={onChange} kind={field.type} />;
    case "select":
      return (
        <select id={id} value={asText(value)} onChange={(event) => onChange(event.target.value)}>
          <option value="">Choose…</option>
          {field.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    case "toggle":
      return (
        <button
          id={id}
          type="button"
          role="switch"
          aria-checked={value === true}
          className="cms-switch"
          onClick={() => onChange(value !== true)}
        >
          <span />
          {value === true ? "On" : "Off"}
        </button>
      );
    case "tags":
      return <TagsField id={id} value={asStrings(value)} onChange={onChange} />;
    case "paragraphs":
      return <ParagraphsField id={id} value={asStrings(value)} onChange={onChange} />;
    case "list":
      return <ListField field={field} value={asItems(value)} onChange={onChange} idPrefix={id} />;
    default:
      return (
        <input
          id={id}
          type={field.type}
          value={asText(value)}
          onChange={(event) => onChange(event.target.value)}
        />
      );
  }
}

function FieldGrid({
  fields,
  values,
  idPrefix,
  onChange,
}: {
  fields: Field[];
  values: Values;
  idPrefix: string;
  onChange: (key: string, value: Value) => void;
}) {
  return (
    <div className="admin-form-grid">
      {fields.map((field) => {
        const id = `${idPrefix}-${field.key}`;
        const wide = field.wide || field.type === "list";
        return (
          <div key={field.key} className={`admin-field ${wide ? "is-wide" : ""}`}>
            {field.type === "list" ? (
              <p className="cms-field-label">{field.label}</p>
            ) : (
              <label htmlFor={id}>{field.label}</label>
            )}
            <FieldInput
              field={field}
              id={id}
              value={values[field.key]}
              onChange={(value) => onChange(field.key, value)}
            />
            {field.hint && <p className="admin-field-hint">{field.hint}</p>}
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- Block editor

function SourceTag({ source }: { source: Block["source"] }) {
  return source === "live" ? (
    <span className="admin-tag is-live" title="Holds what the website shows now">
      <Database size={11} aria-hidden="true" /> Website content
    </span>
  ) : (
    <span className="admin-tag is-sample" title="Content still lives in the page code">
      <LayoutTemplate size={11} aria-hidden="true" /> Layout
    </span>
  );
}

function BlockEditor({
  editorId,
  pageId,
  block,
  number,
  onSaved,
  onValues,
}: {
  editorId: string;
  pageId: string;
  block: Block;
  number: number;
  onSaved: () => void;
  onValues?: (values: Values) => void;
}) {
  const simpleHero = editorId === "homepage" && block.id === "hero";
  const mainKeys = [
    "headline",
    "highlight",
    "headlineEnd",
    "intro",
    "image",
    "imageAlt",
    "primaryButton",
    "secondaryButton",
  ];
  const basicFields = simpleHero
    ? block.fields?.filter((field) => mainKeys.includes(field.key))
    : block.fields;
  const extraFields = simpleHero
    ? block.fields?.filter((field) => !mainKeys.includes(field.key))
    : [];
  const key = draftKey(editorId, pageId, block.id);
  const defaults = useMemo(
    () => ({
      ...Object.fromEntries((block.fields ?? []).map((field) => [field.key, emptyValue(field)])),
      ...block.values,
      ...publishedBlock(editorId, pageId, block.id)?.values,
    }),
    [block, editorId, pageId],
  );
  const [saved, setSaved] = useState(() => readDraft(key));
  const [values, setValues] = useState<Values>(() => saved?.values ?? defaults);
  const [notice, setNotice] = useState("");
  const dirty = JSON.stringify(values) !== JSON.stringify(saved?.values ?? defaults);
  useEffect(() => {
    if (!dirty) return;
    const unload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    const leave = (event: MouseEvent) => {
      const target = (event.target as Element).closest(
        'a[href^="#"], .cms-outline button, [role="tab"]',
      );
      if (
        target &&
        !window.confirm("You have unsaved changes. Leave this section without saving?")
      ) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    window.addEventListener("beforeunload", unload);
    document.addEventListener("click", leave, true);
    return () => {
      window.removeEventListener("beforeunload", unload);
      document.removeEventListener("click", leave, true);
    };
  }, [dirty]);

  const save = () => {
    const draft = { values, savedAt: new Date().toISOString() };
    if (!writeDraft(key, draft)) {
      setNotice("This browser blocked saving. Your changes have not been saved.");
      return;
    }
    setNotice("Draft saved in this browser.");
    setSaved(draft);
    onSaved();
  };
  const reset = () => {
    writeDraft(key, null);
    setSaved(null);
    setValues(defaults);
    onValues?.(defaults);
    setNotice("Restored the published content.");
    onSaved();
  };

  return (
    <section className="admin-card cms-block" aria-labelledby={`block-${block.id}-title`}>
      <div className="admin-card-head">
        <div>
          <p className="cms-block-number">Section {String(number).padStart(2, "0")}</p>
          <h2 id={`block-${block.id}-title`}>{block.label}</h2>
          <p>{block.description}</p>
        </div>
        <div className="admin-card-tools">
          <SourceTag source={block.source} />
          {block.view && (
            <a className="admin-link" href={block.view} target="_blank" rel="noreferrer">
              View on site <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {block.source === "layout" && (
        <p className="admin-draft-source">
          <Info size={15} aria-hidden="true" />
          <span>
            These fields define this section’s structure. Its current wording still lives in the
            page code and moves here when the content service is connected.
          </span>
        </p>
      )}

      {block.fields && (
        <FieldGrid
          fields={basicFields ?? []}
          values={values}
          idPrefix={`${editorId}-${pageId}-${block.id}`}
          onChange={(field, value) => {
            const next = { ...values, [field]: value };
            setValues(next);
            onValues?.(next);
            setNotice("");
          }}
        />
      )}

      {!!extraFields?.length && (
        <details style={{ padding: 24 }}>
          <summary>Buttons, media and additional details</summary>
          <FieldGrid
            fields={extraFields}
            values={values}
            idPrefix={`${editorId}-${pageId}-${block.id}-details`}
            onChange={(field, value) => {
              const next = { ...values, [field]: value };
              setValues(next);
              onValues?.(next);
            }}
          />
        </details>
      )}

      {block.collection && (
        <a
          className="cms-collection"
          href={`#${block.collection.editor}${block.collection.page ? `/${block.collection.page}` : ""}`}
        >
          <span className="admin-action-icon">
            <Layers size={18} aria-hidden="true" />
          </span>
          <span>
            <strong>{block.collection.label}</strong>
            <span className="admin-muted">
              {block.collection.count
                ? `${block.collection.count} items · managed in their own editor, shared wherever they appear`
                : "Managed in its own workspace"}
            </span>
          </span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}

      {block.fields && (
        <div className="admin-form-foot cms-block-foot">
          <span className="cms-save-state" aria-live="polite">
            {notice ||
              (dirty
                ? "Unsaved changes"
                : saved
                  ? `Draft saved ${clock(saved.savedAt)}`
                  : "Matches the published website")}
          </span>
          <span className="cms-block-actions">
            {(saved || dirty) && (
              <button type="button" className="admin-button is-ghost" onClick={reset}>
                <RotateCcw size={15} aria-hidden="true" /> Discard draft
              </button>
            )}
            <button type="button" className="admin-button" onClick={save} disabled={!dirty}>
              <Save size={15} aria-hidden="true" /> Save draft
            </button>
          </span>
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------- Editor

export function ContentEditor({ editor }: { editor: ContentEditorDef }) {
  const location = useAdminLocation();
  const page = editor.pages.find((entry) => entry.id === location.page) ?? editor.pages[0]!;
  const block = page.blocks.find((entry) => entry.id === location.block) ?? page.blocks[0]!;
  const [, refresh] = useState(0);
  const working = useRef<HomeSnapshot>({});
  const linkedEditor = contentEditors.find((entry) => entry.id === block.collection?.editor);
  const linkedPage =
    linkedEditor?.pages.find((entry) => entry.id === block.collection?.page) ??
    linkedEditor?.pages[0];
  const linkedBlock = linkedPage?.blocks[0];
  const homeRelated =
    editor.id === "homepage" || editor.id === "partners" || editor.id === "testimonials";
  useEffect(() => {
    working.current = {};
  }, [editor.id, page.id, block.id]);
  const homeSnapshot = () =>
    Object.fromEntries(
      homeSources.map(([e, p, b]) => [
        sourceId(e, p, b),
        {
          ...publishedBlock(e, p, b)?.values,
          ...readDraft(draftKey(e, p, b))?.values,
          ...working.current[sourceId(e, p, b)],
        },
      ]),
    );
  const [review, setReview] = useState<"preview" | "publish" | null>(null);
  const [notice, setNotice] = useState("");
  const [publishing, setPublishing] = useState(false);

  const hasDraft = (id: string) => readDraft(draftKey(editor.id, page.id, id)) !== null;
  const drafts =
    page.blocks.filter((entry) => hasDraft(entry.id)).length +
    (editor.id === "homepage"
      ? homeSources.filter(([e, p, b]) => e !== "homepage" && readDraft(draftKey(e, p, b))).length
      : 0);

  const choosePage = (id: string) => {
    const next = editor.pages.find((entry) => entry.id === id)!;
    navigateAdmin(`#${editor.id}/${id}/${next.blocks[0]!.id}`);
  };
  const reviewValues = Object.fromEntries(
    page.blocks.map((entry) => [
      entry.id,
      {
        ...entry.values,
        ...publishedBlock(editor.id, page.id, entry.id)?.values,
        ...readDraft(draftKey(editor.id, page.id, entry.id))?.values,
      },
    ]),
  );
  const publish = () => {
    setPublishing(true);
    try {
      const pending = Object.fromEntries(
        page.blocks.flatMap((entry) => {
          const draft = readDraft(draftKey(editor.id, page.id, entry.id));
          return draft ? [[entry.id, draft]] : [];
        }),
      );
      if (Object.keys(pending).length) publishPrototype(editor.id, page.id, pending);
      if (editor.id === "homepage")
        for (const [e, p, b] of homeSources) {
          if (e === "homepage") continue;
          const draft = readDraft(draftKey(e, p, b));
          if (draft) publishPrototype(e, p, { [b]: draft });
        }
      working.current = {};
      setReview(null);
      setNotice(
        homeRelated
          ? "Published to the homepage in this browser. Other visitors are unaffected."
          : "Prototype release recorded. Your public website has not changed.",
      );
      refresh((count) => count + 1);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "The release could not be saved. Your drafts remain available.",
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">{editor.overline}</p>
          <h1>{editor.pages.length > 1 ? page.label : editor.title}</h1>
          <p className="admin-lede">{editor.description}</p>
        </div>
        <div className="admin-head-actions">
          {!page.planned && (
            <a className="admin-button is-ghost" href={page.url} target="_blank" rel="noreferrer">
              View on website <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          )}
          <button
            type="button"
            className="admin-button"
            disabled={!drafts}
            onClick={() => setReview("publish")}
            title="Review saved drafts and simulate publishing"
          >
            <Send size={15} aria-hidden="true" /> Publish {drafts ? `(${drafts})` : ""}
          </button>
          <button className="admin-button is-ghost" onClick={() => setReview("preview")}>
            {homeRelated ? "Preview homepage" : "Preview saved content"}
          </button>
        </div>
      </div>

      <p className="admin-notice">
        Save drafts, preview your changes and publish. Homepage publishing updates this browser
        only; shared publishing will use the planned content API.
      </p>
      {notice && (
        <p className="admin-notice" role="status">
          {notice}
        </p>
      )}
      {page.planned && (
        <p className="admin-notice">
          Public page planned. You can prepare a browser draft here; this page is not available to
          visitors yet.
        </p>
      )}
      {editor.pages.length > 1 && (
        <div className="admin-tabs" role="tablist" aria-label={`${editor.title} pages`}>
          {editor.pages.map((entry) => (
            <button
              key={entry.id}
              type="button"
              role="tab"
              aria-selected={entry.id === page.id}
              tabIndex={entry.id === page.id ? 0 : -1}
              onClick={() => choosePage(entry.id)}
              onKeyDown={(event) => {
                const index = editor.pages.indexOf(entry);
                const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
                if (!step) return;
                event.preventDefault();
                const next =
                  editor.pages[(index + step + editor.pages.length) % editor.pages.length]!;
                choosePage(next.id);
                (
                  event.currentTarget.parentElement?.children[
                    editor.pages.indexOf(next)
                  ] as HTMLElement
                )?.focus();
              }}
            >
              {entry.label}
            </button>
          ))}
        </div>
      )}

      <div className="cms-layout">
        <nav className="admin-card cms-outline" aria-label={`${page.label} sections`}>
          <p className="cms-outline-title">
            {page.label}
            <span>{page.blocks.length} sections, in page order</span>
          </p>
          <ol>
            {page.blocks.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  aria-current={entry.id === block.id ? "true" : undefined}
                  onClick={() => navigateAdmin(`#${editor.id}/${page.id}/${entry.id}`)}
                >
                  <span className="cms-outline-number">{String(index + 1).padStart(2, "0")}</span>
                  <span className="cms-outline-label">{entry.label}</span>
                  {hasDraft(entry.id) ? (
                    <span className="cms-outline-flag" title="Draft saved, not yet published">
                      <CircleDot size={12} aria-hidden="true" /> Edited
                    </span>
                  ) : entry.collection && !entry.fields ? (
                    <Layers size={13} aria-label="Shared items" />
                  ) : null}
                </button>
              </li>
            ))}
          </ol>
          <p className="cms-outline-note">
            <Info size={13} aria-hidden="true" /> Drafts stay in this browser until publishing is
            connected.
          </p>
        </nav>

        <div>
          {editor.id === "homepage" && linkedEditor && linkedPage && linkedBlock && (
            <BlockEditor
              key={`${linkedEditor.id}-${linkedPage.id}-${releasesFor(linkedEditor.id, linkedPage.id)[0]?.id ?? "initial"}`}
              editorId={linkedEditor.id}
              pageId={linkedPage.id}
              block={linkedBlock}
              number={page.blocks.indexOf(block) + 1}
              onValues={(values) => {
                working.current[sourceId(linkedEditor.id, linkedPage.id, linkedBlock.id)] = values;
              }}
              onSaved={() => refresh((count) => count + 1)}
            />
          )}
          <BlockEditor
            key={`${editor.id}-${page.id}-${block.id}-${releasesFor(editor.id, page.id)[0]?.id ?? "initial"}`}
            editorId={editor.id}
            pageId={page.id}
            block={block}
            number={page.blocks.indexOf(block) + 1}
            onValues={(values) => {
              working.current[sourceId(editor.id, page.id, block.id)] = values;
            }}
            onSaved={() => refresh((count) => count + 1)}
          />
        </div>
      </div>
      {releasesFor(editor.id, page.id).length > 0 && (
        <section className="admin-card cms-release-list">
          <h2>Prototype publishing history</h2>
          <p>Local releases for {page.label}. Production history will come from the API.</p>
          <ol>
            {releasesFor(editor.id, page.id).map((release) => (
              <li key={release.id}>
                {clock(release.publishedAt)} · {Object.keys(release.blocks).length} sections
              </li>
            ))}
          </ol>
        </section>
      )}
      {review && homeRelated && (
        <HomePreview
          snapshot={
            review === "preview"
              ? homeSnapshot()
              : Object.fromEntries(
                  homeSources.map(([e, p, b]) => [
                    sourceId(e, p, b),
                    { ...publishedBlock(e, p, b)?.values, ...readDraft(draftKey(e, p, b))?.values },
                  ]),
                )
          }
          section={
            editor.id === "homepage"
              ? block.id
              : editor.id === "partners"
                ? page.id
                : "testimonials"
          }
          onClose={() => setReview(null)}
          {...(review === "publish" ? { onPublish: publish } : {})}
        />
      )}
      {review && !homeRelated && (
        <ContentReview
          page={page}
          values={reviewValues}
          onClose={() => setReview(null)}
          publishing={publishing}
          {...(review === "publish" ? { onPublish: publish } : {})}
        />
      )}
    </>
  );
}

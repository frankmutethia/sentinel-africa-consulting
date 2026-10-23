import { useEffect, useRef } from "react";
import type { ContentPage, Field, Value, Values } from "./types";

function ValuePreview({ field, value }: { field: Field; value: Value | undefined }) {
  if (field.type === "list" && Array.isArray(value))
    return (
      <ol>
        {value.map((item, i) =>
          typeof item === "object" ? (
            <li key={i}>
              <dl>
                {field.fields.map((child) => (
                  <div key={child.key}>
                    <dt>{child.label}</dt>
                    <dd>
                      <ValuePreview field={child} value={item[child.key]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ) : null,
        )}
      </ol>
    );
  if (field.type === "image" && typeof value === "string" && value && !/\.pdf($|\?)/i.test(value))
    return <img src={value} alt={field.label} className="cms-review-image" />;
  if (field.type === "video" && typeof value === "string" && value)
    return <video src={value} controls preload="metadata" className="cms-review-image" />;
  if (Array.isArray(value))
    return (
      <div>
        {value
          .filter((item) => typeof item === "string")
          .map((item, i) => (
            <p key={i}>{String(item)}</p>
          ))}
      </div>
    );
  return (
    <span>
      {typeof value === "boolean" ? (value ? "Yes" : "No") : String(value ?? "") || "Not set"}
    </span>
  );
}

export function ContentReview({
  page,
  values,
  onClose,
  onPublish,
  publishing,
}: {
  page: ContentPage;
  values: Record<string, Values>;
  onClose: () => void;
  onPublish?: () => void;
  publishing: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal?.();
    return () => previous?.focus();
  }, []);
  return (
    <dialog
      ref={dialog}
      open={typeof HTMLDialogElement.prototype.showModal !== "function"}
      className="cms-review"
      aria-labelledby="cms-review-title"
      onCancel={onClose}
    >
      <header>
        <div>
          <p className="admin-overline">Content review · prototype</p>
          <h2 id="cms-review-title">{page.label}</h2>
        </div>
        <button className="admin-button is-ghost" onClick={onClose}>
          Close review
        </button>
      </header>
      <p>
        This is a content preview, not a pixel-perfect website preview. Publishing here records a
        prototype release in this browser; the public website is unchanged.
      </p>
      <div className="cms-review-body">
        {page.blocks.map((block) => (
          <section key={block.id}>
            <h3>{block.label}</h3>
            {block.collection && <p>Uses shared content: {block.collection.label}</p>}
            <dl>
              {block.fields?.map((field) => (
                <div key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>
                    <ValuePreview field={field} value={values[block.id]?.[field.key]} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      {onPublish && (
        <footer>
          <button className="admin-button" disabled={publishing} onClick={onPublish}>
            {publishing ? "Recording release…" : "Confirm prototype publish"}
          </button>
        </footer>
      )}
    </dialog>
  );
}

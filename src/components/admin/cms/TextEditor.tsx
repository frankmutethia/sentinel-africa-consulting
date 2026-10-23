import { useRef } from "react";

export function TextEditor({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const input = useRef<HTMLTextAreaElement>(null);
  const insert = (before: string, after = "") => {
    const element = input.current;
    if (!element) return;
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const selection = value.slice(start, end) || "text";
    onChange(value.slice(0, start) + before + selection + after + value.slice(end));
    requestAnimationFrame(() => {
      element.focus();
      element.setSelectionRange(start + before.length, start + before.length + selection.length);
    });
  };
  return (
    <div className="cms-text-editor">
      <div role="toolbar" aria-label="Text formatting">
        <button
          type="button"
          className="admin-button is-ghost is-small"
          onClick={() => insert("**", "**")}
        >
          Bold
        </button>
        <button
          type="button"
          className="admin-button is-ghost is-small"
          onClick={() => insert("*", "*")}
        >
          Italic
        </button>
        <button
          type="button"
          className="admin-button is-ghost is-small"
          onClick={() => insert("\n- ")}
        >
          Bullet
        </button>
      </div>
      <textarea
        ref={input}
        id={id}
        rows={8}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      <p className="admin-field-hint">
        Select text to format it. Separate paragraphs with a blank line.
      </p>
    </div>
  );
}

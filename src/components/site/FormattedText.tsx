// Deliberately renders text with React, never user-supplied HTML.
export function FormattedText({ text }: { text: string }) {
  const inline = (line: string) =>
    line
      .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
      .map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : part.startsWith("*") ? (
          <em key={i}>{part.slice(1, -1)}</em>
        ) : (
          part
        ),
      );
  return (
    <>
      {text.split(/\n\s*\n/).map((paragraph, index) =>
        paragraph.trim().startsWith("- ") ? (
          <ul key={index}>
            {paragraph.split("\n").map((line, i) => (
              <li key={i}>{inline(line.replace(/^- /, ""))}</li>
            ))}
          </ul>
        ) : (
          <p key={index} style={{ whiteSpace: "pre-line" }}>
            {inline(paragraph)}
          </p>
        ),
      )}
    </>
  );
}

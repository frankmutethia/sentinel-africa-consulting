import { useMemo, useRef, useState } from "react";
import { Check, Copy, ImageUp, Info, Search } from "lucide-react";

// Every image bundled with the website, grouped by folder. Uploads are previewed here and
// stored once the content service is connected.
const files = import.meta.glob("/src/assets/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

const library = Object.entries(files)
  .map(([path, url]) => {
    const parts = path.replace("/src/assets/", "").split("/");
    return {
      url,
      name: parts.at(-1) ?? path,
      folder: parts.length > 1 ? parts.slice(0, -1).join(" / ") : "general",
    };
  })
  .sort((a, b) => a.folder.localeCompare(b.folder) || a.name.localeCompare(b.name));

const folders = ["All", ...new Set(library.map((item) => item.folder))];

export function MediaView() {
  const [folder, setFolder] = useState("All");
  const [query, setQuery] = useState("");
  const [uploads, setUploads] = useState<{ url: string; name: string }[]>([]);
  const [copied, setCopied] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const visible = useMemo(
    () =>
      library.filter(
        (item) =>
          (folder === "All" || item.folder === folder) &&
          item.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [folder, query],
  );

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(new URL(url, window.location.origin).href);
      setCopied(url);
    } catch {
      setCopied("");
    }
  };

  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">Content library</p>
          <h1>Media library</h1>
          <p className="admin-lede">
            {library.length} images used across the website. Image fields in every editor can also
            upload directly.
          </p>
        </div>
        <div className="admin-head-actions">
          <button type="button" className="admin-button" onClick={() => input.current?.click()}>
            <ImageUp size={15} aria-hidden="true" /> Upload images
          </button>
          <input
            ref={input}
            type="file"
            accept="image/*"
            multiple
            hidden
            aria-label="Upload images"
            onChange={(event) =>
              setUploads((current) => [
                ...[...(event.target.files ?? [])].map((file) => ({
                  url: URL.createObjectURL(file),
                  name: file.name,
                })),
                ...current,
              ])
            }
          />
        </div>
      </div>

      {uploads.length > 0 && (
        <p className="admin-notice">
          <Info size={16} aria-hidden="true" />
          <span>
            <strong>
              {uploads.length} new {uploads.length === 1 ? "image" : "images"}
            </strong>{" "}
            previewed below. They are stored when the content service is connected.
          </span>
        </p>
      )}

      <section className="admin-card" aria-label="Images">
        <div className="cms-inbox-tools">
          <label className="cms-folder">
            <span className="admin-sr-only">Folder</span>
            <select value={folder} onChange={(event) => setFolder(event.target.value)}>
              {folders.map((entry) => (
                <option key={entry}>{entry}</option>
              ))}
            </select>
          </label>
          <label className="cms-search">
            <Search size={15} aria-hidden="true" />
            <span className="admin-sr-only">Search images</span>
            <input
              type="search"
              placeholder="Search by file name"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </div>
        <ul className="cms-media-grid">
          {[...uploads.map((item) => ({ ...item, folder: "New upload" })), ...visible].map(
            (item) => (
              <li key={item.url} className="cms-media-item">
                <div className="cms-media-thumb">
                  <img src={item.url} alt="" loading="lazy" />
                </div>
                <p className="cms-media-name" title={item.name}>
                  {item.name}
                </p>
                <p className="cms-media-folder">{item.folder}</p>
                <button
                  type="button"
                  className="cms-icon-button"
                  aria-label={`Copy link to ${item.name}`}
                  onClick={() => copy(item.url)}
                >
                  {copied === item.url ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </li>
            ),
          )}
        </ul>
      </section>
    </>
  );
}

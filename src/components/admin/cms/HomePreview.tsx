import { useEffect, useRef, useState } from "react";
import type { HomeSnapshot } from "@/content/homepageDemo";

export function HomePreview({
  snapshot,
  section,
  onClose,
  onPublish,
}: {
  snapshot: HomeSnapshot;
  section: string;
  onClose: () => void;
  onPublish?: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mobile, setMobile] = useState(false);
  const [token] = useState(() => crypto.randomUUID());
  const [initialSnapshot] = useState(snapshot);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    dialog.current?.showModal?.();
    try {
      sessionStorage.setItem(`home-preview:${token}`, JSON.stringify(initialSnapshot));
      setReady(true);
    } catch {
      setError(
        "This browser could not prepare the preview. Try a smaller image or allow browser storage.",
      );
    }
    return () => {
      sessionStorage.removeItem(`home-preview:${token}`);
      previous?.focus();
    };
  }, [token, initialSnapshot]);
  return (
    <dialog
      ref={dialog}
      open={typeof HTMLDialogElement.prototype.showModal !== "function"}
      className="cms-home-preview"
      aria-label="Homepage preview"
      onCancel={onClose}
    >
      <header>
        <div>
          <strong>Homepage preview</strong>
          <p>Review your changes in the page layout. Only this browser is affected.</p>
        </div>
        <button className="admin-button is-ghost" onClick={() => setMobile(!mobile)}>
          {mobile ? "Desktop view" : "Mobile view"}
        </button>
        {onPublish && (
          <button className="admin-button" onClick={onPublish}>
            Confirm prototype publish
          </button>
        )}
        <button className="admin-button is-ghost" onClick={onClose}>
          Close preview
        </button>
      </header>
      {error && <p role="alert">{error}</p>}
      {ready && (
        <iframe
          title="Homepage with your changes"
          style={{ width: mobile ? 390 : "100%" }}
          src={`/?homePreview=${token}#${section === "hero" ? "top" : section}`}
        />
      )}
    </dialog>
  );
}

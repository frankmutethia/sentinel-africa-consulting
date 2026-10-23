import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, MessageSquareQuote, X } from "lucide-react";

function SubmissionDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal?.();
    // Start on the first field rather than the close button.
    dialog.current?.querySelector<HTMLInputElement>("input[name=name]")?.focus();
    return () => previous?.focus();
  }, []);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name") ?? "").trim();
    const quote = String(fields.get("quote") ?? "").trim();
    if (!name || !quote) {
      setError("Please enter your name and experience.");
      return;
    }
    try {
      const key = "sentinel-testimonial-submissions";
      const previous = JSON.parse(localStorage.getItem(key) ?? "[]");
      localStorage.setItem(
        key,
        JSON.stringify([
          ...previous,
          {
            id: crypto.randomUUID(),
            name,
            quote,
            role: String(fields.get("role") ?? "").trim(),
            email: String(fields.get("email") ?? "").trim(),
            consent: fields.get("consent") === "on",
            status: "pending-review",
            createdAt: new Date().toISOString(),
          },
        ]),
      );
      setSaved(true);
    } catch {
      setError("We could not save your feedback in this browser. Please try again.");
    }
  }
  return (
    <dialog
      ref={dialog}
      open={typeof HTMLDialogElement.prototype.showModal !== "function"}
      className="testimonial-dialog"
      aria-labelledby="testimonial-form-title"
      onCancel={onClose}
    >
      <div className="testimonial-shell">
        <aside className="testimonial-aside">
          <span className="testimonial-form-icon">
            {saved ? <Check size={22} /> : <MessageSquareQuote size={22} />}
          </span>
          <p className="testimonial-kicker">Your experience matters</p>
          <h2 id="testimonial-form-title">
            {saved ? "Thank you for sharing." : "Share your experience"}
          </h2>
          <p className="testimonial-aside-lead">
            Tell us how working with Sentinel Africa made a difference.
          </p>
          <ul className="testimonial-points">
            {[
              "Reviewed by our team before it appears",
              "Your email is never displayed",
              "Published only with your consent",
            ].map((point) => (
              <li key={point}>
                <Check size={14} aria-hidden="true" />
                {point}
              </li>
            ))}
          </ul>
        </aside>

        <div className="testimonial-main">
          <button
            type="button"
            className="testimonial-close"
            aria-label="Close testimonial form"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          {saved ? (
            <div className="testimonial-done" role="status">
              <span className="testimonial-done-icon">
                <Check size={26} aria-hidden="true" />
              </span>
              <p className="testimonial-done-title">Testimonial received</p>
              <p>
                It has been saved in this browser for this design preview. It has not been sent or
                published.
              </p>
              <button className="button" onClick={onClose}>
                Back to testimonials
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="testimonial-form-row">
                <label>
                  <span className="testimonial-label">Your name</span>
                  <input
                    name="name"
                    autoComplete="name"
                    required
                    maxLength={120}
                    placeholder="Full name"
                  />
                </label>
                <label>
                  <span className="testimonial-label">
                    Role or organisation <em>Optional</em>
                  </span>
                  <input
                    name="role"
                    autoComplete="organization"
                    maxLength={180}
                    placeholder="e.g. Head of IT, KCB"
                  />
                </label>
              </div>
              <div className="testimonial-field">
                <label htmlFor="testimonial-email" className="testimonial-label">
                  Email address
                </label>
                <input
                  id="testimonial-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  placeholder="you@example.com"
                  aria-describedby="testimonial-email-hint"
                />
                <small id="testimonial-email-hint">For follow-up only. Never displayed.</small>
              </div>
              <div className="testimonial-field">
                <label htmlFor="testimonial-quote" className="testimonial-label">
                  Your experience
                </label>
                <textarea
                  id="testimonial-quote"
                  name="quote"
                  required
                  minLength={20}
                  maxLength={2000}
                  rows={4}
                  placeholder="What did you value about our services or training?"
                  aria-describedby="testimonial-quote-hint"
                />
                <small id="testimonial-quote-hint">20–2,000 characters.</small>
              </div>
              <label className="testimonial-consent">
                <input name="consent" type="checkbox" required />
                <span>
                  I agree to Sentinel Africa displaying my testimonial, name and role on its website
                  after review.
                </span>
              </label>
              {error && (
                <p className="testimonial-error" role="alert">
                  {error}
                </p>
              )}
              <div className="testimonial-actions">
                <button type="submit" className="button">
                  Submit testimonial <ArrowUpRight size={18} />
                </button>
                <p className="testimonial-demo-note">Design preview: saved only in this browser.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </dialog>
  );
}

export function TestimonialSubmission() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="button testimonial-share" onClick={() => setOpen(true)}>
        Share your experience <ArrowUpRight size={18} />
      </button>
      {open && <SubmissionDialog onClose={() => setOpen(false)} />}
    </>
  );
}

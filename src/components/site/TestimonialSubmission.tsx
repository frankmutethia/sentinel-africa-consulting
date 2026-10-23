import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, MessageSquareQuote, X } from "lucide-react";

function SubmissionDialog({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    dialog.current?.showModal?.();
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
      <button
        type="button"
        className="testimonial-close"
        aria-label="Close testimonial form"
        onClick={onClose}
      >
        <X size={22} />
      </button>
      <span className="testimonial-form-icon">{saved ? <Check /> : <MessageSquareQuote />}</span>
      <p className="eyebrow">Your experience matters</p>
      <h2 id="testimonial-form-title">
        {saved ? "Thank you for sharing." : "Share your experience"}
      </h2>
      {saved ? (
        <div role="status">
          <p>
            Your testimonial has been saved in this browser for this design preview. It has not been
            sent or published.
          </p>
          <button className="button" onClick={onClose}>
            Back to testimonials
          </button>
        </div>
      ) : (
        <>
          <p>
            Tell us how working with Sentinel Africa made a difference. Testimonials are reviewed
            before appearing on our website.
          </p>
          <form onSubmit={submit}>
            <div className="testimonial-form-row">
              <label>
                Your name{" "}
                <input
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={120}
                  placeholder="Full name"
                />
              </label>
              <label>
                Role / organisation <span>(optional)</span>
                <input
                  name="role"
                  autoComplete="organization"
                  maxLength={180}
                  placeholder="Your role or organisation"
                />
              </label>
            </div>
            <label>
              Email address{" "}
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
              />
              <small>For follow-up only. Your email will not be displayed.</small>
            </label>
            <label>
              Your experience{" "}
              <textarea
                name="quote"
                required
                minLength={20}
                maxLength={2000}
                rows={5}
                placeholder="What did you value about our services or training?"
              />
              <small>20–2,000 characters.</small>
            </label>
            <label className="testimonial-consent">
              <input name="consent" type="checkbox" required />
              <span>
                I agree to Sentinel Africa displaying my testimonial, name and role on its website
                after review.
              </span>
            </label>
            {error && <p role="alert">{error}</p>}
            <button type="submit" className="button">
              Submit testimonial <ArrowUpRight size={18} />
            </button>
            <p className="testimonial-demo-note">
              Design preview: feedback is saved only in this browser.
            </p>
          </form>
        </>
      )}
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

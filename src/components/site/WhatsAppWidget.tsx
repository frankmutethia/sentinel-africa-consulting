import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, Send, X } from "lucide-react";
import shield from "@/assets/logos/sentinel-shield.png";
import "./whatsapp.css";

// Customer support line, as configured on the published site.
const whatsappNumber = "254715484888";
const greeting = "Hello, Thank you for contacting Sentinel Africa. How may I assist you?";
const defaultMessage = "Hello Sentinel Africa, I would like to enquire about your services.";

const whatsappLink = (message: string) =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/** Floating WhatsApp customer support chat, modelled on the widget of the published site. */
export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [composing, setComposing] = useState(false);
  const [message, setMessage] = useState("");
  const toggle = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    setComposing(false);
    toggle.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setComposing(false);
      toggle.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.open(whatsappLink(message.trim() || defaultMessage), "_blank", "noopener,noreferrer");
    setMessage("");
  }

  return (
    <div className="wa-widget">
      {open && (
        <div
          ref={panel}
          id="whatsapp-panel"
          className="wa-panel"
          role="dialog"
          aria-label="WhatsApp customer support"
          tabIndex={-1}
        >
          <div className="wa-panel-header">
            <p>{greeting}</p>
            <button
              type="button"
              className="wa-close"
              aria-label="Close WhatsApp chat"
              onClick={close}
            >
              <X size={16} />
            </button>
          </div>

          {composing ? (
            <form className="wa-compose" onSubmit={send}>
              <button type="button" className="wa-back" onClick={() => setComposing(false)}>
                <ArrowLeft size={15} /> Back
              </button>
              <div className="wa-bubble">
                <strong>Sentinel Africa Consulting</strong>
                {greeting}
              </div>
              <label htmlFor="whatsapp-message" className="sr-only">
                Your message
              </label>
              <div className="wa-compose-row">
                <textarea
                  id="whatsapp-message"
                  rows={2}
                  value={message}
                  placeholder="Write a message…"
                  onChange={(event) => setMessage(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <button type="submit" className="wa-send" aria-label="Send on WhatsApp">
                  <Send size={18} />
                </button>
              </div>
              <p className="wa-note">Opens WhatsApp to continue the conversation.</p>
            </form>
          ) : (
            <button type="button" className="wa-contact" onClick={() => setComposing(true)}>
              <span className="wa-avatar">
                <img src={shield} alt="" width="160" height="160" />
                <span className="wa-avatar-badge">
                  <WhatsAppIcon size={12} />
                </span>
              </span>
              <span className="wa-contact-text">
                <small>Customer Support</small>
                <strong>Sentinel Africa Consulting</strong>
              </span>
            </button>
          )}

          <div className="wa-panel-footer">
            <a href={whatsappLink(defaultMessage)} target="_blank" rel="noopener noreferrer">
              Sentinel Africa Consulting
              <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
            </a>
          </div>
        </div>
      )}

      <button
        ref={toggle}
        type="button"
        className="wa-toggle"
        aria-expanded={open}
        aria-controls="whatsapp-panel"
        onClick={() => (open ? close() : setOpen(true))}
      >
        <WhatsAppIcon size={26} />
        <span>WhatsApp</span>
      </button>
    </div>
  );
}

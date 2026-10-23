import { useState, type CSSProperties } from "react";
import { Pause, Play } from "lucide-react";
import { Reveal } from "./Reveal";
import { homepage, alliances, clients } from "@/content/homepageDemo";
import { sectors, type Sector } from "@/content/brands";

export function Alliances() {
  const [paused, setPaused] = useState(false);
  return (
    <section id="alliances" aria-labelledby="alliances-title" className="alliance-section">
      <div className="site-container alliance-heading">
        <div>
          <h2 id="alliances-title">{homepage.alliances.title}</h2>
          <p>{homepage.alliances.intro}</p>
        </div>
        <button
          type="button"
          className="marquee-toggle"
          aria-label={paused ? "Play alliance animation" : "Pause alliance animation"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size={12} /> : <Pause size={12} />}
          <span>{paused ? "Play" : "Pause"}</span>
        </button>
      </div>
      <div className="alliance-window">
        <div className="alliance-track" data-paused={paused}>
          {[0, 1].map((copy) => (
            <ul className="alliance-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {alliances.map((alliance, index) => (
                <li
                  className="alliance-logo"
                  key={alliance.name}
                  style={{ "--float-delay": `${index * -0.4}s` } as CSSProperties}
                >
                  <img
                    src={alliance.logo}
                    alt={copy === 0 ? alliance.name : ""}
                    width="122"
                    height="51"
                    decoding="async"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Clients() {
  const [sector, setSector] = useState<Sector>("All clients");
  const visibleClients = clients.filter(
    (client) => sector === "All clients" || client.sector === sector,
  );

  return (
    <section id="clients" aria-labelledby="clients-title" className="client-section py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-ink-soft">
              <span className="h-px w-8 bg-signal" />
              {homepage.clients.eyebrow}
            </p>
            <h2
              id="clients-title"
              className="font-display text-4xl font-semibold leading-tight text-primary sm:text-5xl"
            >
              {homepage.clients.title}
              <br />
              <span className="text-brand-blue">{homepage.clients.accent}</span>
            </h2>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-foreground">{homepage.clients.intro}</p>
        </Reveal>

        <div
          className="mt-10 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter clients by sector"
        >
          {sectors.map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={sector === item}
              aria-controls="client-gallery"
              onClick={() => setSector(item)}
              className={`sector-filter rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${sector === item ? "border-primary bg-primary text-primary-foreground" : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-primary"}`}
            >
              {item}
            </button>
          ))}
        </div>
        <p className="mt-5 text-xs text-muted-foreground" aria-live="polite" aria-atomic="true">
          {visibleClients.length} organizations · {sector}
        </p>

        <ul
          id="client-gallery"
          aria-label="Client logos"
          className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4"
        >
          {visibleClients.map((client) => (
            <li
              key={client.name}
              className="client-logo-card group flex min-h-44 flex-col rounded-2xl border border-border/80 bg-white px-4 pt-7 pb-4 sm:min-h-48 sm:px-6"
            >
              <div className="flex flex-1 items-center justify-center">
                <img
                  src={client.logo}
                  alt={client.name}
                  loading="lazy"
                  decoding="async"
                  className={`h-20 w-full object-contain ${client.compact ? "max-w-24" : "max-w-40"}`}
                />
              </div>
              <div className="mt-5 flex items-center justify-between gap-2 border-t border-border/50 pt-3">
                <span className="text-[0.6rem] font-medium tracking-wide text-muted-foreground sm:text-[0.65rem]">
                  {client.sector}
                </span>
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-signal/50 transition-colors group-hover:bg-signal"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

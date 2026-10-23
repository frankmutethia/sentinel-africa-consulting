import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./styles.css";

/** Renders a page into #root. Every HTML entry (see vite.config.ts) calls this once. */
export function mount(page: ReactNode) {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ErrorBoundary>{page}</ErrorBoundary>
    </StrictMode>,
  );
}

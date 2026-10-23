import { Component, type ReactNode } from "react";

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override render() {
    if (this.state.failed) {
      return (
        <main className="flex min-h-screen items-center justify-center bg-background px-5">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-semibold text-primary">This page didn't load</h1>
            <p className="mt-4 text-muted-foreground">Please refresh the page to try again.</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-full bg-signal px-6 py-3 font-semibold text-primary"
            >
              Refresh page
            </button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

// The staff area is a layout only: no account service is connected yet, so signing in
// opens the console without checking credentials. Replace these when one is added.

/** Moves to another page of the site; kept in one place so tests can replace it. */
export const goTo = (path: string) => window.location.assign(path);

/** Short pause that lets the form show its working state, like a real request would. */
export const simulatedRequest = () => new Promise((resolve) => setTimeout(resolve, 600));

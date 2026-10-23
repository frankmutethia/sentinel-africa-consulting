import { useSyncExternalStore } from "react";

const changed = "sentinel-admin-navigation";
const subscribe = (listener: () => void) => {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  window.addEventListener(changed, listener);
  return () => {
    window.removeEventListener("hashchange", listener);
    window.removeEventListener("popstate", listener);
    window.removeEventListener(changed, listener);
  };
};
const snapshot = () => window.location.hash;

export function useAdminLocation() {
  const hash = useSyncExternalStore(subscribe, snapshot, () => "#dashboard");
  const [section = "dashboard", page = "", block = ""] = hash.replace(/^#/, "").split("/");
  return { section: section || "dashboard", page, block };
}

export function navigateAdmin(hash: string) {
  if (window.location.hash !== hash) window.history.pushState(null, "", hash);
  window.dispatchEvent(new Event(changed));
}

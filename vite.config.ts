import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Each inner page is a folder holding an index.html, so it is a real file on any static host.
// Add a folder name here when adding a page; its script lives in src/entries/.
const innerPages = [
  "who-we-are",
  "how-we-do-it",
  "why-we-do-it",
  "board",
  "team",
  "consultancy",
  "managed-services",
  "training",
  "cybershield",
  "software-products",
  "rwanda-dpp-registration",
  "certification-planner",
  "blog",
  "our-sdgs-commitment",
  "tools",
  "travel-advisory",
  "join-our-team",
  "talent-shield",
  "staff-login",
  "forgot-password",
  "admin",
];

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": page("./src") },
  },
  build: {
    rollupOptions: {
      input: {
        main: page("./index.html"),
        ...Object.fromEntries(innerPages.map((name) => [name, page(`./${name}/index.html`)])),
      },
    },
  },
});

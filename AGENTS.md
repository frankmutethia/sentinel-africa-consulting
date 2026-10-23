# Project instructions

- Use Vite, React and TypeScript. This is a multi-page static website: the homepage (index.html) and each inner page (a folder holding its own index.html, listed in innerPages in vite.config.ts) are separate Vite entries, each rendered through src/mount.tsx. Pages link to each other with ordinary links and use anchors within a page; no routing framework is required.
- Keep website assets in the repository and use Sentinel Africa branding.
- Preserve published Git history. Do not force-push or rewrite pushed commits.
- Run the production build, type checks and relevant tests after architectural changes.

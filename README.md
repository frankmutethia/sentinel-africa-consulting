# Sentinel Africa Consulting

Official corporate website built with React, TypeScript, Vite and Tailwind CSS.

## Development

Use Node.js ^20.19.0 or >=22.12.0 and npm.

    npm ci
    npm run dev

## Validation and deployment

    npm run typecheck
    npm test
    npm run lint
    npm run build
    npm run preview

Deploy the generated dist/ directory to any static web host. No application server, router, database or platform-specific runtime is required.

## Structure

- index.html: homepage metadata, fonts and Sentinel favicon.
- Inner pages, each a folder with an index.html served at that path: who-we-are/, how-we-do-it/, why-we-do-it/, board/, team/ (About Us) and consultancy/, managed-services/, training/, cybershield/, automation-tools/, rwanda-dpp-registration/ (Our Services), shop/, blog/ and our-sdgs-commitment/ (Resources). To add a page, add its folder name to innerPages in vite.config.ts.
- Travel Advisory (travel-advisory/, src/components/travel/), linked from the Resources menu and the footer: a journey check for Ebola-related travel advisories, built on the rules of the Sentinel Africa travel portal. Only official sources, every record reviewed by an editor, and anything without a record shown as "Not verified", never as safe. It runs in the visitor's browser; no journey is sent anywhere. Records live in src/content/travel-advisory.json: add reviewed summaries to "advisories" (id, country, title, summary, optional regions, sourceName, sourceUrl, publishedDate, reviewedAt) and sourced requirements to "requirements" (id, country, direction: entry, exit or transit; category: restriction, declaration, screening, transit or airline; optional airline; title, detail, sourceName, sourceUrl, publishedDate, optional effectiveFrom and effectiveUntil, reviewedAt), then set "lastReviewed". Dates are YYYY-MM-DD. Entry rules apply to the destination, exit rules to the departure country and transit rules to the transit country. Editors can prepare records in the staff console (/admin/#travel, src/components/admin/TravelAdvisoriesView.tsx): it applies the portal's checks and produces the finished record to add to this file, since saving from the console is not connected yet. WHO Disease Outbreak News is read live in the browser (src/components/travel/whoOutbreakNews.ts): Ebola reports from the past 12 months from https://www.who.int/api/emergencies/diseaseoutbreaknews, with countries named through /api/emergencies/hierarchy-taxa. WHO allows browser access and caches answers for 15 minutes. The public page lists them as WHO’s own reports, not reviewed by Sentinel Africa (titles, dates and links only), and shows the reports naming each country of a checked route; they never count as verified checks. In the console they fill the review queue, and Prepare starts a record from a report. The CDC feed, saving and the activity log need a server and are not connected yet.
- Careers (Careers menu and footer): join-our-team/ (src/components/site/CareersPage.tsx) lists the roles in src/components/site/careers.ts. To post a role, add it there with its deadline: it shows as open through the deadline day, then moves to Recently closed, and each role opens at /join-our-team/?role=<slug>. Applications and expressions of interest are prepared in the visitor’s email app (role applications go to the role’s applyTo address, general ones to careersEmail), and the visitor attaches their CV; nothing is stored by the website. talent-shield/ (TalentShieldPage.tsx) presents the SAC Talent Shield programme; set applicationsOpen in that file when a cohort opens.
- Staff area, reached from Staff Login in the header's top bar and hidden from search engines: staff-login/ and forgot-password/ (src/components/staff/, a split-screen layout with the photograph in src/assets/) and admin/ (src/components/admin/, the staff console with a collapsible sidebar, light and dark mode, help and account menus). This is a layout only: no account service is connected yet, so signing in opens the console without checking credentials, and anyone with the /admin/ address can open it. Dashboard figures tagged "Sample" are placeholders; those tagged "Live" are counted from the site's content. Console sections open at /admin/#<section>; their list is in src/components/admin/adminSections.ts.
- src/main.tsx (homepage) and src/entries/*.tsx (one per inner page): entry points, each rendered through src/mount.tsx.
- src/App.tsx: homepage component.
- src/components/site/*Page.tsx: inner page content. ApproachDiagram.tsx draws the Understand / Tailor / Embed model.
- src/components/site/InnerPage.tsx: layout, hero and call to action shared by inner pages. ServiceBlocks.tsx holds the cards, checklists and media splits used by the service pages.
- Blog: src/content/blog-index.json lists the articles; src/content/blog/<slug>.json holds each article body, loaded only when opened. Articles open at /blog/?post=<slug>. Their images live in public/blog-media/. The content was imported once from the published blog: only safe HTML is kept, links to the old site point at the matching page here or are removed, and links to other websites open in a new tab.
- src/components/site/navigation.ts: header menu, page paths and contactLink, which opens the homepage callback form with a service pre-selected (/?interest=Training#contact).
- src/components/site/SiteHeader.tsx and SiteFooter.tsx: header and footer shared by every page.
- src/components/site/HomePage.tsx: page sections, navigation and callback form.
- src/components/site/BrandSections.tsx: animated alliances and client gallery.
- src/styles.css and src/website.css: design tokens, responsive layout and animations.
- src/assets/: locally bundled photographs. Staff and board portraits live in src/assets/people/; service page media and the 2026 training calendar PDF live in src/assets/services/.
- src/components/: shared components.
- public/: static files copied into the build.

Content is maintained in the source. Google Fonts supplies the typefaces, with system fallbacks. The callback form prepares an email in the visitor's email app; the visitor must send it to complete the request. Direct server submission requires an enquiry service. Phone and email links use the office details supplied for the site.

## Admin design handoff

Open `/admin/#content-map` for the page directory and proposed API map. Each content page has a direct address such as `/admin/#service-pages/cybershield/header`. Drafts, content review and confirmed publishing are interactive **browser-only prototypes**; homepage previews render the actual page, and published homepage content appears in the same browser after refresh. Other visitors are unaffected. Read [the CMS handoff](docs/admin-cms-handoff.md) for endpoint contracts, data relationships, production requirements and the review checklist.

# Sentinel Africa Consulting: Backend Architecture and API Specification

|          |                                                                                                                                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Audience | Backend engineering team                                                                                                                         |
| Status   | Draft for review, version 1.0 (23 October 2026)                                                                                                  |
| Frontend | This repository: Vite + React 19 + TypeScript, multi-page static site with a staff console                                                       |
| Related  | [`admin-cms-handoff.md`](admin-cms-handoff.md) (console prototype notes); this document keeps the same endpoint names and specifies them in full |

---

## Contents

1. [Purpose and scope](#1-purpose-and-scope)
2. [What exists today](#2-what-exists-today)
3. [Target architecture](#3-target-architecture)
4. [Public page inventory](#4-public-page-inventory)
5. [API conventions](#5-api-conventions)
6. [Authentication and authorisation](#6-authentication-and-authorisation)
7. [Content model](#7-content-model)
8. [Homepage](#8-homepage)
9. [Inner pages](#9-inner-pages)
10. [Collections](#10-collections)
11. [Site settings, header and footer](#11-site-settings-header-and-footer)
12. [Media](#12-media)
13. [Public submissions and the inbox](#13-public-submissions-and-the-inbox)
14. [Travel Advisory](#14-travel-advisory)
15. [Training bookings](#15-training-bookings)
16. [Dashboard and audit](#16-dashboard-and-audit)
17. [Non-functional requirements](#17-non-functional-requirements)
18. [Frontend integration plan](#18-frontend-integration-plan)
19. [Delivery phases](#19-delivery-phases)
20. [Open decisions](#20-open-decisions)
21. [Appendix A: endpoint index](#appendix-a-endpoint-index)
22. [Appendix B: frontend field types to JSON](#appendix-b-frontend-field-types-to-json)

---

## 1. Purpose and scope

The public website and the staff console are built as a **frontend layout**. No backend exists yet. Everything that should be dynamic is currently either bundled into the code or kept in the browser:

- Page wording, logos, people, courses, articles and job openings are TypeScript or JSON files under `src/`.
- The staff console saves drafts and "prototype releases" to `localStorage` (`src/components/admin/cms/prototypeStore.ts`). Nothing is shared between staff or visitors.
- Staff sign-in accepts any credentials.
- Forms (callback, job applications, testimonials) open the visitor's email app or save to the browser.

This document specifies the backend that replaces all of that: authentication, a content API that the console writes and the website reads, media storage, form submissions with a private inbox, the Travel Advisory data pipeline, and the hooks for training bookings and payments.

**Goal for the admin experience:** every section of every public page is editable from the console, drafts are private, publishing is explicit and reversible, and nothing a visitor sees comes from hard-coded data once the backend is live.

**Out of scope:** the payment provider contract (section 15 defines the boundary only), email template design, and hosting procurement.

---

## 2. What exists today

### 2.1 Build and runtime

- **Framework:** Vite multi-page build. Each public page is a folder with its own `index.html` (for example `managed-services/index.html`). Each one loads an entry in `src/entries/*.tsx`, rendered through `src/mount.tsx`. The list of pages is `innerPages` in `vite.config.ts`.
- **No router and no server.** Pages link with ordinary `<a href>`. The console uses the URL hash for navigation (`/admin/#service-pages/cybershield/header`, handled in `src/components/admin/adminLocation.ts`).
- **Output:** `dist/`, deployable to any static host or CDN.
- **External call already in production code:** the browser calls WHO's Disease Outbreak News API directly (`src/components/travel/whoOutbreakNews.ts`). The backend should take this over (section 14).

### 2.2 Where content lives now

| Data                                            | Current source                                                                                | Replaced by                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------- |
| Homepage wording, services, testimonials        | `src/content/homepage.ts`                                                                     | `pages/home` + collections |
| Alliance and client logos, sectors              | `src/content/brands.ts`                                                                       | `partners` collection      |
| Team and board                                  | `src/content/team.ts`, `src/content/board.ts`                                                 | `people` collection        |
| Office addresses                                | `src/content/offices.ts`                                                                      | `site` settings            |
| Blog index and bodies                           | `src/content/blog-index.json`, `src/content/blog/*.json`                                      | `articles` collection      |
| Training catalogue                              | `src/components/site/trainingCourses.ts`                                                      | `courses` collection       |
| Job openings                                    | `src/components/site/careers.ts`                                                              | `jobs` collection          |
| Travel advisories, requirements, sources        | `src/content/travel-advisory.json`                                                            | Travel API (section 14)    |
| Inner page wording (About, Services, Resources) | Inline in each `*Page.tsx`, mirrored for the console in `src/content/admin-page-context.json` | `pages/*`                  |
| Console drafts and releases                     | `localStorage` (`prototypeStore.ts`)                                                          | Pages/collections API      |
| Homepage preview of local releases              | `src/content/homepageDemo.ts`                                                                 | Public pages API           |

### 2.3 The console's schema is the contract

The console already describes every editable page, section and field in code:

- `src/components/admin/cms/types.ts`: field types (`text`, `textarea`, `richtext`, `url`, `email`, `date`, `image`, `video`, `file`, `select`, `toggle`, `tags`, `paragraphs`, `list`).
- `src/components/admin/cms/editors.ts` and `extendedEditors.ts`: one entry per workspace, then pages, then sections (blocks), then fields.

**The backend's section schemas must be generated from, or kept identical to, these definitions.** Field keys in this document match those files. Appendix B maps each field type to its JSON representation.

---

## 3. Target architecture

```
                         ┌──────────────────────────────────────────────┐
 Visitors ──► CDN ──────►│ Static site (dist/)   www.sentinelafrica…     │
                │        └──────────────┬───────────────────────────────┘
                │                       │ fetch (public, cached)
                ▼                       ▼
        ┌──────────────────────────────────────────────────────────────┐
        │ API service  /api/public/*  /api/admin/*  /api/auth/*        │
        │  • Auth & sessions      • Pages & revisions • Collections    │
        │  • Media                • Submissions/inbox • Travel         │
        │  • Audit log            • Webhooks (payments, rebuild)       │
        └───┬──────────────┬───────────────┬─────────────┬────────────┘
            │              │               │             │
     ┌──────▼─────┐ ┌──────▼──────┐ ┌──────▼─────┐ ┌─────▼───────────┐
     │ PostgreSQL │ │ Object store│ │ Job queue  │ │ Email provider  │
     │ (content,  │ │ (media, CVs,│ │ (WHO/CDC   │ │ (notifications, │
     │  inbox,    │ │  private    │ │  ingestion,│ │  password reset)│
     │  audit)    │ │  uploads)   │ │  emails,   │ └─────────────────┘
     └────────────┘ └─────────────┘ │  rebuilds) │
                                    └────────────┘
 Staff ──► /admin/ (same static site) ──► /api/admin/* with session cookie
```

### 3.1 Components

| Component             | Responsibility                                                                             | Notes                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| Static site           | Public pages and the console UI                                                            | Unchanged build; pages fetch published content at load                                              |
| API service           | All endpoints in this document                                                             | Stateless, horizontally scalable; any mainstream stack (Node/TypeScript recommended to share types) |
| PostgreSQL            | Content, revisions, collections, inbox, users, audit                                       | JSONB for section content; relational tables for workflow data                                      |
| Object storage        | Public media (via CDN) and private files (CVs, proposals) in separate buckets              | Private bucket served only through signed URLs                                                      |
| Job queue / scheduler | WHO and CDC ingestion every 6 hours, outbound email, image variants, optional site rebuild | Retries with back-off; dead-letter queue                                                            |
| Email provider        | Staff invitations, password reset, MFA recovery, inbox notifications, applicant receipts   | Transactional provider; SPF, DKIM and DMARC on the sending domain                                   |

### 3.2 How the public site gets content

There are two viable delivery models. **Recommendation: A, runtime reads with CDN caching.** It needs the least frontend change and makes publishing instant.

|                 | A. Runtime read (recommended)                                                | B. Build-time                                                      |
| --------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| How             | Each page calls `GET /api/public/pages/:slug` and its collections on load    | CI fetches published content and rebuilds `dist/` on every publish |
| Publish latency | Seconds (CDN purge on publish)                                               | Minutes (build + deploy)                                           |
| Search engines  | Content rendered client-side, as now                                         | Fully static HTML                                                  |
| Failure mode    | API down means content cannot load. Mitigate by bundling a fallback snapshot | API down only affects publishing                                   |

Either way, publishing must **purge the CDN paths** for the affected page and collections, or trigger the rebuild webhook (`POST /api/admin/deployments` is reserved for model B).

### 3.3 Environments

`local` → `staging` (seeded from production content, console and site on staging domains) → `production`. Staff accounts are separate per environment. Payment and email providers use sandbox keys outside production.

---

## 4. Public page inventory

Every page in the header and footer, the sections it renders in order, and what it needs from the backend. Slugs are the page IDs used by the pages API.

### 4.1 Homepage and global

| URL        | Page ID | Sections (in order)                                                                         | Backend data                                                                                            |
| ---------- | ------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `/`        | `home`  | Hero → Alliances → Who we are → Services → Contact (callback form) → Clients → Testimonials | Page sections; `partners` (alliances, clients); `testimonials`; enquiry submission; feedback submission |
| every page | `site`  | Top bar, main menu, footer, offices, WhatsApp button                                        | Site settings (section 11)                                                                              |

### 4.2 About Us

| URL                        | Page ID            | Sections                                          | Backend data                 |
| -------------------------- | ------------------ | ------------------------------------------------- | ---------------------------- |
| `/who-we-are/`             | `who-we-are`       | Header, key facts, story video, core values       | Page sections                |
| `/how-we-do-it/`           | `how-we-do-it`     | Header, Understand–Tailor–Embed steps, commitment | Page sections                |
| `/why-we-do-it/`           | `why-we-do-it`     | Header, story, mission and vision                 | Page sections                |
| `/board/`                  | `board`            | Header, directors (chair first)                   | `people` where `group=board` |
| `/team/`                   | `team`             | Header, team members with profiles                | `people` where `group=team`  |
| `/#alliances`, `/#clients` | (homepage anchors) |                                                   | `partners`                   |

### 4.3 Our Services

| URL                   | Page ID             | Key sections                                                                          | Backend data                                  |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- |
| `/consultancy/`       | `consultancy`       | Header, standards, modus operandi, documents                                          | Page sections                                 |
| `/managed-services/`  | `managed-services`  | Header, audiences, benefits, capabilities, Cyber Shield panel                         | Page sections                                 |
| `/training/`          | `training`          | Header, certification programmes, calendar PDF, formats, CDPO video                   | Page sections; `courses`; `events` (sessions) |
| `/cybershield/`       | `cybershield`       | Header, SOC cycle, managed services, assessments, comparison table                    | Page sections                                 |
| `/software-products/` | `software-products` | Header, product path, GapAssess, ISMS Platform, StrataOne, implementation and support | Page sections (tools list)                    |

All service pages end with "Explore our other services" (derived from the services menu) and the callback call to action, which pre-selects the service through `?interest=`.

### 4.4 Resources

| URL                              | Page ID | Key sections                                   | Backend data  |
| -------------------------------- | ------- | ---------------------------------------------- | ------------- |
| `/blog/` and `/blog/?post=:slug` | `blog`  | Header, article list with search, article view | `articles`    |
| `/our-sdgs-commitment/`          | `sdg`   | Header, three goals, gender split, commitments | Page sections |

### 4.5 Tools

Self-service tools are grouped under a **Tools** menu so new ones can be added in one place. The tool list (label, category, summary, page, callback option, badge) lives in `toolPages` (`src/components/site/navigation.ts`) and is edited in the console's **Tools** workspace. It should become a `site` setting or a `tools` collection.

| URL                         | Page ID                   | Key sections                                                                    | Backend data                 |
| --------------------------- | ------------------------- | ------------------------------------------------------------------------------- | ---------------------------- |
| `/tools/`                   | `tools`                   | Header, a card per tool, "More tools on the way"                                | Page sections; the tool list |
| `/travel-advisory/`         | `travel-advisory`         | Header, journey check, results, WHO reports, library, sources, FAQ, other tools | Travel API (section 14)      |
| `/rwanda-dpp-registration/` | `rwanda-dpp-registration` | Header, who must register, steps, documents, other tools                        | Page sections                |

### 4.6 Careers, Upcoming, FAQ

| URL                                 | Page ID         | Key sections                                                                            | Backend data                                 |
| ----------------------------------- | --------------- | --------------------------------------------------------------------------------------- | -------------------------------------------- |
| `/join-our-team/` and `?role=:slug` | `join-our-team` | Header, open and recently closed roles, role detail with application, register interest | `jobs`; job-application submission           |
| `/talent-shield/`                   | `talent-shield` | Header, testimonial, about, eligibility, stages, enquiries, video                       | Page sections; talent-application submission |
| `/upcoming/` (planned)              | `upcoming`      | Introduction, featured events                                                           | `events`                                     |
| `/faq/` (planned)                   | `faq`           | Introduction, questions by category                                                     | Page sections (questions list)               |

"Upcoming" and "FAQ" show "Soon" in the header today. Their console editors exist, and their public pages will be built against these endpoints.

### 4.7 Staff area

| URL                                  | Purpose                                        | Backend data       |
| ------------------------------------ | ---------------------------------------------- | ------------------ |
| `/staff-login/`                      | Sign in (email, password, "keep me signed in") | Section 6          |
| `/forgot-password/`                  | Request a reset link                           | Section 6          |
| `/reset-password/?token=` (to build) | Choose a new password                          | Section 6          |
| `/accept-invite/?token=` (to build)  | First sign-in for invited staff                | Section 6          |
| `/admin/`                            | Staff console                                  | All `/api/admin/*` |

All staff pages are `noindex, nofollow` and must also be blocked in `robots.txt` once live.

---

## 5. API conventions

### 5.1 Namespaces

| Prefix            | Who calls it                          | Auth                                                |
| ----------------- | ------------------------------------- | --------------------------------------------------- |
| `/api/public/*`   | Website visitors                      | None; rate-limited; returns **published** data only |
| `/api/auth/*`     | Staff sign-in, reset and invite flows | None or token; heavily rate-limited                 |
| `/api/admin/*`    | Staff console                         | Session cookie + CSRF token + role check            |
| `/api/webhooks/*` | Payment provider, CI                  | Provider signature verification                     |

Versioning: send `Accept: application/vnd.sentinel.v1+json`, or mount under `/api/v1/…`. Pick one before the first release and never change response shapes without a version bump.

### 5.2 Formats

- JSON in and out, UTF-8, `camelCase` keys.
- Dates are ISO 8601 in UTC (`2026-10-23T09:42:00Z`). Pure dates are `YYYY-MM-DD`. Events carry an IANA `timezone` such as `Africa/Nairobi`.
- IDs are opaque strings (ULID recommended), for example `pg_01J…`, `art_01J…`. Slugs are separate, editable and unique per collection.
- Money is `{ "amount": 15000, "currency": "KES" }`, with `amount` in minor units. Never use floats.
- Rich text is stored as the limited structured markup the console already produces: paragraphs, **bold**, _italic_ and bullet lists, rendered safely by `src/components/site/FormattedText.tsx`. **Never accept or return raw HTML** except legacy blog bodies, which must be sanitised server-side with an allow-list on write.

### 5.3 Lists and pagination

```
GET /api/admin/collections/articles?status=published&q=privacy&sort=-publishedAt&limit=20&cursor=eyJpZCI6…
```

```json
{
  "data": [{ "id": "art_01J…", "title": "…" }],
  "page": { "limit": 20, "nextCursor": "eyJpZCI6…", "total": 30 }
}
```

### 5.4 Errors (RFC 9457 problem details)

```json
{
  "type": "https://api.sentinelafrica…/errors/validation",
  "title": "Some fields need attention",
  "status": 422,
  "code": "validation_failed",
  "errors": [
    { "path": "sections[0].content.imageAlt", "code": "required", "message": "Describe the image." }
  ],
  "requestId": "req_01J…"
}
```

| Status | Use                                         | Console behaviour (already designed)                              |
| ------ | ------------------------------------------- | ----------------------------------------------------------------- |
| 400    | Malformed request                           | Generic error                                                     |
| 401    | No or expired session                       | Redirect to `/staff-login/?next=…`, keep unsaved input in memory  |
| 403    | Signed in, role not allowed                 | Explain which role is needed                                      |
| 404    | Unknown ID or slug                          |                                                                   |
| 409    | Revision conflict (`baseRevision` is stale) | Show "Someone else changed this section", offer reload or compare |
| 413    | Upload too large                            | Show the limit                                                    |
| 415    | Wrong file type                             |                                                                   |
| 422    | Field validation                            | Inline errors by `path`                                           |
| 429    | Rate limited                                | `Retry-After` header                                              |

### 5.5 Concurrency and idempotency

- Every draft and record carries an integer `revision`. Writes send `baseRevision` (or `If-Match: "r12"`) and the server rejects stale writes with 409.
- Public submissions and payment-initiating calls accept an `Idempotency-Key` header (UUID). The same key within 24 hours returns the original response.

### 5.6 Caching

- Public `GET` responses carry `ETag` (published revision) and `Cache-Control: public, max-age=60, s-maxage=600, stale-while-revalidate=86400`. Publishing purges the affected CDN keys.
- Admin responses are `Cache-Control: no-store`.

---

## 6. Authentication and authorisation

### 6.1 Frontend touch points

| File                                          | Today                                                                                                        | With the backend                                                                  |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| `src/components/staff/StaffLoginPage.tsx`     | Validates the email format and a non-empty password, waits 600 ms (`simulatedRequest`), then opens `/admin/` | `POST /api/admin/session`; handle `mfa_required`, errors and lockout              |
| `src/components/staff/ForgotPasswordPage.tsx` | Shows "Check your inbox" for any valid email                                                                 | `POST /api/auth/password/forgot`; always show the same message                    |
| `src/components/staff/session.ts`             | `goTo`, `simulatedRequest`                                                                                   | Replace with an API client                                                        |
| `src/components/admin/AdminPage.tsx`          | Renders for anyone                                                                                           | On load, `GET /api/admin/session`; on 401, redirect to `/staff-login/?next=`      |
| `src/components/admin/AdminTopbar.tsx`        | "Administrator" placeholder, Sign out links to the login page                                                | Show the real name, initials and role; Sign out calls `DELETE /api/admin/session` |
| Sidebar "Sign out"                            | Link                                                                                                         | Same as above                                                                     |

### 6.2 Session model

- **Server-side sessions** with an opaque ID in a cookie: `__Host-sa_session`, `HttpOnly; Secure; SameSite=Strict; Path=/`. Do not store JWTs in `localStorage`.
- **Lifetime:** 12-hour idle timeout; "Keep me signed in" extends this to a 30-day absolute limit. Sessions are rotated on sign-in, privilege change and password change.
- **CSRF:** double-submit token. `GET /api/admin/session` returns `csrfToken`, and every mutating admin request sends `X-CSRF-Token`.
- **MFA:** TOTP is **required** for Publisher and Administrator roles and optional for Editors, with ten single-use recovery codes.
- **Passwords:** Argon2id. Minimum 12 characters, checked against a breached-password list. No forced periodic rotation.
- **Lockout:** after 5 failed attempts per account in 15 minutes, add progressive delays; also rate-limit per IP. The message never reveals whether an email exists.

### 6.3 Roles and permissions

| Permission                                          |    Editor    | Publisher | Travel Reviewer | Administrator |
| --------------------------------------------------- | :----------: | :-------: | :-------------: | :-----------: |
| Read console, edit drafts, upload media             |      ✓       |     ✓     |                 |       ✓       |
| Publish, unpublish, restore revisions               |              |     ✓     |                 |       ✓       |
| Read and manage the inbox (enquiries, applications) | ✓ (assigned) |     ✓     |                 |       ✓       |
| Read private uploads (CVs)                          |              |     ✓     |                 |       ✓       |
| Travel: prepare records                             |      ✓       |     ✓     |        ✓        |       ✓       |
| Travel: publish or withdraw records                 |              |           |        ✓        |       ✓       |
| Staff accounts, roles, settings                     |              |           |                 |       ✓       |
| Audit log                                           |              |           |                 |       ✓       |

Enforce permissions **server-side on every endpoint**. The console hides controls a user cannot use, but that is only a convenience. The Travel Reviewer role exists so that one person drafts and a different person publishes an advisory (four-eyes rule, see section 14).

### 6.4 Endpoints

#### `POST /api/admin/session`: sign in

Request:

```json
{ "email": "name@sentinelafricaconsulting.com", "password": "••••••••", "remember": true }
```

Responses:

- `200`: signed in. Sets the cookie.
  ```json
  {
    "user": {
      "id": "usr_01J…",
      "name": "Faith Mulwa",
      "email": "…",
      "initials": "FM",
      "roles": ["publisher"]
    },
    "csrfToken": "…",
    "expiresAt": "2026-10-23T21:42:00Z"
  }
  ```
- `200` with `{ "status": "mfa_required", "challengeId": "mfa_01J…" }`: the password was correct and a TOTP code is needed. No session yet.
- `401` `invalid_credentials`. The same message for an unknown email or a wrong password.
- `423` `account_locked` with `Retry-After`.

#### `POST /api/admin/session/mfa`

```json
{ "challengeId": "mfa_01J…", "code": "123456" }
```

`200` returns the same body as a successful sign-in. A recovery code is accepted in place of `code` as `recoveryCode`.

#### `GET /api/admin/session`

Returns the current user, permissions and `csrfToken`, or `401`. The console calls this on load.

```json
{
  "user": { "id": "usr_…", "name": "…", "initials": "…", "roles": ["editor"], "avatarUrl": null },
  "permissions": ["content.read", "content.write", "media.write", "inbox.read"],
  "csrfToken": "…"
}
```

#### `DELETE /api/admin/session`

Signs out: revokes the session and clears the cookie. Returns `204`.

#### `POST /api/auth/password/forgot`

```json
{ "email": "name@…" }
```

**Always `202`**, whether or not the account exists. If it exists, email a single-use token valid for 30 minutes. Rate-limit per email and IP.

#### `POST /api/auth/password/reset`

```json
{ "token": "…", "password": "new password" }
```

`204`. Revokes all existing sessions for the user. Errors: `410 token_expired`, `422 weak_password`.

#### `POST /api/auth/invitations/accept`

```json
{ "token": "…", "name": "…", "password": "…" }
```

Creates the account from an invitation (section 6.5) and signs the user in.

#### `GET/PATCH /api/admin/me` and `POST /api/admin/me/password`

Profile (name, photo asset), password change (requires `currentPassword`), MFA enrol and disable (`POST /api/admin/me/mfa`, `DELETE /api/admin/me/mfa`), and a list of active sessions with revoke. This backs the "My profile" screen.

### 6.5 Staff accounts (Administrator only)

| Method | Endpoint                             | Purpose                                                                          |
| ------ | ------------------------------------ | -------------------------------------------------------------------------------- |
| GET    | `/api/admin/staff?status=active`     | List: name, email, roles, last active, status (`active`, `invited`, `suspended`) |
| POST   | `/api/admin/staff`                   | Invite `{ email, name, roles }`. Sends an invitation email valid for 7 days      |
| PATCH  | `/api/admin/staff/:id`               | Change roles or status. Cannot remove the last Administrator                     |
| POST   | `/api/admin/staff/:id/resend-invite` |                                                                                  |
| DELETE | `/api/admin/staff/:id/sessions`      | Force sign-out everywhere                                                        |

---

## 7. Content model

### 7.1 Concepts

| Concept               | Description                                                                                                      |
| --------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Page**              | A public page (`home`, `who-we-are`, …), made of ordered **sections**                                            |
| **Section**           | A typed block (`hero`, `services`, `header`, …) with `content` validated against a schema                        |
| **Revision**          | An immutable snapshot of a page or record. Each page has one draft head and one published head                   |
| **Collection record** | A reusable item (article, person, partner, testimonial, course, event, job), edited once and referenced by pages |
| **Asset**             | An uploaded file in object storage, referenced by ID                                                             |

### 7.2 Lifecycle

```
            save draft              publish (Publisher)
  (none) ───────────────► DRAFT ─────────────────────────► PUBLISHED
                            ▲  │                               │
                            │  └── discard draft ──► (published unchanged)
                            │                                  │
                            └──────── restore revision ◄───────┘  (creates a new draft)
  Records may also be ARCHIVED (hidden from public, kept for history and references).
```

Rules:

1. Editing never changes what visitors see. Only `publish` moves the published head.
2. Publishing is atomic per page or record, and publishes the **exact** draft revision the user reviewed (`draftRevision` in the request).
3. Restoring creates a new draft and never auto-publishes.
4. Keep every published revision. Draft autosaves may be compacted after 30 days.

### 7.3 Database tables (PostgreSQL)

```sql
pages (
  id text primary key,                 -- 'home', 'who-we-are', …
  slug text unique not null,           -- '/', '/who-we-are/'
  schema_version int not null,
  draft_revision_id text references page_revisions(id),
  published_revision_id text references page_revisions(id),
  updated_at timestamptz, updated_by text references users(id)
);

page_revisions (
  id text primary key, page_id text references pages(id),
  number int not null,                 -- 1, 2, 3 … per page
  sections jsonb not null,             -- [{ id, type, order, visible, content }]
  seo jsonb,                           -- { title, description, shareImageAssetId }
  created_at timestamptz, created_by text references users(id),
  published_at timestamptz, published_by text references users(id),
  unique (page_id, number)
);

collection_records (
  id text primary key, collection text not null,   -- 'articles', 'people', …
  slug text, status text not null,                  -- draft | published | archived
  sort_order int not null default 0,
  draft jsonb, published jsonb,                     -- current draft/published content
  revision int not null,
  published_at timestamptz, updated_at timestamptz, updated_by text,
  unique (collection, slug)
);
collection_record_revisions ( record_id, revision, data jsonb, created_at, created_by, published boolean );

references ( from_type, from_id, to_collection, to_id ); -- for "used in" and safe archiving
```

Section `content` and record data are validated against JSON Schemas generated from the console definitions. Reject unknown keys.

### 7.4 Section and reference shapes

```json
{
  "id": "hero",
  "type": "hero",
  "order": 0,
  "visible": true,
  "content": {
    "eyebrow": "Risk management advisory",
    "headline": "Expertise across sectors.",
    "image": { "assetId": "ast_01J…", "alt": "Leaders and practitioners attending…" }
  }
}
```

- Images are `{ assetId, alt }` on write. On public read, the server resolves them to `{ url, width, height, alt, variants: { "640": "…", "1280": "…" } }`.
- A section that lists collection items stores **references**, never copies: `{ "testimonials": { "ids": ["tst_…", "tst_…"] } }`, or a query such as `{ "source": "all-published", "sort": "order" }`.
- Section IDs stay stable when sections are reordered.

### 7.5 Pages API (admin)

| Method | Endpoint                                                       | Body / result                                                                                                                                     | Role      |
| ------ | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| GET    | `/api/admin/pages`                                             | Page index: id, label, slug, status (`published`, `draft-changes`, `never-published`), draft and published revision numbers, updatedAt, updatedBy | Editor    |
| GET    | `/api/admin/pages/:pageId`                                     | `{ page, schema, draft, published }`. `schema` lists sections and fields so the console can render them                                           | Editor    |
| PUT    | `/api/admin/pages/:pageId/draft`                               | `{ baseRevision, sections, seo }` → `{ draftRevision, savedAt, savedBy }`. 409 on a stale base                                                    | Editor    |
| PATCH  | `/api/admin/pages/:pageId/draft/sections/:sectionId`           | `{ baseRevision, content }`. Saves one section, matching the console's per-section **Save draft**                                                 | Editor    |
| DELETE | `/api/admin/pages/:pageId/draft`                               | Discards the draft; the published version is untouched                                                                                            | Editor    |
| POST   | `/api/admin/pages/:pageId/preview`                             | `{ draftRevision }` → `{ url, expiresAt }`. A signed preview URL valid for 1 hour                                                                 | Editor    |
| POST   | `/api/admin/pages/:pageId/publish`                             | `{ draftRevision, basePublishedRevision, note }` → `{ publishedRevision, publishedAt }`                                                           | Publisher |
| GET    | `/api/admin/pages/:pageId/revisions`                           | Paginated history with author, time, note, published flag                                                                                         | Editor    |
| GET    | `/api/admin/pages/:pageId/revisions/:n/diff?against=published` | Field-level diff for the review screen (`ContentReview.tsx`)                                                                                      | Editor    |
| POST   | `/api/admin/pages/:pageId/restore`                             | `{ revision }` → new draft                                                                                                                        | Publisher |

### 7.6 Pages API (public)

`GET /api/public/pages/:pageId` (or `?slug=/who-we-are/`) returns the published revision only, with assets resolved and referenced collection items expanded (published items only).

```json
{
  "id": "home",
  "revision": 14,
  "publishedAt": "2026-10-23T09:42:00Z",
  "seo": { "title": "Sentinel Africa Consulting — Risk Management Advisory", "description": "…" },
  "sections": [ { "id": "hero", "type": "hero", "content": { … } } ]
}
```

`GET /api/public/preview/:token` returns the same shape for a draft, and only with a valid preview token. Preview responses are `no-store` and `X-Robots-Tag: noindex`.

---

## 8. Homepage

Page ID `home`. Rendered by `src/components/site/HomePage.tsx` and `BrandSections.tsx`. The field keys below are exactly those in `src/content/homepage.ts` (type `HomepageContent`) and the console's Homepage editor (`editors.ts`, `homepageEditor`). The frontend currently reads this object. With the backend, the same object is assembled from `GET /api/public/pages/home`.

### 8.1 Section `hero` (anchor `#top`)

| Field                             | Type                           | Rules                                                            |
| --------------------------------- | ------------------------------ | ---------------------------------------------------------------- |
| `eyebrow`                         | string                         | ≤ 60 chars                                                       |
| `headline`                        | string                         | Required, ≤ 60. The last word wraps onto its own line on desktop |
| `highlight`                       | string                         | Required, ≤ 30. Shown in brand blue                              |
| `headlineEnd`                     | string                         | Required, ≤ 40. A full stop is appended in green                 |
| `intro`                           | string                         | Required, ≤ 300                                                  |
| `primaryButton`                   | string                         | ≤ 30. Scrolls to the callback form with "Training" pre-selected  |
| `secondaryButton`                 | string                         | ≤ 30. Scrolls to `#services`                                     |
| `statValue`                       | string                         | Digits only; "+" is appended                                     |
| `statLabel`, `statStrong`         | string                         | ≤ 60 each                                                        |
| `image`                           | image                          | Required, landscape, min 1200×800, `alt` required                |
| `imageCaption`, `sideLabel`       | string                         | ≤ 60                                                             |
| `certificationTitle`              | string                         |                                                                  |
| `certifications`                  | list of `{ standard, system }` | 1–3 items                                                        |
| `certificationNote`, `bottomLine` | string                         |                                                                  |

### 8.2 Section `alliances` (anchor `#alliances`)

Fields `title` and `intro`. The logos come from **`partners` where `kind=alliance`**, ordered by `sortOrder`.

### 8.3 Section `about`: "Who we are" (anchor `#about`)

`eyebrow`, `title`, `accent`, `lead`, `paragraphs` (string[], 1–5), `principles` (string[], 1–4), `closing`, `linkLabel`, `photo` (image, portrait 4:5), `inset` (image), `insetCaption`. Alt text is required for both images.

### 8.4 Section `services` (anchor `#services`)

`eyebrow`, `title`, `accent`, `intro`, `linkLabel`, `stripLabel`, and `items[]`:

| Field         | Type   | Rules                                                                             |
| ------------- | ------ | --------------------------------------------------------------------------------- |
| `title`       | string | Required, unique within the list. **Also used as an option in the callback form** |
| `standard`    | string | For example "ISO 27001"                                                           |
| `icon`        | enum   | `shield`, `lock`, `refresh`, `target`                                             |
| `description` | string | ≤ 220                                                                             |
| `detail`      | string | Topics separated by "·"                                                           |

The "How we work with you" strip below lists the service pages from the site menu (section 11), not this list.

### 8.5 Section `contact`: callback request (anchor `#contact`)

`eyebrow`, `title`, `accent`, `intro`, `reassurances` (string[]), `phoneLabel`, `phone` (E.164 on save, displayed formatted), `formTitle`, `formIntro`, and `recipient` (email that receives notifications; **private**, so omit it from the public response).

The form posts to `POST /api/public/submissions/enquiries` (section 13.2). Its "I'm interested in" options are: `services.items[].title` + the service page labels + each tool's `interest` ("Rwanda DPP Registration", "Travel Risk Intelligence"). The server must validate `interest` against this same list.

### 8.6 Section `clients` (anchor `#clients`)

`eyebrow`, `title`, `accent`, `intro`. Logos come from **`partners` where `kind=client`**. The filter buttons are "All clients" plus the sector list (`site` settings, `clientSectors`).

### 8.7 Section `testimonials` (anchor `#testimonials`)

`eyebrow`, `title`, `accent`, `intro`. Items come from **`testimonials` where `status=published`**, ordered by `sortOrder`. Initials are derived from `name` on the frontend. Visitors can submit feedback from this section (`POST /api/public/submissions/feedback`, section 13.3).

### 8.8 Example public response (abridged)

```json
{
  "id": "home",
  "revision": 14,
  "sections": [
    {
      "id": "hero",
      "type": "hero",
      "content": {
        "eyebrow": "Risk management advisory",
        "headline": "Expertise across sectors.",
        "highlight": "Confidence",
        "headlineEnd": "beyond borders",
        "image": {
          "url": "https://cdn…/sentinel-conference-1280.jpg",
          "width": 1280,
          "height": 853,
          "alt": "Leaders and practitioners attending a Sentinel Africa risk management conference"
        },
        "certifications": [
          { "standard": "ISO 27001", "system": "ISMS" },
          { "standard": "ISO 27701", "system": "PIMS" }
        ]
      }
    },
    {
      "id": "alliances",
      "type": "logo-strip",
      "content": {
        "title": "Our alliances",
        "intro": "Global expertise. A shared commitment.",
        "items": [{ "id": "prt_…", "name": "PECB", "logo": { "url": "…", "alt": "PECB" } }]
      }
    },
    {
      "id": "testimonials",
      "type": "testimonials",
      "content": {
        "title": "Confidence, in their",
        "accent": "own words.",
        "items": [
          {
            "id": "tst_…",
            "name": "Anthony Gatura",
            "role": "IT Support and System Admin · International School of Kenya",
            "quote": "…"
          }
        ]
      }
    }
  ]
}
```

---

## 9. Inner pages

Every inner page starts with a **`header`** section, rendered by `PageHero` in `src/components/site/InnerPage.tsx`:

| Field            | Type     | Rules                                                      |
| ---------------- | -------- | ---------------------------------------------------------- |
| `eyebrow`        | string   | ≤ 80                                                       |
| `title`          | string   | Required. Also the breadcrumb label                        |
| `lead`           | richtext | ≤ 400                                                      |
| `seoTitle`       | string   | ≤ 60. Defaults to `"{title} — Sentinel Africa Consulting"` |
| `seoDescription` | string   | ≤ 160. Also used for link previews                         |

The closing "Your next step starts with a conversation" call to action is shared and configured in `site` settings. A page passes only its `interest` value.

Section lists below follow the console editors. "Cards" means `items[]: { title, text }`.

### 9.1 About Us

| Page           | Sections and fields                                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `who-we-are`   | `header`; `facts` (items: `label`, `value`); `story` (`videoId` YouTube ID, `poster` image, `paragraphs`); `values` (string[]) |
| `how-we-do-it` | `header`; `steps` (cards: Understand, Tailor, Embed); `commitment` (`title`, `paragraphs`)                                     |
| `why-we-do-it` | `header`; `story` (`paragraphs`, `photo`); `mission` (`mission`, `vision`)                                                     |
| `board`        | `header`; `directors` → `people` where `group=board`                                                                           |
| `team`         | `header`; `members` → `people` where `group=team`                                                                              |

### 9.2 Our Services

| Page                | Sections and fields                                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `consultancy`       | `header`; `standards` (cards); `method` (cards); `documents` (groups: `title`, `items[]`)                                                 |
| `managed-services`  | `header`; `benefits` (cards); `capabilities` (cards); `cyber-shield` (`title`, `text`)                                                    |
| `training`          | `header`; `courses` → `courses` collection; `calendar` (`title`, `file` PDF asset); `formats` (cards)                                     |
| `cybershield`       | `header`; `soc` (cards); `services` (cards); `assessments` (cards). The comparison table can follow the same cards pattern with `columns` |
| `software-products` | `header`; `products` (items: `name`, `category`, `tagline`, `text`, `features[]`, `url`, `shot` image)                                    |

Rules: `url` fields are absolute `https://` links or site paths beginning with `/`. Links to other websites open in a new tab with `rel="noreferrer"` (the frontend enforces this). The server must reject `javascript:` and `data:` URLs.

### 9.3 Resources

| Page   | Sections and fields                                                                                                                        |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `blog` | `header`; `articles` → `articles` collection                                                                                               |
| `sdg`  | `header`; `goals` (items: `number`, `name`, `text`, `photo`); `gender` (items: `team`, `men`, `women`, integer percentages summing to 100) |

### 9.4 Tools

| Page                      | Sections and fields                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| `tools`                   | `header`; `tools` (items: `label`, `category`, `summary`, `href`, `interest`, `badge`)     |
| `travel-advisory`         | `header`; `records` → Travel API                                                           |
| `rwanda-dpp-registration` | `header`; `who` (`text`); `steps` (cards); `documents` (items: `text`, `template` boolean) |

### 9.5 Careers and planned pages

| Page                 | Sections and fields                                                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `join-our-team`      | `header`; `shield` (`items[]`, `locations`); `roles` → `jobs`; `interest` (`title`, `intro`, `email` private recipient)                                     |
| `talent-shield`      | `header`; `status` (`open` boolean, `whatsapp`, `email`, `videoId`); `testimonial` (`quote`, `name`, `detail`); `eligibility` (`eligibility[]`, `stages[]`) |
| `upcoming` (planned) | `intro` (`title`, `intro`, `image`, `imageAlt`); `events` → `events` where `featured=true` and upcoming                                                     |
| `faq` (planned)      | `intro` (`title`, `intro`); `questions` (items: `title`, `category`, `answer`, `visible`)                                                                   |

When `talent-shield.status.open` is `false`, `POST /api/public/submissions/talent-applications` must return `409 applications_closed`.

---

## 10. Collections

Shared endpoints for every collection:

| Method | Endpoint                                           | Notes                                                                    | Role      |
| ------ | -------------------------------------------------- | ------------------------------------------------------------------------ | --------- |
| GET    | `/api/admin/collections/:collection`               | Filters `status`, `q`, plus collection-specific ones; `sort`; pagination | Editor    |
| POST   | `/api/admin/collections/:collection`               | Create as draft                                                          | Editor    |
| GET    | `/api/admin/collections/:collection/:id`           | Draft, published and usage (`usedIn: [{ pageId, sectionId }]`)           | Editor    |
| PATCH  | `/api/admin/collections/:collection/:id`           | `{ baseRevision, data }`                                                 | Editor    |
| POST   | `/api/admin/collections/:collection/:id/publish`   | `{ revision }`                                                           | Publisher |
| POST   | `/api/admin/collections/:collection/:id/unpublish` | Hides from public, keeps the record                                      | Publisher |
| DELETE | `/api/admin/collections/:collection/:id`           | Archives. Refuses with `409 in_use` while published pages reference it   | Publisher |
| PUT    | `/api/admin/collections/:collection/order`         | `{ ids: [...] }`. Bulk reorder, matching the console's up/down arrows    | Editor    |
| GET    | `/api/public/collections/:collection`              | Published records only, public fields only                               | —         |
| GET    | `/api/public/collections/:collection/:slug`        | One published record                                                     | —         |

`:collection` is an allow-list: `articles`, `courses`, `people`, `testimonials`, `partners`, `jobs`, `events`. Anything else returns 404.

### 10.1 `articles`: blog

| Field                | Type     | Rules                                                                                                                                    |
| -------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `title`              | string   | Required, ≤ 160                                                                                                                          |
| `slug`               | string   | Required, unique, `^[a-z0-9-]+$`. Public URL `/blog/?post={slug}`                                                                        |
| `date` (publishedAt) | date     | Set on first publish; editable                                                                                                           |
| `author`             | string   | Default "Sentinel Africa"                                                                                                                |
| `categories`         | string[] | Free tags. Public filter                                                                                                                 |
| `excerpt`            | string   | ≤ 300. Shown on cards                                                                                                                    |
| `cover`              | image    | Optional                                                                                                                                 |
| `body`               | richtext | The 30 imported articles hold sanitised HTML (`src/content/blog/*.json`). Migrate them as-is and author new ones in structured rich text |

Public: `GET /api/public/collections/articles?q=&category=&limit=` returns the index **without** bodies (the frontend lazy-loads bodies, as now). `GET …/articles/:slug` returns the full article. Old-site links are already rewritten in the imported data; keep that rule when importing more.

### 10.2 `courses`: training catalogue

Matches `courseAreas` in `trainingCourses.ts`. One record per **training area**:

```json
{
  "id": "crs_ism",
  "slug": "ism",
  "short": "ISM",
  "title": "Information Security Management Training (ISM)",
  "image": { "assetId": "…", "alt": "" },
  "groups": [
    {
      "standard": "ISO/IEC 27001 Information Security",
      "courses": [{ "code": "iso27001-li", "name": "ISO/IEC 27001 Lead Implementer" }]
    }
  ]
}
```

Give each course a stable `code`, because `events` reference courses by code. Used by Training and the dashboard count.

### 10.3 `people`: team and board

| Field                 | Type                                       | Applies to | Rules                                    |
| --------------------- | ------------------------------------------ | ---------- | ---------------------------------------- |
| `group`               | enum `team` \| `board`                     | both       | Required                                 |
| `name`, `title`       | string                                     | both       | Required                                 |
| `photo`               | image                                      | both       | Portrait; alt defaults to the name       |
| `role`                | enum `Chair`, `Non-executive`, `Executive` | board      | Exactly one Chair. The Chair sorts first |
| `email`               | email                                      | team       | Public, shown on the profile             |
| `linkedin`, `twitter` | url                                        | team       | Optional                                 |
| `bio`                 | string[] (paragraphs)                      | team       |                                          |

Public filter: `?group=team` or `?group=board`, sorted by `sortOrder`.

### 10.4 `testimonials`

`name` (required), `role` (≤ 120), `quote` (required, ≤ 800), `sourceSubmissionId` (optional link to the feedback submission it came from), `consentRecordedAt` (required before publish). The submitter's **email is never part of this record**. It stays on the private submission.

### 10.5 `partners`: alliances and clients

| Field     | Type                           | Rules                                                                                             |
| --------- | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `kind`    | `alliance` \| `client`         | Required                                                                                          |
| `name`    | string                         | Required. Used as alt text                                                                        |
| `logo`    | image                          | Required. Transparent PNG or SVG; SVG sanitised on upload                                         |
| `sector`  | enum from `site.clientSectors` | Clients only. The current values are Finance, Technology & telecoms, Public sector and Enterprise |
| `compact` | boolean                        | Clients only. Displays wide logos smaller                                                         |
| `url`     | url                            | Optional                                                                                          |

### 10.6 `jobs`: career opportunities

Matches `Role` in `src/components/site/careers.ts`.

| Field                               | Type                                                                        | Rules                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `slug`                              | string                                                                      | Unique. URL `/join-our-team/?role={slug}`                                                                |
| `title`, `type`, `location`, `term` | string                                                                      | `type` such as "Consultancy" or "Full time"                                                              |
| `deadline`                          | date                                                                        | Required. **Open through the end of the deadline day in `Africa/Nairobi`**; the server computes `isOpen` |
| `applyTo`                           | email                                                                       | Private notification address. The current site shows it publicly; decide whether to keep doing so        |
| `summary`                           | string                                                                      | ≤ 300                                                                                                    |
| `sections`                          | list of `{ heading, text[], list[], numbered, groups[{ title, items[] }] }` | Terms of reference                                                                                       |
| `submit`                            | string[]                                                                    | Documents applicants must include                                                                        |

Public: `GET /api/public/collections/jobs?state=open|closed`. Each item includes the computed `isOpen` so the client clock cannot reopen a role.

### 10.7 `events`: Upcoming and training sessions

`title`, `course` (course code, optional), `description`, `startDate`, `endDate`, `time` (`HH:mm`), `timezone` (IANA, required), `venue`, `format` (`physical`, `virtual`, `hybrid`), `capacity` (integer), `registrationUrl` (optional external), `image` + `imageAlt`, `featured` (boolean).

The server derives `startsAt` and `endsAt` (UTC) and `seatsLeft` (from bookings). Public: `GET /api/public/collections/events?from=today&featured=true&course=`.

---

## 11. Site settings, header and footer

A singleton edited in **Header & footer** and **Settings** in the console (`siteEditor` and `settingsEditor` in `editors.ts`).

| Endpoint                                                                             | Purpose                                                             |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `GET /api/public/site`                                                               | Everything every page needs, fetched once and cached for 10 minutes |
| `GET /api/admin/site` / `PUT /api/admin/site/draft` / `POST /api/admin/site/publish` | Same draft/publish model as pages                                   |

```json
{
  "organisation": {
    "name": "Sentinel Africa Consulting Ltd",
    "email": "info@sentinelafricaconsulting.com",
    "phone": "+254202484888",
    "logo": { "url": "…" }
  },
  "topBar": { "links": [{ "label": "Information Security Management", "href": "/#services" }] },
  "menu": [
    { "label": "Home", "href": "/#top" },
    { "label": "About Us", "children": [{ "label": "Who We Are", "href": "/who-we-are/" }] },
    {
      "label": "Tools",
      "children": [
        { "label": "All tools", "href": "/tools/" },
        { "label": "Travel Advisory", "href": "/travel-advisory/", "badge": "New" }
      ]
    },
    { "label": "Upcoming", "href": null }
  ],
  "offices": [
    {
      "name": "Kenya",
      "label": "Head office",
      "address": "Rainbow Tower, 6th Floor, Muthithi Road, Nairobi, Kenya",
      "phones": ["+254 20 2484888", "+254 715 484888"],
      "email": "info@sentinelafricaconsulting.com"
    }
  ],
  "footer": {
    "tagline": "…",
    "invitation": "Let’s build what’s next.",
    "motto": "Perspective. Partnership. Progress."
  },
  "whatsapp": { "number": "+254715484888", "greeting": "…" },
  "social": { "linkedin": "…", "twitter": "…", "youtube": "…" },
  "seoDefaults": { "title": "…", "description": "…", "shareImage": { "url": "…" } },
  "clientSectors": ["Finance", "Technology & telecoms", "Public sector", "Enterprise"],
  "callToAction": {
    "eyebrow": "Let’s move forward",
    "title": "Your next step starts with a",
    "accent": "conversation."
  }
}
```

A menu item with `href: null` renders as "Soon". **The server must reject menu links to pages that do not exist** (the frontend never shows broken menu links). Validate internal `href`s against the page index.

---

## 12. Media

| Method      | Endpoint                                         | Purpose                                                                                                 |
| ----------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| POST        | `/api/admin/media/uploads`                       | `{ filename, mimeType, size }` → `{ uploadId, uploadUrl, fields, expiresAt }` (presigned direct upload) |
| POST        | `/api/admin/media/uploads/:uploadId/complete`    | Verifies the object, scans it, extracts metadata → asset                                                |
| GET         | `/api/admin/media?q=&type=image&folder=&cursor=` | Library grid (`MediaView.tsx`)                                                                          |
| GET / PATCH | `/api/admin/media/:id`                           | Metadata: `alt`, `title`, `folder`, `credit`                                                            |
| DELETE      | `/api/admin/media/:id`                           | Archive. `409 in_use` lists the pages and records using it                                              |

**Limits:**

| Type                                | Limit                                  |
| ----------------------------------- | -------------------------------------- |
| Images (JPEG, PNG, WebP, AVIF, SVG) | 10 MB                                  |
| PDF                                 | 25 MB                                  |
| Video (MP4)                         | 200 MB, with a YouTube embed preferred |

**Processing:** strip EXIF and GPS metadata, generate WebP variants at 320, 640, 1280 and 1920 px, and record width, height and the dominant colour. Sanitise SVGs (remove scripts, event handlers and external references) or rasterise them.

**Asset record:** `{ id, url, mimeType, size, width, height, duration, alt, folder, usages[], createdAt, createdBy }`.

**Rules:**

- Browser `blob:` and `data:` URLs (used by the prototype) must never be stored in published content. The server rejects them in any image field.
- Private files (CVs, proposals, payment receipts) go to a **separate private bucket** and are never served from the public CDN (section 13.5).

**Migration:** import everything under `src/assets/` as the initial library, keeping folder names (`logos/clients`, `people`, `services`, `sdg`, …).

---

## 13. Public submissions and the inbox

### 13.1 Common rules

- **Endpoint:** `POST /api/public/submissions/:kind`, where `kind` is one of `enquiries`, `feedback`, `job-applications`, `talent-applications`, `bookings`.
- **Bot protection:**
  - a hidden honeypot field `website`, which must be empty
  - a minimum time on the form of 3 s, signed into a form token
  - Cloudflare Turnstile or equivalent (`captchaToken`)
- **Rate limits:** 5 per IP per 10 minutes per kind; 3 per email per day.
- **Validation:** server-side for every field, as the frontend rules below already show the user. Trim strings and reject control characters.
- **Response:** `201 { "reference": "ENQ-2026-000123", "receivedAt": "…" }`. The frontend shows the reference.
- **Notifications:** queue an email notification to the configured recipient and a receipt to the sender, where an email was given.
- **Privacy:** store `ip` as a truncated or hashed value, plus `userAgent`, consent text version and timestamp. Retention: enquiries 24 months, unsuccessful applications 12 months (Kenya Data Protection Act 2019; Rwanda Law No. 058/2021; Uganda Data Protection and Privacy Act 2019). Provide export and delete on request.
- **Migration from today:** the callback and careers forms currently build a `mailto:` link. Replace that with the POST and keep the email fallback only for when the API is unreachable.

### 13.2 `enquiries`: homepage callback form (`HomePage.tsx`, `Contact`)

```json
{
  "name": "Amina Otieno",
  "phone": "+254700000000",
  "interest": "Training",
  "source": { "page": "/", "query": "?interest=Training" },
  "captchaToken": "…",
  "website": ""
}
```

| Field                   | Rules                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------- |
| `name`                  | Required, 2–100                                                                         |
| `phone`                 | Required. Normalised to E.164; Kenya, Uganda, Rwanda and international formats accepted |
| `interest`              | Required. Must be one of the callback options (section 8.5)                             |
| `email`, `organisation` | Optional, if added to the form later                                                    |

### 13.3 `feedback`: client testimonial submission (`TestimonialSubmission.tsx`)

```json
{ "name": "…", "role": "…", "email": "…", "quote": "…", "consent": true }
```

`name` and `quote` are required (quote 20–800 characters). `consent` must be `true` to allow publication. Without it the feedback is stored as private. Approval creates a draft `testimonials` record linked to the submission (`POST /api/admin/inbox/feedback/:id/create-testimonial`). The prototype's `localStorage` key `sentinel-testimonial-submissions` goes away.

### 13.4 `job-applications`: Join our Team (`CareersPage.tsx`)

Role application:

```json
{
  "jobId": "job_…",
  "name": "…",
  "email": "…",
  "phone": "…",
  "link": "https://linkedin.com/in/…",
  "message": "…",
  "attachmentIds": ["upl_…", "upl_…"]
}
```

General expression of interest: the same fields without `jobId`, plus `area` (the kind of role).

| Field           | Rules                                                                   |
| --------------- | ----------------------------------------------------------------------- |
| `name`          | Required                                                                |
| `email`         | Required, valid                                                         |
| `phone`         | Required, ≥ 7 digits                                                    |
| `message`       | Required, ≥ 20 characters                                               |
| `link`          | Optional `https` URL                                                    |
| `area`          | Required for general applications                                       |
| `attachmentIds` | At least one (CV or proposal) when the job's `submit` list is non-empty |

**Attachments:**

- **Upload flow:** `POST /api/public/uploads` → presigned URL into the **private** bucket. Allowed types: PDF, DOCX, max 10 MB each, max 5 files, virus-scanned before the application becomes visible. Unclaimed uploads are deleted after 24 hours.
- **Closed roles:** reject applications to a closed job with `409 job_closed`. The server computes this from the deadline.

### 13.5 `talent-applications`: SAC Talent Shield

Fields to confirm with the programme team: applicant name, date of birth, guardian details (required if under 18), university, KUCCPS admission number, year of study, contact details, references, consent. This handles **special-category and children's data**: restrict it to named reviewers, encrypt the sensitive fields at the column level, and keep it separate from recruitment. Stage enum (from `inboxes.ts`): `Received`, `Eligibility review`, `Documents requested`, `Interview`, `Decision recorded`.

### 13.6 Inbox API (admin)

| Method | Endpoint                                                        | Purpose                                                                     |
| ------ | --------------------------------------------------------------- | --------------------------------------------------------------------------- |
| GET    | `/api/admin/inbox/:kind?status=&assignee=&q=&from=&to=&cursor=` | List for `InboxView.tsx`                                                    |
| GET    | `/api/admin/inbox/:kind/:id`                                    | Detail, attachments (signed URLs, 5-minute expiry, access logged), timeline |
| PATCH  | `/api/admin/inbox/:kind/:id`                                    | `{ status, assigneeId }`                                                    |
| POST   | `/api/admin/inbox/:kind/:id/notes`                              | Private staff note                                                          |
| POST   | `/api/admin/inbox/:kind/:id/reply`                              | Optional: email the sender from the console; logged                         |
| GET    | `/api/admin/inbox/:kind/export?format=csv`                      | Administrator only; audited                                                 |
| GET    | `/api/admin/inbox/counts`                                       | Badge counts for the sidebar and dashboard                                  |

Status values per kind. The frontend shows exactly these lists, so keep them in sync:

| Kind                  | Statuses                                                                            |
| --------------------- | ----------------------------------------------------------------------------------- |
| `enquiries`           | New → In progress → Responded                                                       |
| `feedback`            | New → In review → Responded → Closed                                                |
| `job-applications`    | New → Shortlisted → Interview → Closed                                              |
| `talent-applications` | Received → Eligibility review → Documents requested → Interview → Decision recorded |
| `bookings`            | Pending → Confirmed → Paid → Cancelled                                              |

---

## 14. Travel Advisory

The public journey check (`/travel-advisory/`) and the console workspace (`TravelAdvisoriesView.tsx`) implement the rules of the original Python travel portal:

- **Official sources only.**
- **Every published record is reviewed by an editor.**
- **Missing data is shown as "Not verified", never as safe.**
- **Nothing is ever presented as travel clearance or medical advice.**

### 14.1 Data model (from `src/components/travel/travelAdvisory.ts`)

```sql
travel_sources   ( id, name, publisher, url, kind /* who|cdc|national|airline|iata */, last_checked_at, last_status );
travel_notices   ( id, source_id, external_id /* e.g. 2026-DON621 */, title, url, published_at, source_modified_at,
                   countries text[] /* ISO 3166-1 alpha-3 */, raw jsonb, state /* pending|summarised|published|rejected|withdrawn */,
                   detected_at, needs_rereview boolean );
travel_advisories( id, notice_id, country, title, summary, regions, source_name, source_url,
                   published_date, reviewed_at, reviewed_by, prepared_by, status /* draft|published|withdrawn */ );
travel_requirements ( id, country, direction /* entry|exit|transit */,
                   category /* restriction|declaration|screening|transit|airline */, airline, title, detail,
                   source_name, source_url, published_date, effective_from, effective_until,
                   reviewed_at, reviewed_by, prepared_by, status );
travel_events    ( id, at, action, record_type, record_id, actor, details );  -- audit
travel_config    ( countries text[], airlines jsonb /* [{ name, url }] */ );
```

**Validation:** these mirror the console's `check()` rules in `TravelAdvisoriesView.tsx` and the original portal.

- `title` ≥ 8 characters.
- `summary` ≥ 35 characters for advisories; `detail` ≥ 25 characters for requirements.
- The advisory `regions` field is required.
- `source_url` must be `https://`.
- `published_date` is required.
- `effective_from` ≤ `effective_until`.
- Countries and airlines must exist in `travel_config`.

**Four-eyes rule:** `reviewed_by` must differ from `prepared_by` on publish.

**Requirement matching:** this logic is already in the frontend `buildReport()`.

- An `entry` rule applies to the destination country, `exit` to the departure country and `transit` to the transit country.
- Airline-specific rules apply only to that airline.
- A rule applies only within its effective dates on the departure date.

### 14.2 Ingestion jobs (every 6 hours: 00:00, 06:00, 12:00 and 18:00 UTC)

1. **WHO Disease Outbreak News.** Move the current browser call server-side:
   ```
   GET https://www.who.int/api/emergencies/diseaseoutbreaknews
       ?$filter=contains(Title,'Ebola') and PublicationDate ge {now-365d}T00:00:00Z
       &$orderby=PublicationDate desc&$top=50
       &$select=DonId,Title,OverrideTitle,UseOverrideTitle,PublicationDate,LastModified,UrlName,regionscountries
   ```
   - **Countries:** resolve each ID in `regionscountries` through `GET https://www.who.int/api/emergencies/hierarchy-taxa({id})?$select=Title,Name` (ISO code in `Name`, for example `cod`) and cache it for 30 days. Map WHO names to the site's names ("United Republic of Tanzania" → "Tanzania").
   - **Report link:** `https://www.who.int/emergencies/disease-outbreak-news/item/{UrlName}`.
   - **Changed reports:** when `LastModified` is later than a published advisory's `reviewed_at`, set `needs_rereview` and show "Changed since review" in the queue.
   - **Copyright:** store titles, dates, IDs and links only; WHO text is copyrighted. Keep `raw` for internal review.
2. **CDC Travel Health Notices RSS** (`https://wwwnc.cdc.gov/travel/rss/notices.xml`): items mentioning Ebola, Bundibugyo or orthoebolavirus become `pending` notices with links restricted to `https://wwwnc.cdc.gov/`.
3. **Logging:** record every run in `travel_sources.last_checked_at` and `last_status`. The public page shows the last successful check, and **a failed check is shown publicly as such**, never hidden.

### 14.3 Public endpoints

| Method | Endpoint                                                 | Result                                                                                                                                                     |
| ------ | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/api/public/travel/config`                              | Countries, airlines (name + official URL), sources, `lastReviewed`                                                                                         |
| GET    | `/api/public/travel/advisories?country=`                 | Published advisories, newest first (the Advisory library)                                                                                                  |
| GET    | `/api/public/travel/check?from=&to=&via=&date=&airline=` | Same structure as `JourneyReport`: `stops[]` with advisories and checks, `airline`, `verified`, `total`. Never includes nationality or other personal data |
| GET    | `/api/public/travel/who-reports`                         | Cached WHO reports (replaces the browser call); `checkedAt`, `status`                                                                                      |

`/check` must return every check, including those with no records, so the client can show "Not verified". The response carries `disclaimer` text and `coverage: "Only reviewed records are shown. Empty means unknown, not no requirement."`. Cache for 5 minutes.

### 14.4 Admin endpoints

| Method       | Endpoint                                                    | Role                                                                                                  |
| ------------ | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| GET          | `/api/admin/travel/queue?state=pending&source=who`          | Editor                                                                                                |
| POST         | `/api/admin/travel/notices/:id/prepare`                     | Editor. Creates a draft advisory pre-filled from the notice, as the console's **Prepare** button does |
| POST / PATCH | `/api/admin/travel/advisories[/:id]`                        | Editor                                                                                                |
| POST / PATCH | `/api/admin/travel/requirements[/:id]`                      | Editor                                                                                                |
| POST         | `/api/admin/travel/{advisories\|requirements}/:id/publish`  | Travel Reviewer (not the preparer)                                                                    |
| POST         | `/api/admin/travel/{advisories\|requirements}/:id/withdraw` | Travel Reviewer. Requires a reason                                                                    |
| POST         | `/api/admin/travel/notices/:id/reject`                      | Travel Reviewer. Requires a reason                                                                    |
| POST         | `/api/admin/travel/sync`                                    | Administrator. Runs ingestion now; returns the job ID                                                 |
| GET          | `/api/admin/travel/events`                                  | Activity log tab                                                                                      |

---

## 15. Training bookings

Paid public training sessions need a payment provider (for example M-Pesa via Daraja, Flutterwave or Pesapal for KES, UGX and RWF, and card payments). The provider contract is out of scope. This section defines the boundary. The website has no shop; nothing else is sold online.

- **Bookings:** `POST /api/public/submissions/bookings` with `{ eventId, delegates: [{ name, email, phone }], organisation, billingContact, format }`.
  - The server checks `seatsLeft` inside a transaction to avoid overbooking.
  - It returns a booking reference and, for paid public sessions, `{ checkoutUrl }` with server-side prices (never trust client prices).
  - In-house training requests remain enquiries.
- **Payment confirmation:** `POST /api/webhooks/payments/:provider` (signature verified, idempotent by provider event ID) moves the booking to `Paid` and emails joining instructions. Refunds are an Administrator action confirmed by the provider.
- **Admin:** bookings are managed through the inbox (`kind=bookings`).
- Store no card data. PCI scope stays with the provider.

---

## 16. Dashboard and audit

### 16.1 `GET /api/admin/dashboard`

Replaces the "Sample" figures in `DashboardView.tsx`:

```json
{
  "stats": {
    "openEnquiries": { "value": 12, "newThisWeek": 4 },
    "trainingBookings": { "value": 38, "next30Days": true },
    "publishedArticles": 30,
    "certificationCourses": 16,
    "travelAwaitingReview": 15
  },
  "recentEnquiries": [
    {
      "id": "…",
      "name": "…",
      "interest": "Information Security",
      "receivedAt": "…",
      "status": "New"
    }
  ],
  "latestArticles": [{ "slug": "…", "title": "…", "publishedAt": "…", "category": "ISO 27701" }],
  "drafts": [{ "pageId": "home", "sectionId": "hero", "updatedBy": "…", "updatedAt": "…" }]
}
```

The response is scoped to the caller's permissions. For example, an Editor without inbox rights gets `openEnquiries: null`.

### 16.2 Audit log

Append-only table `audit_events (id, at, actor_id, actor_ip_hash, action, target_type, target_id, before jsonb, after jsonb, request_id)`.

Record these events:

- sign-in, sign-in failure, MFA, password reset
- role changes and invitations
- every save, publish, unpublish, restore and archive
- inbox status changes and every view or download of attachments
- exports, travel publish, withdraw and reject, and settings changes

Viewable by Administrators at `GET /api/admin/audit?actor=&action=&target=&from=&to=`. Retain for 3 years.

---

## 17. Non-functional requirements

### 17.1 Security

Sentinel Africa sells ISO 27001 and data-protection services, so this system will be judged against those standards.

| Area         | Requirement                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Transport    | HTTPS only, HSTS (`max-age=63072000; includeSubDomains; preload`), TLS 1.2+                                                                                                                                                                |
| Headers      | CSP without `unsafe-inline` for scripts (allow `www.youtube-nocookie.com` frames and `fonts.googleapis.com`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'` on `/admin/` |
| CORS         | Admin API: same origin only. Public API: the site origin(s) only                                                                                                                                                                           |
| Input        | Schema validation on every write; output encoding; no raw HTML except sanitised legacy article bodies; URL allow-list (`https:`, `mailto:`, `tel:`, site paths)                                                                            |
| Secrets      | In a secret manager; rotated; never in the repository or the frontend bundle                                                                                                                                                               |
| Files        | Type sniffing (not extension), antivirus scan, private bucket for applicant documents, short-lived signed URLs                                                                                                                             |
| Dependencies | Automated vulnerability scanning in CI; patching SLA of 7 days for critical issues                                                                                                                                                         |
| Testing      | OWASP ASVS Level 2 as the target; penetration test before launch                                                                                                                                                                           |
| Access       | Least privilege; MFA for publishing; quarterly access review (an ISO 27001 Annex A control)                                                                                                                                                |

### 17.2 Privacy and compliance

- **Records of processing:** maintain a record for each submission kind, with registration under Kenya's ODPC and Rwanda's NCSA as applicable.
- **Consent:** store the consent text version with each submission. Talent Shield follows the guardian rule for under-18s.
- **Data subject rights:** `POST /api/admin/privacy/requests` handles export and delete of all data for an email address, and is audited.
- **Data location:** decide where personal data is hosted. Cross-border transfer rules apply, so document them.

### 17.3 Performance and availability

| Metric                     | Target                  |
| -------------------------- | ----------------------- |
| Public GET (CDN hit)       | p95 < 100 ms            |
| Public GET (origin)        | p95 < 400 ms            |
| Admin writes               | p95 < 800 ms            |
| Availability, public reads | 99.9%                   |
| Availability, admin        | 99.5%                   |
| Recovery objectives        | RPO 1 hour, RTO 4 hours |

Database backups: point-in-time recovery for 14 days and daily snapshots for 35 days, with a restore test every quarter. Object storage is versioned.

### 17.4 Observability

- **Logging:** structured JSON logs with a `requestId` (returned to the client in errors and the `X-Request-Id` header).
- **Metrics:** latency, error rate, queue depth and ingestion success.
- **Alerts:** 5xx above 1%, two consecutive failed WHO/CDC runs, a backlog in email delivery, and any failed payment webhooks.

---

## 18. Frontend integration plan

The frontend is ready for these swaps. Each row is one integration task.

| Frontend file                                                     | Replace                              | With                                                                                      |
| ----------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------- |
| `src/components/admin/cms/prototypeStore.ts`                      | `localStorage` drafts and releases   | API client: pages and collections draft, publish, revisions                               |
| `src/components/admin/cms/ContentEditor.tsx`                      | Draft key reads and writes           | `GET /admin/pages/:id`; `PATCH …/draft/sections/:sectionId`; handle 401, 403, 409 and 422 |
| `src/components/admin/cms/ContentReview.tsx`                      | Local diff                           | `…/revisions/:n/diff`                                                                     |
| `src/components/admin/cms/HomePreview.tsx`                        | `sessionStorage` snapshot            | `POST …/preview` signed URL                                                               |
| `src/components/admin/cms/MediaView.tsx`                          | `import.meta.glob` of bundled assets | `/api/admin/media` and presigned uploads                                                  |
| `src/components/admin/cms/InboxView.tsx`, `inboxes.ts`            | Empty tables                         | `/api/admin/inbox/:kind`                                                                  |
| `src/components/admin/DashboardView.tsx`                          | Sample figures                       | `/api/admin/dashboard`                                                                    |
| `src/components/admin/TravelAdvisoriesView.tsx`                   | JSON file plus browser WHO call      | `/api/admin/travel/*`                                                                     |
| `src/components/staff/*`                                          | Simulated sign-in                    | Section 6                                                                                 |
| `src/content/homepage.ts`, `homepageDemo.ts`                      | Bundled object                       | `GET /api/public/pages/home`, keeping the bundled object as an offline fallback           |
| `src/content/brands.ts`, `team.ts`, `board.ts`, `offices.ts`      | Bundled data                         | Public collections and `/api/public/site`                                                 |
| `src/components/site/careers.ts`, `trainingCourses.ts`, blog JSON | Bundled data                         | Public collections                                                                        |
| `src/components/travel/whoOutbreakNews.ts`                        | Direct WHO fetch                     | `/api/public/travel/who-reports`                                                          |
| Callback, careers and testimonial forms                           | `mailto:` and `localStorage`         | `POST /api/public/submissions/:kind`                                                      |

**Shared types:** generate TypeScript types from the API's OpenAPI document (for example with `openapi-typescript`) into `src/api/types.ts`. The console field definitions (`editors.ts`) and the server's JSON Schemas must come from one source. Generating the schemas from `editors.ts` at build time is preferred.

**Seeding:** a one-off script imports all current bundled content (homepage, brands, people, offices, courses, 30 blog articles, jobs, travel config) and `src/assets/` into the database, so the first release shows exactly today's site. The extractor `scripts/extract-editor-context.mjs` and `src/content/admin-page-context.json` already capture the inner-page wording for this.

---

## 19. Delivery phases

| Phase                          | Scope                                                                                                   | Exit criteria                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 1. Foundations                 | Infrastructure, CI/CD, auth (session, MFA, reset, invites), staff accounts, audit log, OpenAPI skeleton | Staff can sign in to `/admin/` on staging; the console shows the real user |
| 2. Content core                | Pages, revisions, homepage, site settings, media, public pages API, seeding                             | Homepage fully editable and published from the console; CDN purge works    |
| 3. Collections and inner pages | All collections; About, Services, Resources, Careers pages                                              | No hard-coded content remains on public pages                              |
| 4. Submissions and inbox       | Enquiries, feedback, job and Talent Shield applications, notifications, retention jobs                  | Forms post to the API; inbox works; privacy export and delete              |
| 5. Travel                      | Ingestion jobs, review workflow, public travel endpoints                                                | WHO and CDC queue live; four-eyes publishing; the public page uses the API |
| 6. Bookings                    | Events and sessions, bookings, payment webhooks                                                         | End-to-end paid booking in the provider sandbox                            |
| 7. Hardening                   | Penetration test, load test, disaster-recovery drill, documentation                                     | Section 17 targets met                                                     |

---

## 20. Open decisions

1. **Content delivery:** runtime API reads (recommended) or a rebuild on publish (section 3.2).
2. **Stack and hosting:** language, cloud provider, data residency (Kenya or region), CDN.
3. **Job application addresses:** whether role inboxes such as `marketing@sentinelafrica.co.ke` stay public on the site or applications go only through the form.
4. **Domains:** the site uses both `sentinelafricaconsulting.com` and `sentinelafrica.co.ke` addresses. Confirm the sending domain for email.
5. **Payment provider** for paid training sessions, and supported currencies.
6. **Talent Shield application form:** the final field list and who reviews it.
7. **Blog authoring:** move fully to structured rich text, or keep sanitised HTML for imported articles.
8. **Travel scope:** Ebola only for now, or a general multi-threat model from the start (`threats` table).
9. **Languages:** the previous site had French. The travel tool matters most for the French-speaking DRC. If needed, add `locale` to pages and collections from day one.

---

## Appendix A: endpoint index

### Auth

| Method            | Path                                 |
| ----------------- | ------------------------------------ |
| POST, GET, DELETE | `/api/admin/session`                 |
| POST              | `/api/admin/session/mfa`             |
| POST              | `/api/auth/password/forgot`          |
| POST              | `/api/auth/password/reset`           |
| POST              | `/api/auth/invitations/accept`       |
| GET, PATCH        | `/api/admin/me`                      |
| POST              | `/api/admin/me/password`             |
| POST, DELETE      | `/api/admin/me/mfa`                  |
| GET, POST         | `/api/admin/staff`                   |
| PATCH             | `/api/admin/staff/:id`               |
| POST              | `/api/admin/staff/:id/resend-invite` |
| DELETE            | `/api/admin/staff/:id/sessions`      |

### Content (admin)

| Method             | Path                                                 |
| ------------------ | ---------------------------------------------------- |
| GET                | `/api/admin/pages`                                   |
| GET                | `/api/admin/pages/:pageId`                           |
| PUT, DELETE        | `/api/admin/pages/:pageId/draft`                     |
| PATCH              | `/api/admin/pages/:pageId/draft/sections/:sectionId` |
| POST               | `/api/admin/pages/:pageId/preview`                   |
| POST               | `/api/admin/pages/:pageId/publish`                   |
| GET                | `/api/admin/pages/:pageId/revisions`                 |
| GET                | `/api/admin/pages/:pageId/revisions/:n/diff`         |
| POST               | `/api/admin/pages/:pageId/restore`                   |
| GET, POST          | `/api/admin/collections/:collection`                 |
| GET, PATCH, DELETE | `/api/admin/collections/:collection/:id`             |
| POST               | `/api/admin/collections/:collection/:id/publish`     |
| POST               | `/api/admin/collections/:collection/:id/unpublish`   |
| PUT                | `/api/admin/collections/:collection/order`           |
| GET, PUT           | `/api/admin/site`, `/api/admin/site/draft`           |
| POST               | `/api/admin/site/publish`                            |
| POST               | `/api/admin/media/uploads`                           |
| POST               | `/api/admin/media/uploads/:uploadId/complete`        |
| GET                | `/api/admin/media`                                   |
| GET, PATCH, DELETE | `/api/admin/media/:id`                               |

### Inbox, travel, dashboard (admin)

| Method      | Path                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| GET         | `/api/admin/inbox/counts`                                                    |
| GET         | `/api/admin/inbox/:kind`                                                     |
| GET, PATCH  | `/api/admin/inbox/:kind/:id`                                                 |
| POST        | `/api/admin/inbox/:kind/:id/notes`                                           |
| POST        | `/api/admin/inbox/:kind/:id/reply`                                           |
| GET         | `/api/admin/inbox/:kind/export`                                              |
| POST        | `/api/admin/inbox/feedback/:id/create-testimonial`                           |
| GET         | `/api/admin/travel/queue`                                                    |
| POST        | `/api/admin/travel/notices/:id/prepare`                                      |
| POST        | `/api/admin/travel/notices/:id/reject`                                       |
| POST, PATCH | `/api/admin/travel/advisories[/:id]`, `/api/admin/travel/requirements[/:id]` |
| POST        | `/api/admin/travel/{advisories\|requirements}/:id/publish`                   |
| POST        | `/api/admin/travel/{advisories\|requirements}/:id/withdraw`                  |
| POST        | `/api/admin/travel/sync`                                                     |
| GET         | `/api/admin/travel/events`                                                   |
| GET         | `/api/admin/dashboard`                                                       |
| GET         | `/api/admin/audit`                                                           |
| POST        | `/api/admin/privacy/requests`                                                |

### Public

| Method | Path                                        |
| ------ | ------------------------------------------- |
| GET    | `/api/public/site`                          |
| GET    | `/api/public/pages/:pageId`                 |
| GET    | `/api/public/preview/:token`                |
| GET    | `/api/public/collections/:collection`       |
| GET    | `/api/public/collections/:collection/:slug` |
| POST   | `/api/public/submissions/:kind`             |
| POST   | `/api/public/uploads`                       |
| GET    | `/api/public/travel/config`                 |
| GET    | `/api/public/travel/advisories`             |
| GET    | `/api/public/travel/check`                  |
| GET    | `/api/public/travel/who-reports`            |

### Webhooks

| Method | Path                               |
| ------ | ---------------------------------- |
| POST   | `/api/webhooks/payments/:provider` |

---

## Appendix B: frontend field types to JSON

Field types are defined in `src/components/admin/cms/types.ts`.

| Console type | JSON on write                                                               | JSON on public read                     | Server validation                                                                                 |
| ------------ | --------------------------------------------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `text`       | `string`                                                                    | `string`                                | Trimmed, length limits, no control characters                                                     |
| `textarea`   | `string`                                                                    | `string`                                | As above; newlines allowed                                                                        |
| `richtext`   | `{ "blocks": [ { "type": "paragraph" \| "bullets", "children": [...] } ] }` | Same                                    | Only bold, italic and bullets; no HTML                                                            |
| `paragraphs` | `string[]`                                                                  | `string[]`                              | Each item trimmed and non-empty                                                                   |
| `tags`       | `string[]`                                                                  | `string[]`                              | Unique, ≤ 60 characters each                                                                      |
| `url`        | `string`                                                                    | `string`                                | `https:` or a site path beginning with `/`                                                        |
| `email`      | `string`                                                                    | `string` (omitted if private)           | RFC 5322 basic check, lower-cased                                                                 |
| `date`       | `"YYYY-MM-DD"`                                                              | Same                                    | Valid calendar date                                                                               |
| `select`     | `string`                                                                    | `string`                                | Must be one of the defined options                                                                |
| `toggle`     | `boolean`                                                                   | `boolean`                               |                                                                                                   |
| `image`      | `{ "assetId": "ast_…", "alt": "…" }`                                        | `{ url, width, height, alt, variants }` | Asset exists and is an image; `alt` required unless decorative                                    |
| `video`      | `{ "assetId" }` or `{ "youtubeId" }`                                        | `{ url }` or `{ youtubeId, poster }`    | YouTube ID `^[A-Za-z0-9_-]{11}$`                                                                  |
| `file`       | `{ "assetId": "ast_…" }`                                                    | `{ url, mimeType, size }`               | PDF only unless specified                                                                         |
| `list`       | `Array<{ "id": "itm_…", ...fields }>`                                       | Same                                    | Each item validated against its field schema; **item `id`s stay stable when items are reordered** |

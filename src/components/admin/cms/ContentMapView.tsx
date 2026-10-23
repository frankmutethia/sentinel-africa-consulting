import { contentEditors } from "./editors";

const endpoints = [
  ["GET", "/api/admin/pages", "Page index, section schemas, status, revision and last editor"],
  [
    "GET",
    "/api/admin/pages/:pageId",
    "Saved draft, published revision, media and collection references",
  ],
  [
    "PUT",
    "/api/admin/pages/:pageId/draft",
    "Save validated section content with baseRevision for conflict detection",
  ],
  [
    "POST",
    "/api/admin/pages/:pageId/preview",
    "Create a private, expiring preview of the selected draft",
  ],
  [
    "POST",
    "/api/admin/pages/:pageId/publish",
    "Atomically publish the reviewed draft revision; return publication time",
  ],
  [
    "GET",
    "/api/admin/pages/:pageId/revisions",
    "Revision history with author and publication status",
  ],
  [
    "POST",
    "/api/admin/pages/:pageId/restore",
    "Copy an earlier revision into a new draft; do not silently publish",
  ],
  [
    "GET / POST",
    "/api/admin/collections/:collection",
    "List or create articles, people, partners, courses, events, jobs and testimonials",
  ],
  [
    "PATCH / DELETE",
    "/api/admin/collections/:collection/:id",
    "Update or archive a record, preserving references and publication state",
  ],
  [
    "GET / POST",
    "/api/admin/media",
    "Search media or upload a file; return durable asset ID, URL, type and dimensions",
  ],
  [
    "GET / PATCH",
    "/api/admin/inbox/:kind/:id",
    "Read a submission or update assignment, stage and private notes",
  ],
  [
    "POST",
    "/api/public/submissions/:kind",
    "Create enquiries, feedback, applications or booking requests; validate and rate-limit",
  ],
  [
    "GET",
    "/api/public/pages/:slug",
    "Published content only; never return drafts, notes or applicant data",
  ],
  ["POST / DELETE", "/api/admin/session", "Create or end an authenticated staff session"],
  [
    "GET / POST / PATCH",
    "/api/admin/staff",
    "Staff accounts, invitations and roles; administrator access only",
  ],
];

export function ContentMapView() {
  return (
    <>
      <div className="admin-page-head">
        <div>
          <p className="admin-overline">Implementation handoff</p>
          <h1>Pages & API map</h1>
          <p className="admin-lede">
            Every editor, its public destination and the API contract the frontend will need. These
            endpoints are proposed; no backend is running.
          </p>
        </div>
      </div>
      <section className="admin-card cms-release-list">
        <h2>Website content coverage</h2>
        <p>
          Choose a page to open its editor directly. Reusable records are edited once in their
          content library.
        </p>
        <div className="cms-page-directory">
          {contentEditors.flatMap((editor) =>
            editor.pages.map((page) => (
              <a key={`${editor.id}/${page.id}`} href={`#${editor.id}/${page.id}`}>
                <span className="admin-overline">{editor.title}</span>
                <strong>{page.label}</strong>
                <span>{page.blocks.length} editable sections</span>
                <small>{page.planned ? "Public page planned" : page.url}</small>
              </a>
            )),
          )}
        </div>
      </section>
      <section className="admin-card cms-release-list">
        <h2>Proposed API endpoints</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Responsibility</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map(([method, path, purpose]) => (
                <tr key={path}>
                  <td>{method}</td>
                  <td>
                    <code>{path}</code>
                  </td>
                  <td>{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="admin-card cms-release-list">
        <h2>Workflow & data rules</h2>
        <p>
          Draft → review → publish. Editing a published page creates a new draft while the published
          revision remains visible to visitors. Publishing requires publisher permissions and a
          matching base revision.
        </p>
        <p>
          Page records carry a stable ID, slug, section IDs, schema version, draft revision,
          published revision, timestamps and editor identity. Media uses asset IDs; reusable
          collections use record IDs rather than duplicated text.
        </p>
        <p>
          Errors must distinguish validation (422), missing authentication (401), insufficient
          permissions (403), edit conflicts (409), oversized files (413) and service failures.
          Display the error without losing the draft.
        </p>
      </section>
    </>
  );
}

# Prompt: Fix FOROZ New Admin Dashboard to Match Old Dashboard's Functional Parity

## Context

You are working on the FOROZ Admin Dashboard, a React + TypeScript + Vite + Tailwind CSS application. There are two versions of this codebase:

- **Old Dashboard** (previous version): fully functional, all CRUD modals work, tables render correctly, no layout bugs. Uses a top-navbar layout.
- **New Dashboard** (current version): restructured with a left sidebar layout, merged public site + admin panel, Radix UI primitives, and a proper `AuthContext` with token refresh. This is meant to be an **upgrade**, but it currently has multiple regressions, broken/stubbed features, and rendering bugs compared to the Old Dashboard.

**Your job:** Bring the New Dashboard to full functional and visual parity with the Old Dashboard for every feature listed below, while preserving the New Dashboard's improved architecture (sidebar layout, AuthContext, service layer pattern). Do not regress any feature that currently works in the New Dashboard.

Treat the Old Dashboard's implementation as the reference/source of truth for expected behavior, layout structure, and UX — even though the New Dashboard uses different components/styling conventions (Tailwind + Radix instead of custom-only components).

---

## Issues to Fix (in priority order)

### PRIORITY 1 — Modal rendering / backdrop bug (systemic, affects multiple screens)

**Problem:** Every data-entry modal in the New Dashboard (Add Board Member, Add Partner/Collaboration, Compose Email) renders with the underlying page content bleeding through behind or around the modal box — table column headers, action icons, and page text overlap with the modal's own title/labels instead of being hidden behind a solid, opaque backdrop.

**Specific symptoms observed:**
- "Add New Board Member" modal: table headers ("Role," "Status," "Joined," "Actions") show through behind/around the modal box.
- "Add New Partner" modal: "Description / Website / Status / Actions" table headers bleed through.
- "Compose New Email" modal: the modal's own header text duplicates/overlaps ("Compose New Email" overlapping "Write and send a new email message"), and "Subject"/"Message" field labels render on top of each other.

**Fix requirements:**
1. Audit the shared modal/dialog component (likely `components/ui/Modal.tsx`, `Dialog.tsx`, or the Radix `Dialog` wrapper) for:
   - A missing or transparent backdrop/overlay (`bg-black/50` or similar solid dimming layer with `z-index` above page content but below the modal panel).
   - Correct `z-index` stacking: backdrop → modal panel → modal content, in that order, with no intermediate leaks.
   - Modal panel must have a solid background color (e.g., `bg-white`) — not transparent or semi-transparent.
2. Check for **duplicate mounting** — the Compose Email overlap (doubled header/labels) suggests the modal markup may be rendering twice (e.g., a parent component rendering both a "trigger" version and an "open" version simultaneously, or a leftover static markup block alongside the dynamic Radix `Dialog.Content`). Find and remove the duplicate render path.
3. Test the fix across all three affected modals (Board Member, Partner, Compose Email) plus any other modal in the app (Add Event, Add Announcement, once built — see Priority 2) to confirm no bleed-through or duplication in any of them.
4. Reference the Old Dashboard's modal behavior: clean solid backdrop, single centered panel, no background content visible or interactive while modal is open (should also trap focus / block scroll on the body).

---

### PRIORITY 2 — Non-functional "Create" stubs for Events and Announcements

**Problem:** Clicking `+ Create Event` or `+ Create Announcement` opens a placeholder modal with only a message like *"Event form coming soon. Backend endpoint: /events/create_event/"* and a Cancel button — no actual form. This is despite `eventsService.ts` and `announcementsService.ts` already exposing working `create`, `update`, and `delete` methods.

**Fix requirements — build the real forms, matching the Old Dashboard's field set exactly:**

**Add Event modal fields (match Old Dashboard):**
- Event Title (text input, required)
- Short Description (textarea — "Brief description for cards")
- Full Description (textarea — "Complete event details")
- Event Image (drag-and-drop or click-to-browse upload zone, JPEG/PNG/WebP)
- Publish Date (date picker)
- Termination Date (date picker)
- Cancel / Create buttons

**Add Announcement modal fields (match Old Dashboard):**
- Title (text input, required)
- Description (textarea)
- Publish Date (date picker)
- Expiration Date (date picker)
- Posted By (optional text input)
- Link (optional URL input)
- Image (drag-and-drop or click-to-browse upload zone, JPEG/PNG/WebP up to 5MB)
- Cancel / Create Announcement buttons

**Wiring:**
- Connect the form submit handler to the existing `create` method in the respective service module.
- On success: close modal, show a success toast, and refresh the list.
- On failure: show an error toast, keep the modal open with entered data preserved.
- Apply the same modal backdrop fix from Priority 1 to these new modals.

---

### PRIORITY 3 — Missing table/list structure for Announcements page

**Problem:** The New Dashboard's Announcements page only shows a centered empty-state icon + "No announcements yet" + a Create button. It has no table, no filters, and no search — even as an empty shell — so once data exists there's no layout to display it in.

**Fix requirements — rebuild to match Old Dashboard structure:**
- Status filter tabs: **All / Active / Expired**
- Search bar: "Search announcements..." (filters by title)
- Data table with columns: **Title** (with thumbnail image + truncated description), **Posted By**, **Date**, **Expires**, **Status** (colored badge: green = Active), and **Actions** (view/open external link icon, edit/pencil icon, delete/trash icon)
- Pagination footer: "Showing X–Y of Z" with Previous/Next controls
- Keep the current empty-state (icon + "No announcements yet" + Create button) as the **table's empty state**, not as a replacement for the table shell.

---

### PRIORITY 4 — Missing table/list structure for Events page

**Problem:** Same issue as Announcements — Events page is only an empty-state icon with no persistent list/table structure once events exist.

**Fix requirements:**
- Add a table or card-list structure to display events once created (title, dates, short description, image thumbnail, edit/delete actions), following the same visual pattern as the Announcements table for consistency.
- Keep "No events yet / Get started by creating your first event" as the empty state within that structure, matching the Old Dashboard's "+ Add Your First Event" secondary CTA in the empty state.

---

### PRIORITY 5 — Messages page layout regression

**Problem:** Old Dashboard's Messages page has a proper two-pane layout: a left panel listing conversations (with its own loading/error/retry state) and a right panel showing the active thread or a "Select a conversation to start messaging" placeholder. New Dashboard's Messages page has been flattened into a single empty-state panel ("No messages yet / Contact form submissions will appear here") with no conversation list panel at all.

**Fix requirements:**
- Rebuild the two-pane layout: left = conversation list (with loading spinner, error+retry state, and populated list state), right = active thread view or empty placeholder.
- Preserve the New Dashboard's improved error handling patterns (loading/error states) but apply them to both panes, matching the Old Dashboard's UX (e.g., "Failed to fetch conversations" + Retry button pattern in the left panel).

---

### PRIORITY 6 — Email page missing Inbox/Sent toggle

**Problem:** Old Dashboard's Email page has explicit **Inbox** (with unread-count badge) and **Sent** tabs for switching views. New Dashboard's Email page only shows "Inbox (0 unread)" with no way to view sent messages.

**Fix requirements:**
- Add Inbox/Sent tab toggle to the Email page sidebar/header, matching the Old Dashboard's layout (Inbox tab with unread badge, Sent tab below it).
- Wire the Sent tab to the `emailService.ts` method(s) for retrieving sent messages (add one if it doesn't exist yet).

---

### PRIORITY 7 — Missing navigation link to Users management

**Problem:** The route `/admin/users`, the page `UsersPage.tsx`, and the full `usersService.ts` (getAll/getById/create/update/delete) all already exist per the codebase, but there is **no link to it in the sidebar navigation**. It's currently unreachable through the UI.

**Fix requirements:**
- Add a "Users" nav item to the sidebar (`AdminLayout.tsx`), positioned consistent with the Old Dashboard's top-nav ordering (after Board Members, alongside the other core admin sections — not under "Communications").
- Confirm the Users page itself matches Old Dashboard functionality: Role filter (All/Admin/Moderator/Volunteer), Status filter (All/Active/Suspended/Pending Review), search bar, table with User/Email/Role/Status/Joined/Actions columns, and "+ Add User" button.

---

### PRIORITY 8 — API layer consolidation (structural, not visual)

**Problem:** The codebase currently has two parallel API layers: the newer `lib/api/client.ts` + `lib/services/*` pattern, and a legacy `services/api.ts` helper layer still used by the public content provider (`ForozDataContext`). Endpoint naming and payload shapes are inconsistent between root-based and nested conventions.

**Fix requirements:**
- Migrate all remaining usages of the legacy `services/api.ts` layer over to the `lib/api/client.ts` + `lib/services/*` pattern.
- Once migration is complete, remove the legacy `services/api.ts` file entirely (do not leave a dead/unused parallel layer).
- Standardize all service modules to use one consistent endpoint-path convention (confirm with backend team whether root-based or nested paths are canonical — do not guess).
- Ensure response normalization (handling `{ results, count }`, plain arrays, and `{ items }` list-shapes) is handled in exactly one place (the shared client), not duplicated per-service.

---

## Acceptance Criteria (definition of done)

For each item above, before marking it complete, verify:

1. **No visual regressions**: nothing that currently works correctly in the New Dashboard breaks as a result of these fixes.
2. **Modal parity**: every modal opens with a solid backdrop, no bleed-through, no duplicated text, and closes cleanly (Cancel, X button, and clicking outside all work).
3. **Form parity**: Create Event and Create Announcement forms have the exact field sets specified above, connected to real `create` service calls, with success/error toast feedback and list refresh.
4. **Layout parity**: Announcements and Events pages have table/list scaffolding present at all times (not just when data exists); Messages page has its two-pane layout back; Email page has Inbox/Sent tabs.
5. **Navigation completeness**: every implemented admin page (including Users) is reachable from the sidebar.
6. **Single API layer**: no remaining imports of the legacy `services/api.ts` file anywhere in the codebase; `grep -r "services/api"` returns no results outside the file's own deletion commit.
7. **No new automated-test regressions** if a test suite exists; if none exists, at minimum manually verify each fixed flow end-to-end (open modal → fill form → submit → see success toast → see item appear in list).

---

## Notes for the Implementing AI

- Do not rewrite the sidebar layout, AuthContext, or the `lib/api/client.ts` architecture — these are correct improvements over the Old Dashboard and should be preserved.
- Where the Old Dashboard's visual style (top-navbar-era Tailwind classes) differs from the New Dashboard's design system (Radix + `cn()` + `tailwind-merge`), adapt the Old Dashboard's *structure and field sets* into the New Dashboard's *existing styling conventions* — don't copy-paste raw old markup verbatim.
- If any of the described Old Dashboard behavior is ambiguous or you need to inspect the actual Old Dashboard source to confirm exact field names/order, flag that explicitly rather than guessing.
- After implementing, provide a short summary of every file changed and which numbered issue above it resolves, so changes can be reviewed against this list item-by-item.

# FOROZ Platform — Master Build Prompt

Paste this whole document to your coding AI as the task brief. It merges two prior drafts and resolves every place they disagreed. Section 0 documents those resolutions so nothing gets silently lost — read it once, then hand the rest to the AI as-is.

---

## 0. How This Merges the Two Prior Drafts

Both drafts agreed on the hard technical stuff (auth token strategy, CSRF, single API client, base URL from env). Four things disagreed — here's the call on each and why:

1. **Sidebar scope.** Draft A kept the top navbar on public pages and only used a sidebar for `/admin`. Draft B replaces the top navbar everywhere with one sidebar that shows public links always and admin links only when authenticated. **Going with Draft B** — it's more explicit and it's genuinely a cleaner information architecture for a small org site where staff and public traffic share the same shell.
2. **Public page structure.** Draft A described one scrolling Home page with anchor sections. Draft B splits each section into its own route (`/about`, `/services`, `/events`, etc.) with Home as a landing page linking out. **Going with Draft B** — dedicated routes are needed for the sidebar links to mean anything, and it gives each section room to grow past what fits in a homepage scroll. Home keeps short teaser versions of each section with a "see more" into the full page.
3. **Applications endpoint.** Draft A standardized on `/applicants/` (the path the currently-working `ApplicationTable.tsx` actually calls). Draft B standardizes on `/applications` (matching the page route and service filename). **Going with `/applications` for naming consistency** — but this is the one item in this whole spec that's a guess, not a fact: the original report explicitly says both paths exist on the backend as redundant/legacy. Do not treat this as settled. Step 1 of the build must confirm which path actually returns data against the live Django backend, and the endpoint must live in exactly one constant so switching it later is a one-line change, not a re-grep of the codebase.
4. **Color palette.** Draft B says keep the existing indigo/purple gradient as the brand color for shadcn/ui theming. The original ask was "modern design, you find best option" — so this spec keeps the distinctive palette proposed earlier (teal/gold/ink, see §5) instead of defaulting back to indigo/purple, since indigo-to-purple gradients are the single most common look for AI-generated admin dashboards and won't read as distinctive. **This is the one place worth a quick gut-check before building** — if you'd rather keep the existing brand indigo/purple for continuity with existing FOROZ materials, that's a legitimate call too, and because everything is defined as CSS variables (§5), swapping the palette back is a five-minute edit, not a rebuild.

Everything else below is the reconciled, single spec — build from this, not from either prior draft.

---

## 1. Current State & Mission

You're working inside the existing **FOROZ Nonprofit Homepage** project (React + TypeScript + Vite, the "blog" folder). It already has working public components (Hero, About, Services, Events, Announcements, Collaborations, Board Members, Contact, Footer, Navbar) driven by `ForozDataContext`.

**Modify this project — do not scaffold a new one.** Your job is to: rebuild the app shell around a single sidebar, add the full admin panel (auth, dashboard, CRUD pages, messaging) that currently doesn't exist, and apply one consistent design system with dark/light mode across both public and admin surfaces.

---

## 2. Dependencies to Add

- `react-router-dom` — routing
- `@radix-ui/react-slot`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-tabs`, `class-variance-authority`, `clsx`, `tailwind-merge` — shadcn/ui primitives
- Keep existing `lucide-react`, `framer-motion`

Install and configure shadcn/ui as the component layer (Button, Card, Table, Dialog, Dropdown, Badge, Tabs, Sheet, Toast). Sheet specifically powers the mobile off-canvas sidebar drawer.

---

## 3. Folder Structure

```
src/
├── main.tsx
├── App.tsx                       # ThemeProvider > AuthProvider > AppLayout > routes
├── index.css                     # Tailwind + CSS variable theme tokens (§5)
│
├── components/
│   ├── ui/                       # shadcn/ui primitives + ThemeToggle.tsx
│   ├── layout/                   # Sidebar.tsx, Topbar.tsx, AppLayout.tsx
│   ├── public/                   # existing Hero/About/Services/... components, moved here
│   └── admin/                    # StatCard, DataTable, ApplicationTable, modals, FileImageUpload
│
├── pages/
│   ├── public/                   # Home, About, Services, Events, Announcements,
│   │                              #   Collaborations, Team, Contact
│   └── admin/
│       ├── DashboardPage.tsx  UsersPage.tsx  ApplicationsPage.tsx
│       ├── BoardMembersPage.tsx  CollaborationsPage.tsx  AnnouncementsPage.tsx  EventsPage.tsx
│       ├── MessagesPage.tsx  EmailPage.tsx  NotificationsPage.tsx  ProfilePage.tsx
│
├── contexts/                     # AuthContext, ThemeContext, AppContext (ForozDataContext logic folded in)
├── lib/
│   ├── api/client.ts             # single fetch wrapper, §6
│   └── services/                 # authService, usersService, applicationsService, ... (§6.2)
├── hooks/                        # useAuth, useToast, useNotifications
├── routes/AppRoutes.tsx          # ProtectedRoute, PublicOnlyRoute, RoleGate + route table (§4)
├── types/                        # User, Profile, Application, Announcement, Event,
│                                  #   Collaboration, BoardMember, Message, Email, Notification
└── utils/                        # date formatting, CSV export
```

---

## 4. Routes

**Public (sidebar always shows these):**
`/` Home · `/about` · `/services` · `/events` · `/announcements` · `/collaborations` · `/team` · `/contact`

**Auth:**
`/login` (PublicOnlyRoute — redirects to `/admin/dashboard` if already signed in) · `/forgot-password` · `/reset-password/:token` · `/forbidden`

**Admin (sidebar shows these only when authenticated; wrapped in ProtectedRoute):**
`/admin/dashboard` · `/admin/users` (RoleGate: admin only) · `/admin/applications` · `/admin/board-members` · `/admin/collaborations` · `/admin/announcements` · `/admin/events` · `/admin/messages` · `/admin/email` · `/admin/notifications` · `/admin/profile`

Volunteers get read access to most `/admin/*` list views but not create/edit/delete — gate the action buttons per-role inside each page rather than blocking the whole route, so volunteers can still see applications/events/etc. without being able to mutate them.

---

## 5. Design Tokens

CSS variables in `:root` and `[data-theme="dark"]`, consumed everywhere — no hardcoded hex in components.

| Name | Light | Dark | Use |
|---|---|---|---|
| `--paper` | `#F6F7F5` | `#12161F` | page background |
| `--ink` | `#14213D` | `#E7E9EE` | primary text |
| `--growth` | `#1F6F5C` | `#3E9C86` | primary brand — buttons, links, active nav state |
| `--harvest` | `#E3A857` | `#E8B96C` | accent — badges, the signature rail below |
| `--signal` | `#C1443C` | `#D9635A` | destructive actions, errors |
| `--mist` | `#8B93A7` | `#5B6377` | borders, muted text |
| `--surface` | `#FFFFFF` | `#1A1F2B` | cards, modals, sidebar |

Map these into the shadcn/ui theme config (`--primary`, `--destructive`, etc. in `tailwind.config.js`) rather than maintaining two parallel color systems.

**Type:** Instrument Sans or General Sans for display/headers (bold, used sparingly), Inter for body/UI, Vazirmatn for any Dari/Persian content blocks (wrap in a reusable `<RtlBlock dir="rtl">`), IBM Plex Mono with tabular-nums for stat cards and table figures.

**Signature element:** a 3px vertical gradient rail (`--growth` → `--harvest`) on the active sidebar item, reused as the section-divider accent on public pages — the one recurring motif tying public and admin together. Keep everything else flat and restrained around it.

---

## 6. Auth & API Layer

### 6.1 HTTP Client (`lib/api/client.ts`)
- Access token held **in memory only** (module-level variable) — never in localStorage.
- Refresh token in `localStorage` under `rtoken`.
- On `401`, automatically POST to the refresh endpoint, update the in-memory access token, retry the original request once. If refresh also fails, clear tokens and redirect to `/login`.
- For `POST`/`PUT`/`PATCH`/`DELETE`, read the `csrftoken` cookie and set `X-CSRFToken`; if absent, prefetch it via a dedicated `ensureCsrfCookie()` call (use a real `/csrf/` endpoint if the backend has one, otherwise GET the login route once).
- Base URL from `VITE_API_BASE_URL` only — never hardcode `localhost:8000` anywhere else. Add `.env.example`.

### 6.2 Services (`lib/services/`)
`authService` (login, signup, logout, me, refreshToken, updateMe, requestPasswordReset, resetPassword) · `usersService` · `applicationsService` (see §0.3 on the endpoint decision) · `announcementsService` · `eventsService` · `collaborationsService` · `boardMembersService` · `messagesService` · `emailService` · `notificationsService` · `dashboardService`.

Every endpoint path referenced by these services must be defined once, in one constants object, not inlined per-call — this is what makes the §0.3 verification step a safe one-line fix instead of a search-and-replace across the codebase.

### 6.3 Route Guards
`ProtectedRoute` (redirect to `/login`, preserve intended path for post-login redirect) · `PublicOnlyRoute` (redirect authenticated users away from `/login`) · `RoleGate` (role allow-list, redirect to `/forbidden`, with the read-vs-write nuance from §4 for volunteers).

---

## 7. Sidebar & Theme

**Sidebar:** persistent on desktop, collapsible to an icon-only rail (state persisted in `localStorage`); off-canvas Sheet drawer on mobile via hamburger in the Topbar. Grouped sections: public nav links always visible; an "Admin" group (Dashboard, Applications, Users, Board Members, Announcements, Events, Collaborations, Messages, Email, Notifications) appears only when authenticated. User avatar, full name, and role pinned at the sidebar's bottom, with Logout there too.

**Topbar** (inside the main content area, not a separate top navbar): search, notification bell (dropdown showing the 5 most recent, linking to the full `/admin/notifications` page), theme toggle, avatar menu.

**Theme:** `ThemeContext` toggles `data-theme` on `<html>`, persisted under `foroz-theme` in `localStorage`, defaults to `prefers-color-scheme` on first visit. `ThemeToggle.tsx` is one shared component used in the Topbar.

---

## 8. Corrected Endpoint Map

Relative to `VITE_API_BASE_URL`. Confirm the exact prefix against the live backend before building — verify `/applications` vs `/applicants` at the same time (§0.3).

| Area | Function | Method | Path |
|---|---|---|---|
| Auth | login | POST | `/user/auth/login/` |
| Auth | signup | POST | `/user/auth/register/` |
| Auth | logout | POST | `/user/auth/logout/` |
| Auth | me | GET | `/user/auth/user/` |
| Auth | updateMe | PATCH | `/user/auth/user/` |
| Auth | requestPasswordReset | POST | `/user/auth/password/reset/` |
| Auth | resetPassword | POST | `/user/auth/password/reset/confirm/` |
| Dashboard | getDashboardStats | GET | `/dashboard/` |
| Dashboard | getRecentApplications | GET | `/applications/recent?limit={n}` |
| Users | getUsers / createUser / updateUser / deleteUser | GET/POST/POST/DELETE | `/user/users/`, `/user/create_user/`, `/user/update_user/:id/`, `/user/delete_user/:id/` |
| Applications | getApplications / updateStatus / sendEmail | GET/POST/POST | `/applications` *(verify — see §0.3)*, `/applications/:id/status`, `/applications/:id/email` |
| Announcements | CRUD | GET/POST/POST/DELETE | `/announcements/`, `/announcements/create_announcement/`, `/announcements/:id/update_announcement/`, `/announcements/:id/delete_announcement/` |
| Collaborations | CRUD | GET/POST/POST/DELETE | `/collaborations/`, `.../create_collaboration/`, `.../:id/update_collaboration/`, `.../:id/delete_collaboration/` |
| Board Members | CRUD | GET/POST/POST/DELETE | `/board-members/`, `.../create_member/`, `.../:id/update_member/`, `.../:id/delete_member/` |
| Events | CRUD | GET/POST/POST/DELETE | `/events`, `/events/create_event/`, `/events/:id/update_event/`, `/events/:id/delete_event/` |
| Messages | getConversations / getMessages / sendMessage | GET/GET/POST | `/conversations/`, `/conversations/:id/messages/`, `/messages/send/` |
| Email | getEmails / sendEmail / markRead | GET/POST/POST | `/emails/`, `/emails/send/`, `/emails/:id/read/` |
| Notifications | get / markAsRead / markAllRead | GET/POST/POST | `/notifications/`, `/notifications/:id/read/`, `/notifications/mark-all-read/` |

Normalize snake_case ↔ camelCase at the service layer, same pattern `ForozDataContext`'s existing `mapEvents`/`mapAnnouncements` use — don't scatter field-name guessing through components.

---

## 9. Types

`src/types/` — `User`, `Profile`, `Application`, `Announcement`, `Event`, `Collaboration`, `BoardMember`, `Message`, `Email`, `Notification`, matching the attributes in the original Admin Dashboard report exactly.

---

## 10. Build Order

1. **Verify against the live backend first**: confirm `VITE_API_BASE_URL` prefix and the `/applications` vs `/applicants` question (§0.3). Put both in one constants file so nothing else depends on getting this right on the first try.
2. Install deps, configure shadcn/ui and Tailwind theme mapping to the CSS variables in §5.
3. Build `ThemeContext` + `ThemeToggle` + CSS variables — every component built after this consumes variables, nothing hardcodes color.
4. Build `client.ts`, `AuthContext`, route guards, `Login` page.
5. Build `AppLayout` (`Sidebar` + `Topbar`), replacing the existing top `Navbar`.
6. Split the existing single-page Home content into `/about`, `/services`, `/events`, `/announcements`, `/collaborations`, `/team`, `/contact`, with Home left as a short teaser + links. Fix the `AnnoucementSection.tsx` → `AnnouncementSection.tsx` typo along the way. Re-enable `ImpactSection` (currently commented out).
7. Build each admin page one at a time — Dashboard first, then Users, Applications, Announcements, Events, Collaborations, Board Members, Messages, Email, Notifications, Profile — wiring each to its service from §6.2 against the endpoint map in §8.
8. Wire the full route table (§4) into `AppRoutes.tsx`.
9. QA pass (§11).

---

## 11. Acceptance Criteria

- [ ] Single `npm run dev` boots the whole app; every route in §4 renders.
- [ ] Only one `fetch` wrapper exists in the codebase; no component calls `fetch` directly.
- [ ] Access token never appears in `localStorage`; only `rtoken` does.
- [ ] Expired access token triggers silent refresh, not a forced logout, unless the refresh token is also invalid.
- [ ] Applications endpoint is defined in exactly one place and confirmed working against the live backend (§0.3).
- [ ] Theme toggle persists across reload, defaults to system preference on first visit.
- [ ] Sidebar: collapsible rail on desktop, Sheet drawer on mobile, active-item gradient rail visible in both themes, avatar/name/role pinned at the bottom.
- [ ] Volunteers can view but not mutate admin list pages they don't have write access to.
- [ ] Every admin page loads real data — no leftover mock arrays.
- [ ] RoleGate-restricted routes correctly redirect unauthorized roles to `/forbidden`.
- [ ] Keyboard focus visible and color contrast passes in both themes.

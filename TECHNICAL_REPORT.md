# Technical Report: Portfolio Management System

Generated on: 2026-05-13

## 1. Executive Summary

This project is a React-based portfolio management system built with Vite, TypeScript, Tailwind CSS, React Router, Axios, Framer Motion, Lucide icons, React Icons, and Sonner notifications. It contains a public portfolio website and a protected-style admin CMS used to manage portfolio content, projects, categories, skills, social links, and admin password changes.

The frontend expects a backend REST API at:

```text
http://127.0.0.1:8000/api
```

The application is client-side rendered, uses local browser storage for authentication and theme persistence, and ships a built production bundle in `dist/`.

## 2. Project Identity

- Project title in HTML shell: `Portfolio Management System`
- Package name: `magic-patterns-vite-template`
- Package version: `0.0.1`
- Project type: private single-page application
- Frontend framework: React 18
- Build tool: Vite 5
- Language: TypeScript
- Styling: Tailwind CSS
- Backend dependency: External REST API, likely a local backend service

## 3. Repository Structure

```text
.
|-- index.html
|-- package.json
|-- package-lock.json
|-- vite.config.ts
|-- tsconfig.json
|-- tsconfig.node.json
|-- tailwind.config.js
|-- postcss.config.js
|-- .eslintrc.cjs
|-- README.md
|-- dist/
|   |-- index.html
|   `-- assets/
`-- src/
    |-- App.tsx
    |-- index.tsx
    |-- index.css
    |-- types/
    |-- services/
    |-- context/
    |-- pages/
    |   |-- Portfolio.tsx
    |   `-- admin/
    |-- components/
        |-- public/
        |-- admin/
        `-- shared/
```

## 4. Technology Stack

### Runtime Dependencies

| Dependency | Purpose |
|---|---|
| `react`, `react-dom` | Core UI rendering |
| `react-router-dom` | Client-side routing |
| `axios` | HTTP requests to backend API |
| `framer-motion` | Page and component animations |
| `lucide-react` | Main icon system |
| `react-icons` | Additional social platform icons |
| `sonner` | Toast notifications |
| `@emotion/react` | Installed styling support, not visibly used in current source |

### Development Dependencies

| Dependency | Purpose |
|---|---|
| `vite` | Development server and production bundling |
| `typescript` | Type checking and typed source files |
| `@vitejs/plugin-react` | React integration for Vite |
| `tailwindcss`, `postcss`, `autoprefixer` | Utility-first styling pipeline |
| `eslint` | Static linting |
| `@typescript-eslint/*` | TypeScript linting support |
| `eslint-plugin-react-hooks` | React hooks linting |
| `eslint-plugin-react-refresh` | Fast refresh export rules |

## 5. Build and Runtime Scripts

Defined in `package.json`:

```json
{
  "dev": "npx vite",
  "build": "npx vite build",
  "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
  "preview": "npx vite preview"
}
```

Typical workflow:

```text
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

Current workspace note: `node_modules` was not present during this report generation, so build and lint commands were not rerun locally.

## 6. Application Entry Point

### `src/index.tsx`

The application imports global CSS, creates a React root from the `#root` element in `index.html`, and renders the top-level `App` component.

### `src/App.tsx`

`App` composes the global providers and route tree:

```text
ThemeProvider
  AuthProvider
    DataProvider
      BrowserRouter
        Toaster
        Routes
```

The app uses React Router v6 and enables future flags:

```text
v7_startTransition
v7_relativeSplatPath
```

## 7. Routing Architecture

| Route | Component | Purpose | Protection |
|---|---|---|---|
| `/` | `Portfolio` | Public portfolio site | Public |
| `/admin/login` | `Login` | Admin sign-in page | Public |
| `/admin/change-password` | `ChangePassword` | Password update page | Public route in current config |
| `/admin/*` | `AdminLayout` with nested routes | Admin CMS shell | Wrapped by `ProtectedRoute` |
| `/admin` | `Dashboard` | Admin overview | Protected through `/admin/*` |
| `/admin/projects` | `ProjectsManager` | Project CRUD | Protected through `/admin/*` |
| `/admin/categories` | `CategoriesManager` | Category CRUD | Protected through `/admin/*` |
| `/admin/skills` | `SkillsManager` | Skill CRUD | Protected through `/admin/*` |
| `/admin/content` | `ContentManager` | Site content editing | Protected through `/admin/*` |
| `*` | Redirect to `/` | Fallback route | Public |

### Important Routing Observation

`/admin/change-password` is currently declared as a top-level public route, not inside the protected `/admin/*` layout. The `ChangePassword` component checks for `user` before submitting, but unauthenticated visitors can still reach the page. The sidebar link also leaves the admin layout when navigating to this route.

Recommended fix:

- Move `ChangePassword` under the protected admin route tree.
- Render it inside `AdminLayout`.
- Redirect unauthenticated users to `/admin/login`.

## 8. State Management

The project uses React Context rather than Redux or another global state library.

### Theme Context

File: `src/context/ThemeContext.tsx`

Responsibilities:

- Stores light/dark mode as `isDark`.
- Reads initial preference from `localStorage.theme`.
- Falls back to `prefers-color-scheme: dark`.
- Adds or removes the `dark` class on `document.documentElement`.
- Persists user selection in local storage.

### Auth Context

File: `src/context/AuthContext.tsx`

Responsibilities:

- Stores `isAuthenticated`, `token`, and `user`.
- Loads `token` and `user` from local storage on mount.
- Provides `login(token, user)` and `logout()`.
- Persists auth state to local storage.

Local storage keys used:

```text
token
user
```

### Data Context

File: `src/context/DataContext.tsx`

Responsibilities:

- Fetches projects, categories, skills, and content from the API.
- Tracks loading and error state.
- Exposes `refreshData()`.
- Enriches projects and skills with `categoryName`.
- Normalizes project `tech_stack` if the API sends it as either an array or JSON string.

Data fetching is intentionally tolerant of partial API failures. Each dataset is fetched in its own `try/catch`, so one endpoint can fail without preventing the other fetch attempts.

## 9. Data Models

Defined in `src/types/index.ts`.

### Project

```ts
interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  category: number;
  categoryName?: string;
  image: string;
  github_link: string;
  demo_link: string;
  youtube_link: string;
  createdAt: string;
}
```

### Category

```ts
interface Category {
  id: number;
  name: string;
  slug: string;
}
```

### Skill

```ts
interface Skill {
  id: number;
  name: string;
  category: number;
  categoryName?: string;
  proficiency?: number;
}
```

### SiteContent

```ts
interface SiteContent {
  heroName: string;
  heroTitle: string;
  heroTagline: string;
  aboutText: string;
  contactEmail: string;
  location?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
    discord?: string;
    website?: string;
  };
}
```

### AuthState

```ts
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: { username: string } | null;
}
```

## 10. API Integration

The service layer lives in `src/services/`.

### API Base URL

Two Axios clients are declared:

```text
apiClient.baseURL = http://127.0.0.1:8000/api
axiosInstance.baseURL = http://127.0.0.1:8000/api
```

### API Client

File: `src/services/axios.ts`

`apiClient` sets JSON content type and attaches a bearer token from local storage:

```text
Authorization: Bearer <access_token>
```

Important issue: the interceptor reads `access_token`, but the auth flow stores `token`. This means authenticated API calls may not receive an authorization header unless another part of the system stores `access_token`.

### API Aggregator

File: `src/services/api.ts`

Exports:

```text
api.projects
api.categories
api.skills
api.content
api.auth
```

Also defines `axiosInstance`, which is used by `projectsApi.createProject`. This second client does not attach the auth interceptor.

## 11. Backend Endpoint Contract

Based on the frontend service layer, the backend is expected to expose these endpoints:

### Authentication

| Method | Endpoint | Purpose | Payload |
|---|---|---|---|
| `POST` | `/user_auth/` | Login | `{ username, password }` |
| `PUT` | `/auth/change-password/` | Change admin password | `{ username, old_password, new_password }` |

Expected login response:

```json
{
  "token": "jwt-or-token",
  "user": {
    "username": "admin"
  }
}
```

### Projects

| Method | Endpoint | Purpose | Payload |
|---|---|---|---|
| `GET` | `/projects/` | List projects | None |
| `POST` | `/projects/` | Create project | `FormData` |
| `PUT` | `/projects/:id/` | Update project | `FormData` |
| `DELETE` | `/projects/:id/` | Delete project | None |

Project `FormData` fields:

```text
title
description
tech_stack
category
github_link
demo_link
youtube_link
image
```

`tech_stack` is sent as a JSON string.

### Categories

| Method | Endpoint | Purpose | Payload |
|---|---|---|---|
| `GET` | `/categories/` | List categories | None |
| `POST` | `/categories/` | Create category | `{ name, slug }` |
| `PUT` | `/categories/:id/` | Update category | partial category |
| `DELETE` | `/categories/:id/` | Delete category | None |

### Skills

| Method | Endpoint | Purpose | Payload |
|---|---|---|---|
| `GET` | `/skills/` | List skills | None |
| `POST` | `/skills/` | Create skill | `{ name, category, proficiency }` |
| `PUT` | `/skills/:id/` | Update skill | partial skill |
| `DELETE` | `/skills/:id/` | Delete skill | None |

### Site Content

| Method | Endpoint | Purpose | Payload |
|---|---|---|---|
| `GET` | `/content/` | Fetch site content | None |
| `PUT` | `/content/` | Update site content | partial `SiteContent` |

## 12. Public Portfolio Features

The public site is composed in `src/pages/Portfolio.tsx`.

### Sections

| Section | Component | Purpose |
|---|---|---|
| Navigation | `Navbar` | Sticky responsive navigation, smooth scrolling, theme toggle, admin login link |
| Hero | `Hero` | Name, title, tagline, call-to-action buttons |
| About | `About` | Professional summary and feature cards |
| Skills | `Skills` | Skills grouped by category with proficiency bars |
| Projects | `ProjectsSection` and `ProjectCard` | Filterable project grid with tech tags and links |
| Contact | `Contact` | Contact details, social links, simulated contact form |
| Footer | `Footer` | Copyright and quick links |

### Public Data Usage

The public site reads from `DataContext`:

- `content` powers hero, about, contact, social links, and footer name.
- `categories` power project filtering and skill grouping.
- `projects` power the featured projects grid.
- `skills` power the skills section.

### Loading and Error Handling

`Portfolio` displays a full-screen loading spinner while data is loading. If `DataContext` enters an error state, the page renders a centered error message.

## 13. Admin CMS Features

The admin CMS is composed of `AdminLayout`, `Sidebar`, and individual admin pages.

### Admin Layout

Files:

- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/Sidebar.tsx`

Features:

- Desktop sidebar navigation.
- Mobile sidebar overlay.
- Sticky top header.
- Theme toggle.
- Admin avatar placeholder.
- Logout button.
- Link to view the public site.

### Dashboard

File: `src/pages/admin/Dashboard.tsx`

Features:

- Displays total project, category, and skill counts.
- Shows a recent projects list.
- Links to relevant admin management screens.

### Projects Manager

File: `src/pages/admin/ProjectsManager.tsx`

Features:

- Search by project title or description.
- Filter by category.
- Project table with image, category, tech stack, and external links.
- Add project modal.
- Edit project modal.
- Delete confirmation dialog.
- Image upload using `ImageUpload`.
- Tech stack entry using `TagInput`.
- Uses `FormData` for create and update operations.

### Categories Manager

File: `src/pages/admin/CategoriesManager.tsx`

Features:

- Category table.
- Slug generation from category name.
- Add category modal.
- Edit category modal UI.
- Delete confirmation dialog.

Important issue: the submit handler always calls `createCategory`, even when editing an existing category. `editingCategory` is set, but `updateCategory` is not used.

### Skills Manager

File: `src/pages/admin/SkillsManager.tsx`

Features:

- Skills table.
- Category assignment.
- Proficiency percentage display.
- Add/edit modal.
- Range input for proficiency from 0 to 100 in increments of 5.
- Delete confirmation dialog.

### Content Manager

File: `src/pages/admin/ContentManager.tsx`

Features:

- Edits hero name, professional title, and tagline.
- Edits about text.
- Edits location and contact email.
- Edits social links for GitHub, LinkedIn, Twitter, YouTube, Instagram, Facebook, Telegram, and Discord.
- Maintains `website` in state and type, but the input field is currently commented out.

### Change Password

File: `src/pages/admin/ChangePassword.tsx`

Features:

- Reads authenticated user from `AuthContext`.
- Requires current password, new password, and confirmation.
- Validates matching passwords.
- Enforces minimum password length of 8 characters.
- Calls `/auth/change-password/`.
- Shows success or error toast.
- Redirects to `/admin` after successful update.

## 14. Shared Components

### Modal

File: `src/components/shared/Modal.tsx`

Capabilities:

- Animated open/close with Framer Motion.
- Backdrop click to close.
- Escape key to close.
- Body scroll locking while open.
- Configurable max width.
- Scrollable modal body.

### ConfirmDialog

File: `src/components/shared/ConfirmDialog.tsx`

Capabilities:

- Reuses `Modal`.
- Provides destructive action warning.
- Supports loading state.
- Configurable confirm and cancel labels.

### TagInput

File: `src/components/shared/TagInput.tsx`

Capabilities:

- Add tags using Enter or comma.
- Remove tags individually.
- Backspace removes the last tag when the input is empty.
- Prevents duplicate tags.

### ImageUpload

File: `src/components/shared/ImageUpload.tsx`

Capabilities:

- Click-to-upload and drag-and-drop upload.
- Accepts image files.
- Generates local object URL preview.
- Supports existing string URL values.
- Allows removing selected image.
- Cleans up local object URLs.

Implementation note: the UI text says "max. 5MB", but no file size validation currently exists.

### LoadingSpinner

File: `src/components/shared/LoadingSpinner.tsx`

Capabilities:

- Full-screen or inline loading state.
- Exports `SkeletonCard`, although it is not currently used in the inspected source.

## 15. Styling and Design System

### Tailwind Configuration

File: `tailwind.config.js`

Key settings:

- Dark mode strategy: `class`
- Content paths:
  - `./index.html`
  - `./src/**/*.{js,ts,jsx,tsx}`
- Font families:
  - `sans`: Inter
  - `heading`: Sora
- Primary color:
  - default: `#6366f1`
  - hover: `#4f46e5`

### Global CSS

File: `src/index.css`

Responsibilities:

- Imports Google Fonts.
- Imports Tailwind base, components, and utilities.
- Enables smooth scrolling.
- Applies global body colors, typography, antialiasing, and transition behavior.
- Defines a blob animation for decorative background elements.
- Customizes WebKit scrollbars.

## 16. TypeScript Configuration

File: `tsconfig.json`

Important compiler settings:

- Target: `ES2020`
- Module: `ESNext`
- Module resolution: `bundler`
- JSX transform: `react-jsx`
- Strict mode: enabled
- No unused locals: enabled
- No unused parameters: enabled
- No fallthrough cases in switch: enabled
- No emit: enabled

This configuration is reasonably strict and should catch many common typing and unused-code issues during build or type checking.

## 17. Linting Configuration

File: `.eslintrc.cjs`

Configured with:

- `eslint:recommended`
- `plugin:@typescript-eslint/recommended`
- `plugin:react-hooks/recommended`
- `react-refresh/only-export-components`

Ignored paths:

- `dist`
- `.eslintrc.cjs`

## 18. Build Output

The repository contains an existing `dist/` folder:

```text
dist/index.html
dist/assets/index-Dhs30jMs.css
dist/assets/index-CFmglKRB.js
```

This indicates the app has been built previously. Because dependencies were not installed in the inspected workspace, the build was not rerun as part of this report.

## 19. Security Review

### Current Security Characteristics

- Authentication state is stored in `localStorage`.
- Admin route protection is client-side only.
- API base URL is hard-coded.
- Login credentials are initialized in state as `admin` and `admin123`.
- Authenticated requests depend on a local storage token being attached by Axios.

### Key Security Risks

1. Token storage in `localStorage`

   Local storage is vulnerable to token theft if cross-site scripting occurs. For higher-security deployments, consider HTTP-only cookies or a hardened token refresh strategy.

2. Inconsistent token key

   `AuthContext` and `authApi` store `token`, while the Axios interceptor reads `access_token`. This can prevent authorization headers from being sent.

3. Unprotected change-password route

   `/admin/change-password` is currently reachable without passing through `ProtectedRoute`.

4. Default login values

   The login state defaults to `admin` and `admin123`, which can accidentally submit default credentials even though the inputs are not controlled with `value`.

5. Hard-coded backend URL

   The API URL is fixed to local development. Production should use environment variables such as `VITE_API_BASE_URL`.

6. Contact form simulation

   The contact form only simulates submission and does not send data to a backend, which may mislead users unless intentional.

## 20. Reliability and Maintainability Observations

### Strengths

- Clear separation between public UI, admin UI, services, context, and shared components.
- Strict TypeScript settings.
- Reusable modal, confirmation, tag input, image upload, and loading components.
- Data context handles partial endpoint failures.
- Admin features are mostly modular and easy to extend.

### Issues and Gaps

1. Category editing does not call update API

   The category edit modal exists, but submit currently always creates a new category.

2. Project create uses a different Axios instance

   `projectsApi.createProject` uses `axiosInstance` from `api.ts`, not `apiClient` from `axios.ts`. That instance does not attach the auth token.

3. Token key mismatch

   The request interceptor reads `access_token`, while login stores `token`.

4. Change password is outside the protected admin layout

   This creates an inconsistent admin experience and weaker client-side protection.

5. `tech_stack` parsing can fail globally

   If a project returns malformed JSON in `tech_stack`, `JSON.parse` can throw during normalization and move the whole data context into an error state.

6. Image upload file size is not validated

   The UI says max 5MB, but the component does not enforce file size.

7. Public logo is hard-coded

   `Navbar` displays `Alex.dev` instead of deriving the brand/name from site content.

8. Contact form is not integrated

   It shows a success toast after a timeout but does not persist or send the message.

9. Website social field is partially implemented

   `SiteContent` and `Contact` support `website`, but `ContentManager` comments out the website input.

10. Environment configuration is missing

   API URLs and other deploy-time settings should be externalized.

## 21. Performance Review

### Positive Factors

- Vite provides fast development and optimized production builds.
- Project/category filtering is memoized in `ProjectsSection` and `ProjectsManager`.
- Framer Motion viewport animations generally run only once.
- Tailwind keeps styling mostly static and build-time optimized.

### Potential Improvements

- Lazy-load admin routes to reduce the public bundle size.
- Add image optimization or thumbnails for project images.
- Add API response caching or stale-while-revalidate behavior if backend latency grows.
- Avoid excessive console logging in production.
- Consider code splitting for heavy admin screens.

## 22. Accessibility Review

### Current Good Practices

- Many icon-only links include `title` or `aria-label`.
- Form inputs use labels in most admin and contact forms.
- Buttons use semantic `button` elements.
- Public navigation supports keyboard focus through normal anchors and buttons.

### Recommended Improvements

- Add explicit `aria-label` to all icon-only buttons, especially edit/delete controls.
- Improve modal focus management by trapping focus inside open modals.
- Restore focus to the triggering button after modal close.
- Mark active navigation links in public navigation where possible.
- Ensure color contrast remains sufficient for all primary and muted text in both themes.

## 23. Testing Status

No automated test framework is currently configured in `package.json`.

Recommended test additions:

- Unit tests for context providers and services.
- Component tests for shared components such as `Modal`, `TagInput`, and `ImageUpload`.
- Integration tests for admin CRUD flows.
- End-to-end tests for login, content editing, project creation, filtering, and public rendering.
- API contract tests between frontend and backend.

Suggested tooling:

```text
Vitest
React Testing Library
Playwright
MSW
```

## 24. Deployment Considerations

### Frontend Deployment

The project can be deployed as a static SPA after running:

```text
npm run build
```

The output directory is:

```text
dist/
```

Compatible static hosting targets:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Nginx or Apache static hosting

### Required Production Configuration

Before production deployment:

- Replace hard-coded API URL with `VITE_API_BASE_URL`.
- Ensure SPA fallback routes serve `index.html`.
- Configure HTTPS.
- Configure backend CORS for the production frontend domain.
- Verify authentication header behavior.
- Remove default credential assumptions from the login screen.

## 25. Suggested Environment Variables

Recommended `.env` pattern:

```text
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Recommended service usage:

```ts
const baseURL = import.meta.env.VITE_API_BASE_URL;
```

## 26. Recommended Roadmap

### High Priority

1. Fix token key mismatch by standardizing on either `token` or `access_token`.
2. Move change-password into protected admin routing.
3. Use a single authenticated Axios client for all protected API calls.
4. Implement category update behavior.
5. Move the API base URL to an environment variable.

### Medium Priority

1. Add real contact form integration.
2. Add file size validation in `ImageUpload`.
3. Add route-level code splitting.
4. Add automated tests for services, contexts, and CRUD screens.
5. Replace hard-coded `Alex.dev` logo text with site content.

### Low Priority

1. Remove unused imports and console logs.
2. Decide whether `@emotion/react` is needed.
3. Add a website input back to `ContentManager` or remove website support from the model.
4. Add skeleton cards to public loading states.
5. Add richer admin audit/error states.

## 27. Conclusion

The current project is a functional portfolio frontend and lightweight admin CMS with a clean modular structure. It is strongest in its separation of public components, admin screens, context-based state management, and REST service wrappers.

The main production-readiness concerns are authentication consistency, protected route coverage, environment configuration, missing automated tests, and a few incomplete CRUD details. Addressing the high-priority roadmap items would significantly improve reliability, security, and maintainability while preserving the existing architecture.

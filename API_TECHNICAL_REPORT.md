# FOROZ Admin Dashboard - Full Technical Report (Updated)

## 1. Project Purpose

This project is a React + TypeScript admin dashboard for managing a community organization's internal operations. The interface is designed for administrative users to monitor and manage volunteer applications, users, announcements, events, collaborations, board members, messages, email, notifications, and profile data.

The application is structured as a modern single-page app using Vite, React Router, Tailwind CSS, and a service-oriented API layer.

---

## 2. Technical Stack

### Core Framework

- React 18.3.1
- TypeScript 5.5.4
- Vite 5.2.0

### Routing and UI

- React Router DOM 7.18.1
- Tailwind CSS 3.4.17
- Lucide React 0.522.0
- Framer Motion 11.5.4
- Radix UI primitives

### Development Tooling

- ESLint
- TypeScript compiler
- PostCSS and Autoprefixer

### Package Metadata

The project is configured as a Vite React app in [package.json](package.json) with scripts for development, build, preview, and linting.

#### Scripts

- `npm run dev` launches the Vite development server.
- `npm run build` creates a production build.
- `npm run preview` previews the built app locally.
- `npm run lint` runs ESLint across the source tree.

---

## 3. Application Architecture

The project follows a modular frontend architecture:

- [src/App.tsx](src/App.tsx) initializes the app shell and providers.
- [src/index.tsx](src/index.tsx) mounts the React application into the DOM.
- [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) defines the application's route structure.
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) provides authentication state management.
- [src/context/ForozDataContext.tsx](src/context/ForozDataContext.tsx) provides content/data context for the public homepage.
- [src/pages](src/pages) contains route-level page components.
- [src/components](src/components) contains reusable UI and feature components.
- [src/lib/api](src/lib/api) contains the secure API client with token refresh.
- [src/lib/services](src/lib/services) contains domain-specific service modules.
- [src/services](src/services) contains the legacy API client for public content fetching.

### Runtime Flow

1. The app loads from [src/index.tsx](src/index.tsx).
2. [src/App.tsx](src/App.tsx) wraps the app in a browser router and renders routes.
3. [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) renders the appropriate page based on the current URL.
4. Protected routes require authentication via [src/components/auth/ProtectedRoute.tsx](src/components/auth/ProtectedRoute.tsx).
5. Pages consume data through the service layer in `src/lib/services/` and render UI with reusable components.

---

## 4. Project Structure

### Root Files

- [package.json](package.json): dependencies, scripts, and project metadata.
- [vite.config.ts](vite.config.ts): Vite build configuration.
- [tsconfig.json](tsconfig.json): TypeScript compiler settings.
- [tailwind.config.js](tailwind.config.js): Tailwind content scanning configuration.
- [README.md](README.md): project overview and setup instructions.

### Source Structure

- [src/index.css](src/index.css): global Tailwind entry and base styles.
- [src/App.tsx](src/App.tsx): app bootstrap and provider composition.
- [src/index.tsx](src/index.tsx): React root mount.

### Main Folders

- [src/components](src/components): reusable UI and feature components.
  - `auth/`: ProtectedRoute, PublicOnlyRoute guards
  - `layout/`: AdminLayout for dashboard pages
- [src/context](src/context): global context providers (AuthContext, ForozDataContext).
- [src/lib](src/lib): modern API client and services.
  - `api/client.ts`: Secure API client with token refresh
  - `services/`: Domain-specific service modules
- [src/pages](src/pages): route-level views.
  - `auth/`: SignInPage, SignUpPage
  - `admin/`: DashboardPage
- [src/routes](src/routes): routing definitions.
- [src/services](src/services): legacy API abstraction for public content.

---

## 5. Routing Design

The application uses React Router v7 with nested routes and a shared layout.

### Main Route Layout

All admin pages are rendered inside [src/components/layout/AdminLayout.tsx](src/components/layout/AdminLayout.tsx), which provides:

- top navigation
- sidebar/mobile menu behavior
- notifications dropdown
- email unread count indicator
- profile avatar and logout button

### Defined Routes

The route table in [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) includes:

- `/login` - Public sign-in page
- `/signup` - Public registration page
- `/admin/dashboard` - Main dashboard (default admin route)
- `/admin/*` - Protected admin routes (expandable for future features)

The app defaults to `/admin/dashboard` for authenticated users and redirects unmatched admin routes there.

### Route Guards

- **ProtectedRoute**: Requires authentication; redirects to `/login` if not authenticated
- **PublicOnlyRoute**: Redirects authenticated users away from auth pages

---

## 6. State Management Approach

### 6.1 Authentication State

The app uses React Context through [src/context/AuthContext.tsx](src/context/AuthContext.tsx).

It provides:

- `user` - Current authenticated user
- `loading` - Authentication loading state
- `login()` - Sign-in function
- `logout()` - Sign-out function
- `register()` - Registration function

### 6.2 Token Storage

- **Access token**: Stored in memory only (never persisted)
- **Refresh token**: Stored securely in localStorage under key `rtoken`
- **Automatic refresh**: Access token is refreshed automatically on 401 errors

### 6.3 Local Component State

Pages and components mostly use React's built-in `useState` and `useEffect` hooks for:

- form input state
- modal visibility
- loading and error flags
- filtered lists
- delete and edit targets

---

## 7. UI Architecture

The UI is built with reusable, composable components under [src/components](src/components).

### Common UI Components

- Navbar, Footer - Public page layout components
- HeroSection, AboutSection, ServicesSection, etc. - Homepage sections
- AdminLayout - Dashboard shell with sidebar navigation
- ProtectedRoute, PublicOnlyRoute - Route guards

### UI Design Patterns

- Tailwind-based utility classes are used throughout.
- The design is modern with gradient accents and card-based layouts.
- Animations use Framer Motion for smooth transitions.
- Icons are provided by Lucide React.

---

## 8. Feature Modules

### 8.1 Dashboard

The dashboard page in [src/pages/admin/DashboardPage.tsx](src/pages/admin/DashboardPage.tsx) shows:

- total users count
- total applications count
- total events count
- active volunteers count
- recent applications list
- upcoming events list
- quick action links

Data is fetched via [src/lib/services/dashboardService.ts](src/lib/services/dashboardService.ts).

### 8.2 Authentication

Authentication is handled by:

- [src/lib/services/authService.ts](src/lib/services/authService.ts) - Auth API calls
- [src/context/AuthContext.tsx](src/context/AuthContext.tsx) - Auth state provider
- [src/pages/auth/SignInPage.tsx](src/pages/auth/SignInPage.tsx) - Login UI
- [src/pages/auth/SignUpPage.tsx](src/pages/auth/SignUpPage.tsx) - Registration UI

Features:

- JWT-based authentication
- Automatic token refresh
- CSRF protection for mutations
- Route guards for protected pages

---

## 9. API and Service Layer

### 9.1 Modern API Client

All admin API requests flow through [src/lib/api/client.ts](src/lib/api/client.ts).

This client:

- reads the API base URL from environment variables (`VITE_API_ORIGIN`, `VITE_API_BASE_URL`)
- injects CSRF headers for state-changing requests
- reads access token from memory
- reads refresh token from localStorage
- sets Authorization headers for API calls (`Bearer <token>`)
- uses `fetch` with credentials enabled
- automatically refreshes access token on 401 errors
- retries failed requests after token refresh

### 9.2 Environment Configuration

Default values:

- `VITE_API_ORIGIN=http://localhost:8000`
- `VITE_API_BASE_URL=/`

Create a `.env` file in the project root to override:

```bash
VITE_API_ORIGIN=https://your-api-domain.com
VITE_API_BASE_URL=/api/
```

### 9.3 Service Modules

The `src/lib/services/` folder contains domain-specific wrappers around the API:

| Service | File | Endpoints |
|---------|------|-----------|
| Auth | `authService.ts` | `/user/login_form`, `/user/auth/register/`, `/user/auth/logout/`, `/user/auth/user/` |
| Dashboard | `dashboardService.ts` | `/dashboard/`, `/applications/recent`, `/events/` |
| Announcements | `announcementsService.ts` | `/announcements/` |
| Events | `eventsService.ts` | `/events/` |
| Collaborations | `collaborationsService.ts` | `/collaborations/` |
| Board Members | `boardMembersService.ts` | `/board-members/` |
| Applications | `applicationsService.ts` | `/applications/` |
| Users | `usersService.ts` | `/users/` |
| Messages | `messagesService.ts` | `/messages/` |
| Email | `emailService.ts` | `/email/` |
| Notifications | `notificationsService.ts` | `/notifications/` |
| Profile | `profileService.ts` | `/user/auth/user/` |

### 9.4 Request Patterns

The application uses several request methods:

- `GET` for read operations
- `POST` for create, login, register, send actions
- `PATCH` for partial updates
- `DELETE` for record removal

Payloads vary by endpoint:

- JSON payloads for regular structured data
- `FormData` for file uploads and multipart forms

### 9.5 Legacy API Client

The [src/services/api.ts](src/services/api.ts) client is used for public homepage content fetching with fallback strategies. It is NOT used for admin dashboard operations.

---

## 10. Data Flow Patterns

### 10.1 Page → Service → API → UI

The common flow is:

1. A page component calls a service function (e.g., `fetchDashboardStats()`)
2. The service sends an HTTP request using `api.get/post/patch/delete`
3. The API client adds auth headers and handles token refresh
4. The response is parsed and returned
5. The UI updates state and renders the result

### 10.2 Loading and Error Handling

The app uses a consistent pattern for asynchronous operations:

- loading state while the request is pending
- error messages when a request fails
- toast notifications for success or failure feedback

---

## 11. Styling and Theming

The project uses Tailwind CSS for styling.

### Styling Approach

- utility-first classes throughout components
- consistent spacing, color, and typography conventions
- responsive layouts using Tailwind breakpoints
- modern card-based UI with gradients and soft shadows

### Global Styles

The global stylesheet in [src/index.css](src/index.css) contains the required Tailwind directives.

---

## 12. Authentication and Session Model

### Token-Based Authentication

- Access tokens are stored in memory only (never in localStorage)
- Refresh tokens are stored in localStorage under `rtoken`
- Tokens are automatically refreshed on 401 responses
- CSRF cookies are fetched and included with mutations

### Logout Flow

1. Call `authService.logout()` to notify backend
2. Clear local tokens
3. Redirect to `/login`

### Protected Routes

All `/admin/*` routes require authentication. Unauthenticated users are redirected to `/login`.

---

## 13. API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user/login_form` | Sign in with username/password |
| POST | `/user/auth/register/` | Register new user |
| POST | `/user/auth/logout/` | Sign out |
| GET | `/user/auth/user/` | Get current user profile |
| PATCH | `/user/auth/user/` | Update profile |
| POST | `/user/auth/token/refresh/` | Refresh access token |

### Dashboard Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/` | Get dashboard statistics |
| GET | `/applications/recent?limit=5` | Get recent applications |
| GET | `/events/` | Get all events |

### Resource Endpoints

All resource endpoints follow RESTful conventions:

| Resource | List | Detail | Create | Update | Delete |
|----------|------|--------|--------|--------|--------|
| Announcements | `GET /announcements/` | `GET /announcements/{id}/` | `POST /announcements/` | `PATCH /announcements/{id}/` | `DELETE /announcements/{id}/` |
| Events | `GET /events/` | `GET /events/{id}/` | `POST /events/` | `PATCH /events/{id}/` | `DELETE /events/{id}/` |
| Collaborations | `GET /collaborations/` | `GET /collaborations/{id}/` | `POST /collaborations/` | `PATCH /collaborations/{id}/` | `DELETE /collaborations/{id}/` |
| Board Members | `GET /board-members/` | `GET /board-members/{id}/` | `POST /board-members/` | `PATCH /board-members/{id}/` | `DELETE /board-members/{id}/` |
| Applications | `GET /applications/` | `GET /applications/{id}/` | `POST /applications/` | `PATCH /applications/{id}/` | `DELETE /applications/{id}/` |
| Users | `GET /users/` | `GET /users/{id}/` | `POST /users/` | `PATCH /users/{id}/` | `DELETE /users/{id}/` |
| Messages | `GET /messages/` | `GET /messages/{id}/` | `POST /messages/` | `PATCH /messages/{id}/` | `DELETE /messages/{id}/` |
| Email | `GET /email/` | `GET /email/{id}/` | `POST /email/` | `PATCH /email/{id}/` | `DELETE /email/{id}/` |
| Notifications | `GET /notifications/` | - | - | `PATCH /notifications/{id}/` | `DELETE /notifications/{id}/` |

---

## 14. Troubleshooting 404 Errors

If you're getting 404 errors from API endpoints, check the following:

### 1. Verify Backend Server

Ensure your Django/backend server is running at the expected origin:

```bash
# Default: http://localhost:8000
curl http://localhost:8000/dashboard/
```

### 2. Check Environment Variables

Create or update `.env` in the project root:

```bash
VITE_API_ORIGIN=http://localhost:8000
VITE_API_BASE_URL=/
```

Restart the dev server after changing `.env`:

```bash
npm run dev
```

### 3. Verify API Endpoint Paths

The frontend expects these endpoint patterns:

- `/dashboard/` - Dashboard stats
- `/announcements/` - Announcements list
- `/events/` - Events list
- `/user/login_form` - Login endpoint
- `/user/auth/user/` - Current user

If your backend uses different paths, update the service files in `src/lib/services/`.

### 4. Check CORS Configuration

Your backend must allow requests from your frontend origin. For development:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

### 5. Debug API Calls

Open browser DevTools → Network tab and inspect failed requests:

- Check the full URL being requested
- Verify request headers (Authorization, X-CSRFToken)
- Check response status and body

---

## 15. Summary

This project is a feature-rich admin dashboard built with React, TypeScript, Vite, Tailwind CSS, and React Router v7. It provides a polished internal management experience for a community organization with:

- Secure JWT-based authentication with automatic token refresh
- Modular service layer for clean API integration
- Protected routes with authentication guards
- Modern UI with responsive design
- Comprehensive error handling and loading states

The architecture is maintainable and extensible, with clear separation between presentation, routing, state, and data access concerns.

---

## Appendix: Quick Start

### Prerequisites

- Node.js 18+
- Backend API server running at `http://localhost:8000`

### Installation

```bash
npm install
```

### Configure Environment

Create `.env` file:

```bash
VITE_API_ORIGIN=http://localhost:8000
VITE_API_BASE_URL=/
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

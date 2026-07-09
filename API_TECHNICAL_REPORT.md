# FOROZ Admin Dashboard - Full Technical Report

## 1. Project Purpose

This project is a React + TypeScript admin dashboard for managing a community organization’s internal operations. The interface is designed for administrative users to monitor and manage volunteer applications, users, announcements, events, collaborations, board members, messages, email, notifications, and profile data.

The application is structured as a modern single-page app using Vite, React Router, Tailwind CSS, and a service-oriented API layer.

---

## 2. Technical Stack

### Core Framework

- React 18.3.1
- TypeScript 5.5.4
- Vite 5.2.0

### Routing and UI

- React Router DOM 6.26.2
- Tailwind CSS 3.4.17
- Lucide React 0.522.0
- Framer Motion 11.5.4

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
- [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) defines the application’s route structure.
- [src/context/AppContext.tsx](src/context/AppContext.tsx) provides global application state and user context.
- [src/pages](src/pages) contains route-level page components.
- [src/components](src/components) contains reusable UI and feature components.
- [src/services](src/services) contains the API abstraction layer.
- [src/types](src/types) defines domain models.
- [src/utils](src/utils) contains helper functions for formatting and exporting data.

### Runtime Flow

1. The app loads from [src/index.tsx](src/index.tsx).
2. [src/App.tsx](src/App.tsx) wraps the app in a browser router and app provider.
3. [src/context/AppContext.tsx](src/context/AppContext.tsx) loads the current user profile on startup.
4. [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) renders the appropriate page based on the current URL.
5. Pages consume data through the service layer and render UI with reusable components.

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
- [src/context](src/context): global context providers.
- [src/hooks](src/hooks): custom hooks for reusable logic.
- [src/pages](src/pages): route-level views.
- [src/routes](src/routes): routing definitions.
- [src/services](src/services): backend API clients and domain services.
- [src/types](src/types): TypeScript interfaces and domain types.
- [src/utils](src/utils): small helpers for CSV export and date formatting.

---

## 5. Routing Design

The application uses React Router with nested routes and a shared layout.

### Main Route Layout

All pages are rendered inside [src/components/AdminLayout.tsx](src/components/AdminLayout.tsx), which provides:

- top navigation
- sidebar/mobile menu behavior
- notifications dropdown
- email unread count indicator
- profile avatar and logout button

### Defined Routes

The route table in [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx) includes:

- `/dashboard`
- `/announcements`
- `/events`
- `/collaborations`
- `/board-members`
- `/users`
- `/applications`
- `/messages`
- `/email`
- `/profile`

The app defaults to `/dashboard` and redirects unmatched routes there.

---

## 6. State Management Approach

### 6.1 Global State

The app uses React Context through [src/context/AppContext.tsx](src/context/AppContext.tsx).

It provides:

- `currentUser`
- `addToast`
- `updateCurrentUser`
- `logout`

The context is initialized by fetching the current user profile from the backend during app startup.

### 6.2 Local Component State

Pages and components mostly use React's built-in `useState` and `useEffect` hooks for:

- form input state
- modal visibility
- loading and error flags
- filtered lists
- delete and edit targets

### 6.3 Custom Hooks

The project includes [src/hooks/useNotifications.ts](src/hooks/useNotifications.ts), which centralizes notification loading, polling, unread-count computation, and mark-as-read actions.

---

## 7. UI Architecture

The UI is built with reusable, composable components under [src/components/ui](src/components/ui).

### Common UI Components

- [src/components/ui/Button.tsx](src/components/ui/Button.tsx): reusable button component with variants and sizes.
- [src/components/ui/Input.tsx](src/components/ui/Input.tsx): input field with optional label and icon.
- [src/components/ui/Modal.tsx](src/components/ui/Modal.tsx): accessible modal with focus handling and animation.
- [src/components/ui/Card.tsx](src/components/ui/Card.tsx): styled card wrapper.
- [src/components/ui/ConfirmDialog.tsx](src/components/ui/ConfirmDialog.tsx): confirmation dialog.
- [src/components/ui/Toast.tsx](src/components/ui/Toast.tsx): toast notification container.
- [src/components/ui/Textarea.tsx](src/components/ui/Textarea.tsx): textarea wrapper.
- [src/components/ui/Badge.tsx](src/components/ui/Badge.tsx): status and tag badge component.

### UI Design Patterns

- Tailwind-based utility classes are used throughout.
- The design is modern and card-based.
- Modals and dialogs are animated with Framer Motion.
- Buttons, cards, inputs, and modals follow a shared visual language.

---

## 8. Feature Modules

### 8.1 Dashboard

The dashboard page in [src/pages/DashboardPage.tsx](src/pages/DashboardPage.tsx) shows:

- total applications
- pending review count
- approved volunteers count
- approval rate

It also embeds the application table for recent data.

### 8.2 Applications

The application management UI is handled primarily by [src/components/ApplicationTable.tsx](src/components/ApplicationTable.tsx).

It supports:

- listing applications
- search and filtering by name/email/status
- status updates
- email sending to applicants
- deletion
- CSV export

### 8.3 Users

The users management experience is handled through [src/pages/Users/UsersPage.tsx](src/pages/Users/UsersPage.tsx) and [src/pages/Users/UserModal.tsx](src/pages/Users/UserModal.tsx).

The module is responsible for:

- viewing users
- creating and editing users
- assigning roles and statuses
- deleting users
- uploading avatars

### 8.4 Announcements

The announcements module lives in [src/pages/Announcements](src/pages/Announcements), with page and modal components for:

- listing announcements
- searching and filtering content
- creating and updating announcements
- removing announcements
- handling image upload

### 8.5 Events

The events module in [src/pages/EventsPage.tsx](src/pages/EventsPage.tsx) provides:

- event card listing
- create/edit/delete flows
- image upload support
- publish and termination date handling
- search functionality

### 8.6 Collaborations

The collaboration management page in [src/pages/Collaborations](src/pages/Collaborations) supports:

- listing partner collaborations
- editing collaboration metadata
- image/logo handling
- creating and deleting collaborations

### 8.7 Board Members

The board members page in [src/pages/BoardMembersPage.tsx](src/pages/BoardMembersPage.tsx) manages:

- board member profiles
- role and description fields
- social links
- photos

### 8.8 Messages

The messages feature in [src/pages/Messages](src/pages/Messages) provides conversation-based messaging capabilities and a thread view for chat-like interactions.

### 8.9 Email

The email feature in [src/pages/Email](src/pages/Email) supports:

- inbox-style data loading
- composing and sending emails
- read-state updates
- attachments

### 8.10 Notifications

The notifications system uses [src/hooks/useNotifications.ts](src/hooks/useNotifications.ts) and [src/services/notificationsService.ts](src/services/notificationsService.ts) to load and update real-time notification data.

### 8.11 Profile

The profile page in [src/pages/Profile/ProfilePage.tsx](src/pages/Profile/ProfilePage.tsx) handles:

- displaying user details
- updating profile information
- changing passwords
- uploading avatars

---

## 9. API and Service Layer

### 9.1 Shared API Client

All requests flow through [src/services/apiClient.ts](src/services/apiClient.ts).

This client:

- reads the API base URL from [src/config.ts](src/config.ts)
- injects CSRF headers for state-changing requests
- reads auth tokens from local storage
- sets Authorization headers for API calls
- uses `fetch` with credentials enabled

### 9.2 Authentication Handling

The app expects tokens to be stored in one of the following keys:

- `token`
- `access`
- `accessToken`
- `jwt`

If a token is present, the client sends it as either:

- `Authorization: Bearer <token>` for JWT-like tokens
- `Authorization: Token <token>` otherwise

### 9.3 Service Modules

The services folder contains domain-specific wrappers around the API:

- [src/services/announcementsService.ts](src/services/announcementsService.ts)
- [src/services/applicationsService.ts](src/services/applicationsService.ts)
- [src/services/boardMembersService.ts](src/services/boardMembersService.ts)
- [src/services/collaborationsService.ts](src/services/collaborationsService.ts)
- [src/services/dashboardService.ts](src/services/dashboardService.ts)
- [src/services/emailService.ts](src/services/emailService.ts)
- [src/services/eventsService.ts](src/services/eventsService.ts)
- [src/services/messagesService.ts](src/services/messagesService.ts)
- [src/services/notificationsService.ts](src/services/notificationsService.ts)
- [src/services/profileService.ts](src/services/profileService.ts)
- [src/services/usersService.ts](src/services/usersService.ts)

These modules normalize backend responses into the frontend’s expected data shape before returning them to the UI.

### 9.4 Request Patterns

The application uses several request methods:

- `GET` for read operations
- `POST` for create, update, send, and action-triggering requests
- `PATCH` for partial updates
- `DELETE` for record removal

Payloads vary by endpoint:

- JSON payloads for regular structured data
- `FormData` for file uploads and multipart forms

---

## 10. Data Flow Patterns

### 10.1 Page → Service → UI

The common flow is:

1. A page or hook calls a service function.
2. The service sends an HTTP request using the shared fetch client.
3. The response is parsed and normalized.
4. The UI updates state and renders the result.

### 10.2 Modal and Form Patterns

Many modules use modal-based create/edit flows. These forms typically:

- maintain local form state
- validate required fields
- submit through service layer functions
- close the modal and reload data after success

### 10.3 Loading and Error Handling

The app uses a consistent pattern for asynchronous operations:

- loading state while the request is pending
- error messages when a request fails
- retry flows for failed loads
- toast notifications for success or failure feedback

---

## 11. Styling and Theming

The project uses Tailwind CSS for styling.

### Styling Approach

- utility-first classes throughout components
- consistent spacing, color, and typography conventions
- responsive layouts using Tailwind breakpoints
- modern card-based UI with soft shadows and rounded corners

### Global Styles

The global stylesheet in [src/index.css](src/index.css) contains the required Tailwind directives and is the entry point for project-wide styling.

---

## 12. Configuration Details

### Environment Configuration

The app uses [src/config.ts](src/config.ts) to determine the API base URL.

Default value:

- `http://localhost:8000/`

Optional override:

- `VITE_API_BASE_URL`

### Build Configuration

Vite handles bundling and build output, and TypeScript is configured for strict mode with React JSX support.

The project is set up for browser-based SPA development and does not currently include a dedicated backend server.

---

## 13. Authentication and Session Model

The app appears to be designed for authenticated admin access.

### Current Implementation Details

- the app initializes the current user on startup
- if no authenticated profile is available, the app shows an access-denied view
- logout clears stored auth tokens from local storage
- the UI includes a login redirect to a backend login endpoint

### Important Note

The auth flow is currently dependent on local storage tokens and a backend endpoint. The code does not appear to use a dedicated auth library such as Auth0, Clerk, or Firebase.

---

## 14. Accessibility and UX Considerations

Several UI components have been implemented with accessibility in mind.

Examples include:

- modal focus management in [src/components/ui/Modal.tsx](src/components/ui/Modal.tsx)
- keyboard handling for dialogs and escape-to-close behavior
- descriptive labels for form fields
- ARIA attributes on interactive modal elements

The project generally follows a polished admin-panel design pattern with clear feedback and action-oriented interactions.

---

## 15. Testing and Quality Practices

### Current State

The repository includes linting support but does not appear to include a formal test suite yet.

### Existing Quality Tools

- ESLint
- TypeScript strict mode
- build validation via Vite

### Recommendations

A strong next step would be to add:

- unit tests for service helpers
- component tests for modals and forms
- integration tests for core CRUD flows
- end-to-end tests for authentication and routing

---

## 16. Observed Strengths

- Clear separation between UI, state, routing, and services
- Reusable component library for consistent UI
- Centralized API client for auth and CSRF handling
- Strong route-based feature organization
- Good use of TypeScript for domain modeling
- Modal-based CRUD patterns are consistent across features

---

## 17. Areas for Improvement

While the project is well structured, a few areas could be improved:

1. Standardize API endpoint naming across the backend contract.
2. Consolidate duplicated logic for CRUD flows.
3. Introduce a more formal auth library or centralized auth guard.
4. Add automated tests.
5. Add stronger validation and error handling in forms.
6. Improve consistency in response normalization across services.
7. Document the expected backend payload formats for each feature.

---

## 18. Summary

This project is a feature-rich admin dashboard built with React, TypeScript, Vite, Tailwind CSS, and React Router. It provides a polished internal management experience for a community organization and clearly separates presentation, routing, state, and data access concerns.

Its architecture is modular and maintainable, with domain-specific services, reusable UI components, and context-based global state. The project is production-ready in structure but would benefit from stronger testing, authentication standardization, and API contract consistency.

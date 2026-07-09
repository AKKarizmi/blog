# FOROZ Project Upgrade Plan: Dashboard & Authentication

## 1. Executive Summary
**Objective:** Add two critical pages (Authentication, Dashboard) to the existing FOROZ single-page application without altering its core design or public-facing behavior.

**Approach:** 
- Preserve the existing scrolling homepage architecture exactly as-is.
- Introduce routing *only* for the new `/login`, `/signup`, and `/admin/dashboard` routes.
- Isolate admin functionality under `/admin/*` with a dedicated layout.
- Implement secure authentication with token management and protected routes.

---

## 2. Technical Requirements

### 2.1 Dependencies
```bash
npm install react-router-dom
npm install @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu class-variance-authority clsx tailwind-merge lucide-react
```

### 2.2 Folder Structure (Additions Only)
```
src/
├── pages/
│   ├── auth/
│   │   ├── SignInPage.tsx       # NEW
│   │   └── SignUpPage.tsx       # NEW
│   └── admin/
│       └── DashboardPage.tsx    # NEW
├── components/
│   ├── auth/
│   │   ├── ProtectedRoute.tsx   # NEW
│   │   └── PublicOnlyRoute.tsx  # NEW
│   └── layout/
│       └── AdminLayout.tsx      # NEW (Sidebar + Topbar for admin only)
├── context/
│   └── AuthContext.tsx          # NEW
├── services/
│   └── api/
│       ├── client.ts            # NEW (Single fetch wrapper)
│       └── authService.ts       # NEW
├── types/
│   └── index.ts                 # NEW (User, Profile types)
└── App.tsx                      # MODIFIED (Wrap with Router + Providers)
```

### 2.3 Design Tokens (CSS Variables)
Add to `src/index.css` for consistent theming in new pages:
```css
:root {
  --brand-start: #4F46E5; /* Indigo */
  --brand-end: #7C3AED;   /* Purple */
  --surface: #FFFFFF;
  --ink: #1E1B4B;
  --paper: #F8FAFC;
}
[data-theme="dark"] {
  --brand-start: #818CF8;
  --brand-end: #A78BFA;
  --surface: #1E293B;
  --ink: #F1F5F9;
  --paper: #0F172A;
}
```

---

## 3. Implementation Steps

### Phase 1: Infrastructure (Day 1)
1. **Install Dependencies**: Add `react-router-dom` and UI primitives.
2. **API Client (`src/services/api/client.ts`)**:
   - Single fetch wrapper handling base URL (`VITE_API_BASE_URL`).
   - Auto-refresh logic: Access token in memory, Refresh token in `localStorage`.
   - CSRF token handling for mutations.
3. **Auth Context (`src/context/AuthContext.tsx`)**:
   - Manage `user`, `loading`, `isAuthenticated` state.
   - Expose `login()`, `signup()`, `logout()` functions.
4. **Environment Setup**: Create `.env.example` with `VITE_API_BASE_URL`.

### Phase 2: Routing & Layouts (Day 2)
1. **Update `App.tsx`**:
   - Wrap app in `BrowserRouter`.
   - Nest providers: `ThemeProvider` → `AuthProvider` → `Routes`.
   - Define routes:
     - `/` → Existing Home (unchanged).
     - `/login`, `/signup` → Auth Pages.
     - `/admin/dashboard` → Dashboard (Protected).
2. **Route Guards**:
   - `ProtectedRoute`: Redirects unauthenticated users to `/login`.
   - `PublicOnlyRoute`: Redirects authenticated users away from `/login`.
3. **Admin Layout (`src/components/layout/AdminLayout.tsx`)**:
   - Sidebar navigation (Dashboard, Users, Settings).
   - Topbar with User Avatar + Logout.
   - Responsive mobile drawer.

### Phase 3: Authentication Pages (Day 3)
1. **SignInPage**:
   - Email/Password form with validation.
   - "Remember me" toggle.
   - Link to Sign Up.
   - Error handling (invalid credentials).
2. **SignUpPage**:
   - Full Name, Email, Password, Confirm Password.
   - Role selection dropdown (Volunteer, Student, Partner).
   - Terms acceptance checkbox.
   - Link to Sign In.
3. **Wiring**: Connect forms to `authService` via `AuthContext`.

### Phase 4: Dashboard Page (Day 4)
1. **DashboardPage**:
   - Welcome message with user name.
   - Stat Cards (Total Users, Active Events, Pending Applications).
   - Quick Actions (Create Event, View Applications).
   - Recent Activity Table.
2. **Data Fetching**: Use `dashboardService` to pull stats from backend.
3. **Styling**: Apply CSS variables for brand consistency.

---

## 4. API Integration Strategy

### 4.1 Endpoint Verification (Critical First Step)
Before coding, verify these endpoints against the live Django backend:
- **Auth**: `POST /user/auth/login/`, `POST /user/auth/register/`
- **Dashboard**: `GET /dashboard/`
- **Applications**: Confirm if path is `/applications` or `/applicants`.
  - *Action*: Store this in a single constant `API_ENDPOINTS.APPLICATIONS` to allow one-line switching later.

### 4.2 Service Layer (`src/services/api/authService.ts`)
```typescript
export const authService = {
  login: (credentials) => api.post('/user/auth/login/', credentials),
  signup: (data) => api.post('/user/auth/register/', data),
  logout: () => api.post('/user/auth/logout/'),
  getCurrentUser: () => api.get('/user/auth/user/'),
};
```

---

## 5. Acceptance Criteria

### Functional
- [ ] Existing homepage (`/`) loads exactly as before (no layout shifts).
- [ ] `/login` and `/signup` are accessible and functional.
- [ ] Unauthenticated users accessing `/admin/dashboard` are redirected to `/login`.
- [ ] Authenticated users accessing `/login` are redirected to `/admin/dashboard`.
- [ ] Logout clears session and redirects to home.
- [ ] Dashboard displays real data from backend (no mocks).

### Security
- [ ] Access token is **never** stored in `localStorage` (memory only).
- [ ] Refresh token is stored securely in `localStorage`.
- [ ] Expired access tokens trigger silent refresh before failing.
- [ ] CSRF tokens are automatically attached to mutating requests.

### UX/UI
- [ ] New pages use the FOROZ brand gradient (Indigo → Purple).
- [ ] Dark mode support works on new pages via CSS variables.
- [ ] Forms have clear validation states and error messages.
- [ ] Mobile responsiveness verified for Auth and Dashboard pages.

---

## 6. Risk Mitigation

| Risk | Mitigation |
|------|------------|
| **Backend Endpoint Mismatch** | Verify endpoints in Step 1; use constants file for easy switching. |
| **CSS Conflicts** | Scope new styles using specific class prefixes or CSS modules if needed. |
| **State Management Bloat** | Keep `AuthContext` minimal; avoid lifting unnecessary state. |
| **Routing Breaks Existing Scroll** | Use `useNavigate` carefully; ensure home route doesn't force reload. |

---

## 7. Deliverables
1. Working Sign In / Sign Up pages.
2. Protected Dashboard page with real data.
3. Secure authentication flow with token refresh.
4. Updated `App.tsx` with routing configuration.
5. Documentation of verified API endpoints.

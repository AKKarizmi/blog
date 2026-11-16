// Development stays on the four local workspaces; deployment links are configurable.
const defaults = import.meta.env.DEV
  ? {
      lms: "http://localhost:4176",
      dashboard: "http://localhost:4174",
      public: "http://localhost:4173",
    }
  : {
      lms: "https://lms.foroz.me",
      dashboard: "https://dashboard.foroz.me",
      public: "https://www.foroz.me",
    };
export const appUrls = {
  lms: (import.meta.env.VITE_LMS_ORIGIN || defaults.lms).replace(/\/$/, ""),
  dashboard: (
    import.meta.env.VITE_DASHBOARD_ORIGIN || defaults.dashboard
  ).replace(/\/$/, ""),
  public: (import.meta.env.VITE_PUBLIC_ORIGIN || defaults.public).replace(
    /\/$/,
    "",
  ),
};

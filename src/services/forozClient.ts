/** Shared FOROZ session protocol. Keep identical across independently deployed apps. */
export interface SessionUser {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  image: string | null;
  is_superuser: boolean;
  can_access_dashboard: boolean;
  lms_roles: Array<"admin" | "teacher" | "student">;
  student_id: string | null;
  can_announce_classes: boolean;
}
let accessToken: string | null = null;
let currentUser: SessionUser | null = null;
let refreshPromise: Promise<SessionUser | null> | null = null;
export const getAccessToken = () => accessToken;
export const getSessionUser = () => currentUser;
function changed(user: SessionUser | null) {
  currentUser = user;
  window.dispatchEvent(new CustomEvent("foroz:session", { detail: user }));
}
const unexpectedResponse =
  "The service returned an unexpected response. Please reload the page or contact FOROZ support.";

export async function readApiJson<T>(response: Response): Promise<T> {
  const type = (response.headers.get("Content-Type") || "")
    .split(";", 1)[0]
    .trim()
    .toLowerCase();
  if (
    type !== "application/json" &&
    !(type.startsWith("application/") && type.endsWith("+json"))
  ) {
    throw new Error(unexpectedResponse);
  }
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error(unexpectedResponse);
  }
}

async function readSession(response: Response) {
  const data = await readApiJson<{
    access?: unknown;
    user?: SessionUser;
  } | null>(response);
  if (
    typeof data?.access !== "string" ||
    !data.access ||
    !data.user ||
    typeof data.user.id !== "number"
  ) {
    throw new Error(unexpectedResponse);
  }
  return { access: data.access, user: data.user };
}

async function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (init.signal?.aborted) controller.abort();
  init.signal?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(abort, 15000);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
    init.signal?.removeEventListener("abort", abort);
  }
}
async function authPost(path: string, body: unknown = {}): Promise<Response> {
  for (let attempt = 0; attempt < 2; attempt++) {
    const csrfResponse = await timedFetch("/api/auth/csrf/", {
      credentials: "include",
    });
    if (!csrfResponse.ok)
      throw new Error("Sign-in service is unavailable. Please try again.");
    const data = await readApiJson<{ csrf_token?: unknown } | null>(
      csrfResponse,
    );
    if (typeof data?.csrf_token !== "string" || !data.csrf_token)
      throw new Error(unexpectedResponse);
    const csrf_token = data.csrf_token;
    const response = await timedFetch(`/api/auth/${path}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
      },
      body: JSON.stringify(body),
    });
    if (response.status !== 403 || attempt === 1) return response;
  }
  throw new Error("Request could not be verified.");
}
export async function responseError(response: Response): Promise<string> {
  const data = await response.json().catch(() => null);
  if (!data) return `Service request failed (${response.status}).`;
  if (typeof data.detail === "string") return data.detail;
  if (typeof data.error === "string") return data.error;
  return Object.entries(data)
    .map(
      ([field, value]) =>
        `${field}: ${Array.isArray(value) ? value.join(", ") : String(value)}`,
    )
    .join("; ");
}
export async function refreshSession(): Promise<SessionUser | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await authPost("refresh");
      if (!response.ok) {
        accessToken = null;
        changed(null);
        return null;
      }
      const data = await readSession(response);
      accessToken = data.access;
      changed(data.user);
      return data.user as SessionUser;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
export async function signIn(
  identifier: string,
  password: string,
  application: "lms" | "dashboard",
): Promise<SessionUser> {
  const response = await authPost("login", {
    identifier,
    password,
    application,
  });
  if (!response.ok) throw new Error(await responseError(response));
  const data = await readSession(response);
  accessToken = data.access;
  changed(data.user);
  return data.user;
}
export async function signOut(): Promise<void> {
  try {
    const response = await authPost("logout");
    if (!response.ok) throw new Error(await responseError(response));
  } finally {
    accessToken = null;
    changed(null);
  }
}
export async function fetchWithSession(
  url: string,
  init: RequestInit = {},
  anonymous = false,
): Promise<Response> {
  const target = new URL(url, window.location.origin);
  const allowed =
    target.origin === window.location.origin ||
    [
      "https://foroz.vercel.app",
      "https://foroz.me",
      "https://www.foroz.me",
    ].includes(target.origin);
  if (!allowed) throw new Error("Untrusted API origin.");
  if (!anonymous && !accessToken) await refreshSession();
  const headers = new Headers(init.headers);
  if (!anonymous && accessToken)
    headers.set("Authorization", `Bearer ${accessToken}`);
  let response = await timedFetch(url, {
    ...init,
    headers,
    credentials: "include",
  });
  if (!anonymous && response.status === 401) {
    const user = await refreshSession();
    if (user && accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
      response = await timedFetch(url, {
        ...init,
        headers,
        credentials: "include",
      });
    }
  }
  // A renewed token can still be rejected (for example after revocation).
  // End the local session after the single retry instead of leaving the UI
  // authenticated with credentials the server no longer accepts.
  if (!anonymous && response.status === 401 && (accessToken || currentUser)) {
    accessToken = null;
    changed(null);
  }
  if (!anonymous && response.status === 403)
    await refreshSession().catch(() => null);
  return response;
}
export async function educationRequest<T>(
  path: string,
  init: RequestInit = {},
  anonymous = false,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData))
    headers.set("Content-Type", "application/json");
  const response = await fetchWithSession(
    `/api/backend/lms/v1${path}`,
    { ...init, headers },
    anonymous,
  );
  if (!response.ok) throw new Error(await responseError(response));
  return response.status === 204 ? (undefined as T) : readApiJson<T>(response);
}
export async function downloadEducation(path: string) {
  const response = await fetchWithSession(`/api/backend/lms/v1${path}`);
  if (!response.ok) throw new Error(await responseError(response));
  if (response.headers.get("content-type")?.includes("application/json")) {
    const data = await readApiJson<{ url: string }>(response);
    window.open(data.url, "_blank", "noopener,noreferrer");
    return;
  }
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download =
    response.headers
      .get("content-disposition")
      ?.match(/filename="([^"]+)"/)?.[1] || "FOROZ-document";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

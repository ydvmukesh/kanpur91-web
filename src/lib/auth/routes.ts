export const PUBLIC_PATHS = [
  "/",
  "/login",
  "/register",
  "/forgot",
  "/privacy",
  "/download",
  "/customer-service",
  "/home",
  "/activity",
  "/promotion",
] as const;

export const AUTH_ONLY_PATHS = ["/login", "/register"] as const;

export function normalizePath(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const path = pathname.split("?")[0]?.replace(/\/+$/, "") || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function isPublic(pathname: string | null | undefined): boolean {
  const path = normalizePath(pathname);
  if ((PUBLIC_PATHS as readonly string[]).includes(path)) return true;
  return path.startsWith("/activity/ActivityDetail/");
}

export function isAuthOnly(pathname: string | null | undefined): boolean {
  return (AUTH_ONLY_PATHS as readonly string[]).includes(normalizePath(pathname));
}

export function safeNext(next: string | null | undefined): string {
  if (!next) return "/";
  const raw = next.trim();
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) return "/";
  const [pathPart, query] = raw.split("?");
  const clean = normalizePath(pathPart);
  if (isAuthOnly(clean) || clean === "/") return "/";
  return query ? `${clean}?${query}` : clean;
}

export function loginUrl(next?: string | null): string {
  const safe = safeNext(next);
  return safe === "/" ? "/login" : `/login?next=${encodeURIComponent(safe)}`;
}

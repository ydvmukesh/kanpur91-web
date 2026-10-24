import { API_URL, USE_MOCK } from "./env";
import { getToken } from "./token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Options = RequestInit & { token?: string };

export async function apiFetch<T>(path: string, init: Options = {}): Promise<T> {
  if (USE_MOCK) {
    throw new ApiError(501, "Live API is not configured");
  }

  const { token = getToken(), headers, ...rest } = init;
  const res = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { message?: string } | null;
    throw new ApiError(res.status, body?.message || res.statusText);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

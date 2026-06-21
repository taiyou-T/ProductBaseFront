import { ApiError, apiErrorFromBody } from "@/lib/api-error";

function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
}

export { ApiError, getApiErrorMessage } from "@/lib/api-error";

export async function api<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body instanceof FormData
      ? {}
      : options.body
        ? { "Content-Type": "application/json" }
        : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) ?? {}),
  };

  const res = await fetch(`${getApiUrl()}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw apiErrorFromBody(res.status, err);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

export async function serverApi<T>(
  path: string,
  revalidate = 60,
): Promise<T> {
  const res = await fetch(`${getApiUrl()}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${path}`);
  }

  return res.json() as Promise<T>;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

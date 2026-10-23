const BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://haggaibe.onrender.com/api/v1"
).replace(/\/+$/, "");

const TOKEN_KEY = "haggai_admin_token";

export const SESSION_EXPIRED = "haggai-admin-session-expired";

export const getToken = () => sessionStorage.getItem(TOKEN_KEY);

export const saveToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
};

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(
  path,
  {
    body,
    authenticated = false,
    expireOnUnauthorized = true,
    signal,
    ...options
  } = {}
) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  const token = authenticated ? getToken() : null;

  if (authenticated && !token) {
    window.dispatchEvent(new Event(SESSION_EXPIRED));
    throw new ApiError("Please sign in to continue.", 401);
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const multipart = body instanceof FormData;

  if (multipart) {
    headers.delete("Content-Type");
  } else if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const controller = new AbortController();
  const forwardAbort = () => controller.abort();

  signal?.addEventListener("abort", forwardAbort, { once: true });

  if (signal?.aborted) controller.abort();

  const timer = setTimeout(() => controller.abort(), 120000);

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
      body:
        body === undefined
          ? undefined
          : multipart
            ? body
            : JSON.stringify(body),
    });

    let payload = null;

    if (response.status !== 204) {
      try {
        payload = await response.json();
      } catch {
        // Invalid responses are handled below.
      }
    }

    if (
      response.status === 401 &&
      authenticated &&
      expireOnUnauthorized &&
      getToken() === token
    ) {
      clearToken();
      window.dispatchEvent(new Event(SESSION_EXPIRED));
    }

    if (!response.ok || payload?.success === false) {
      const message =
        typeof payload?.message === "string"
          ? payload.message
          : typeof payload?.error === "string"
            ? payload.error
            : `Request failed (${response.status}).`;

      throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
      return { success: true };
    }

    if (!payload) {
      throw new ApiError(
        "The server returned an unexpected response.",
        response.status
      );
    }

    return payload;
  } catch (error) {
    if (signal?.aborted) throw error;

    if (error.name === "AbortError") {
      throw new ApiError(
        "The request timed out. The change may have reached the server. Refresh and check before submitting again.",
        0
      );
    }

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      "Cannot reach the server. Check your connection. If you submitted a change, check its result before retrying.",
      0
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", forwardAbort);
  }
}
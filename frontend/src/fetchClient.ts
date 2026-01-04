/**
 * Simple HTTP client wrapper for API calls
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Core request function - handles all HTTP methods
 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${BACKEND_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.detail || 'An unknown error occurred');
  }

  return response.json();
};

/**
 * API object with common HTTP methods
 */
export const api = {
  get: <T>(endpoint: string, headers?: Record<string, string>) => request<T>(endpoint, {
    headers: { 'Content-Type': 'application/json', ...headers },
  }),

  post: <T>(endpoint: string, body?: unknown, headers?: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      headers: { 'Content-Type': 'application/json', ...headers },
    }),

  /**
   * POST request with form data (application/x-www-form-urlencoded)
   * Used for OAuth2 token endpoints that expect form data instead of JSON
   */
  postForm: <T>(endpoint: string, data: Record<string, string>) =>
    request<T>(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString(),
    }),
};

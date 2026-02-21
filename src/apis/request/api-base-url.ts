/**
 * API base URL per TanStack Start environment variable rules:
 * - Client: VITE_ prefix only (import.meta.env.VITE_API_URL) — baked at build time.
 * - Server (SSR): server-only variable process.env.API_SERVER_URL — never exposed to client.
 * @see https://tanstack.com/start/latest/docs/framework/react/guide/environment-variables
 */
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return import.meta.env.VITE_API_URL ?? ''
  }
  return process.env.API_SERVER_URL ?? 'http://backend:5000/api'
}

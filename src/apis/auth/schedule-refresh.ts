/**
 * Proactive token refresh before expiry (e.g. access token expires in 2s).
 * Schedules a refresh so the next request never hits 401.
 */

import { refreshToken } from './refresh-token'
import { useAuthStore } from '@/stores/auth'

let refreshTimeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * Decode JWT payload and return exp (seconds since epoch). Returns null if not a JWT or invalid.
 */
function getExpFromToken(token: string): number | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const parsed = JSON.parse(decoded) as { exp?: number }
    return typeof parsed.exp === 'number' ? parsed.exp : null
  } catch {
    return null
  }
}

/**
 * Schedule a single refresh to run shortly before the access token expires.
 * Call after login and after each successful refresh in the 401 interceptor.
 */
export function scheduleProactiveRefresh(): void {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }

  const accessToken = useAuthStore.getState().accessToken
  if (!accessToken) return

  const exp = getExpFromToken(accessToken)
  if (exp == null) return

  const expMs = exp * 1000
  const now = Date.now()
  const bufferMs = 1000 // refresh 1s before expiry (for 2s token, refresh at ~1s)
  const delayMs = Math.max(0, expMs - now - bufferMs)

  refreshTimeoutId = setTimeout(async () => {
    refreshTimeoutId = null
    try {
      const res = await refreshToken()
      if (res?.accessToken) {
        useAuthStore.getState().setAccessToken(res.accessToken)
        scheduleProactiveRefresh()
      }
    } catch {
      // Rely on 401 interceptor for next request
    }
  }, delayMs)
}

/**
 * Clear any scheduled refresh. Call on logout.
 */
export function clearScheduledRefresh(): void {
  if (refreshTimeoutId) {
    clearTimeout(refreshTimeoutId)
    refreshTimeoutId = null
  }
}

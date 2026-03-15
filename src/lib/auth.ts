import { createServerFn } from '@tanstack/react-start'
import { deleteCookie } from '@tanstack/react-start/server'
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@/constants/auth'
import { getAuthCookieOptions } from '@/lib/cookie-options'

export const clearServerCredentials = createServerFn().handler(() => {
  const cookieOptions = getAuthCookieOptions() as Parameters<
    typeof deleteCookie
  >[1]
  deleteCookie(REFRESH_TOKEN_NAME, cookieOptions)
  deleteCookie(ACCESS_TOKEN_NAME, cookieOptions)
})

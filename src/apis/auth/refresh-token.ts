import { getCookie } from '@tanstack/react-start/server'
import { createServerFn } from '@tanstack/react-start'
import { request } from '../request'

export const refreshToken = createServerFn().handler(async () => {
  const existingRefreshToken = getCookie('refreshToken')

  if (!existingRefreshToken) {
    return null
  }

  const response = await request<{ accessToken: string }>({
    method: 'POST',
    data: {
      refreshToken: existingRefreshToken,
    },
    url: '/auth/refresh',
  })

  return response
})

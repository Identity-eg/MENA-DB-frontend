import { useAuthStore } from '@/stores/auth'
import { createServerFn } from '@tanstack/react-start'
import { deleteCookie, getCookie } from '@tanstack/react-start/server'
import z from 'zod'

export const clearServerCredentials = createServerFn().handler(async () => {
  useAuthStore.getState().clearAccessToken()
  deleteCookie('refreshToken')
})

export const useClearClientCredentials = () => {
  const { clearAccessToken } = useAuthStore()
  return clearAccessToken
}

// Set Credentials
export const useSetClientAccessToken = () => {
  const { setAccessToken } = useAuthStore()
  return setAccessToken
}

export const setServerCredentials = createServerFn()
  .inputValidator(
    z.object({
      accessToken: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    useAuthStore.getState().setAccessToken(data.accessToken)
  })

// Get Credentials
export const getServerAccessToken = createServerFn().handler(() => {
  return useAuthStore.getState().accessToken
})

export const getServerRefreshToken = createServerFn().handler(() => {
  return getCookie('refreshToken')
})

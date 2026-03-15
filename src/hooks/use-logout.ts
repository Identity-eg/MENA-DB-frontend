import { useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { clearServerCredentials } from '@/lib/auth'
import { useAuthStore } from '@/stores/auth'

export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { clearAccessToken } = useAuthStore()

  return async () => {
    await clearServerCredentials()
    await router.navigate({ to: '/', replace: true })

    clearAccessToken()
    queryClient.clear()
    router.invalidate()
  }
}

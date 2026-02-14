import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { request } from '../request'

const register = async ({ email, name }: { email: string; name: string }) => {
  await request<{ accessToken: string }>({
    url: '/auth/register',
    method: 'POST',
    data: { email, name },
  })
}

export const useRegister = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate({ to: '/auth/pending-verification' })
    },
  })
}

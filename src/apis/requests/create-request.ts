import { useMutation, useQueryClient } from '@tanstack/react-query'
import { request } from '../request'
import type {
  CompanyRequestCreated,
  CreateCompanyRequestPayload,
} from '@/types/company-request'
import type { TApiResponseSingle } from '@/types/api-response-single'

type CreateRequestData = TApiResponseSingle<CompanyRequestCreated>

export const createRequest = async (payload: CreateCompanyRequestPayload) => {
  const data = await request<CreateRequestData>({
    url: '/requests',
    method: 'POST',
    data: payload,
  })
  return data
}

export const useCreateRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] })
    },
  })
}

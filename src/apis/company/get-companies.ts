import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { request } from '../request'
import type { TCompany } from '@/types/company'
import type { TApiResponsePaginated } from '@/types/api-response-paginated'

type GetCompaniesData = TApiResponsePaginated<TCompany>
type GetCompaniesQueryOptionsOverride = Omit<
  Parameters<typeof useSuspenseQuery<GetCompaniesData>>[0],
  'queryKey' | 'queryFn'
>

export type GetCompaniesParams = {
  q?: string
  limit?: number
  offset?: number
}

export const getCompanies = async ({
  q,
  limit = 50,
  offset = 0,
}: GetCompaniesParams) => {
  const data = await request<TApiResponsePaginated<TCompany>>({
    url: '/companies/search',
    params: {
      q,
      limit,
      offset,
    },
  })
  return data
}

export const getCompaniesQueryOptions = (
  params: GetCompaniesParams,
  options?: GetCompaniesQueryOptionsOverride,
) =>
  queryOptions({
    queryKey: ['companies', params.q, params.limit, params.offset],
    queryFn: () => getCompanies(params),
    staleTime: 5 * 60 * 1000,
    ...options,
  })

export const useGetCompanies = (
  params: GetCompaniesParams,
  options?: GetCompaniesQueryOptionsOverride,
) => {
  return useSuspenseQuery(getCompaniesQueryOptions(params, options))
}

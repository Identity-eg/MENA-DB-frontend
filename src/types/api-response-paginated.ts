export type TApiResponsePaginated<T> = {
  success: boolean
  data: Array<T>
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

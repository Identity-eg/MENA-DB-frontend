export type TReport = {
  id: number
  name: string
  description: string
  turnaround: string
  totalEstimatedPrice: number
  isActive?: boolean
  country?: {
    code: string
    nameEn: string
    nameAr: string
  }
}

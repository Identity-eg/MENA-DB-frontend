export type TReport = {
  id: number
  name: string
  description: string
  turnaround: string
  estimatedPrice: number
  isActive?: boolean
  country?: {
    code: string
    nameEn: string
    nameAr: string
  }
}

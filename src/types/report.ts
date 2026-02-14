export type TReport = {
  id: number
  name: string
  description: string
  turnaround: string
  price: number
  isActive?: boolean
  country?: {
    code: string
    nameEn: string
    nameAr: string
  }
}

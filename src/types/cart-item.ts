export type TCartItem = {
  id: number
  reportId: number
  report: {
    id: number
    name: string
    description: string
    turnaround: string
  }
  companyId: number
  company: {
    id: number
    nameEn: string
    nameAr: string | null
  }
  quantity: number
  price: number
  language: string | null
  createdAt: string
}

import type { TCompany } from './company'

export type TLockedField = {
  id: number
  companyId: string
  lockedTypeId: number
  lockedType: {
    fieldName: string
  }
  price: number
  company: TCompany
  unlocks: Array<{
    id: number
    userId: number
  }>
}

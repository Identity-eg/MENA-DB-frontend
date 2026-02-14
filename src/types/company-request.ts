import type { ValueOf } from './value-of'

/** Payload for creating a company request (screening package) */
export type CreateCompanyRequestPayload = {
  companyId: number
  reportIds: Array<number>
  notes?: string | null
}

/** Minimal shape of the created request returned by POST /api/requests */
export type CompanyRequestCreated = {
  id: number
  userId: number
  companyId: number
  status: string
  estimatedPrice: number
  finalPrice: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

/** Backend request status enum values */
export const REQUEST_STATUS = {
  UNDER_REVIEW: 'UNDER_REVIEW',
  INVOICE_GENERATED: 'INVOICE_GENERATED',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
} as const

export type RequestStatusValue = ValueOf<typeof REQUEST_STATUS>

/** Single request from GET /api/requests/:id */
export type CompanyRequestDetail = {
  id: number
  userId: number
  companyId: number
  status: RequestStatusValue
  estimatedPrice: number
  finalPrice: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  company: {
    id: number
    nameEn: string
    nameAr: string | null
    registrationNumber: string
    industry: string
    countryCode: string
  }
  reports: Array<{
    id: number
    name: string
    description: string
    turnaround: string
    estimatedPrice: number
  }>
}

/** One item from GET /api/requests list */
export type CompanyRequestListItem = {
  id: number
  userId: number
  companyId: number
  status: RequestStatusValue
  estimatedPrice: number
  finalPrice: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  company: {
    id: number
    nameEn: string
    nameAr: string | null
  }
  reports: Array<{
    id: number
    name: string
    description: string
    turnaround: string
    estimatedPrice: number
  }>
}

import type { ValueOf } from './value-of'
import type { TIndividual } from './individual'
import type { TCompany } from './company'
import type { TReport } from './report'

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

/** Minimal company shape in request list/detail */
export type TRequestCompany = {
  id: number
  nameEn: string
  nameAr: string | null
}

/** Per-company report selection when creating a request */
export type CreateRequestCompanyItem = {
  companyId: number
  reportIds: Array<number>
}

/** Per-individual data + report selection when creating a request */
export type CreateRequestIndividualItem = {
  fullName: string
  email?: string | null
  phone?: string | null
  position?: string | null
  nationality?: string | null
  dateOfBirth?: string | null
  idNumber?: string | null
  address?: string | null
  city?: string | null
  countryCode?: string | null
  reportIds: Array<number>
}

/** Payload for creating a request (per-company and per-individual report selection) */
export type CreateCompanyRequestPayload = {
  companyReports?: Array<CreateRequestCompanyItem>
  individuals?: Array<CreateRequestIndividualItem>
  notes?: string | null
}

/** Report shape as included in request list/detail */
export type RequestReport = {
  id: number
  name: string
  description: string
  turnaround: string
  estimatedPrice: number
  isActive?: boolean
}

/** Single request from GET /api/requests/:id */
export type TRequest = {
  id: number
  userId: number
  status: RequestStatusValue
  estimatedPrice: number
  finalPrice: number | null
  notes: string | null
  createdAt: string
  updatedAt: string
  companies: Array<TCompany>
  individuals: Array<TIndividual>
  reports: Array<TReport>
}

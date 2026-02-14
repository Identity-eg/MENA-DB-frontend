import type { ValueOf } from './value-of'

export const USER_ROLES = {
  user: 'USER',
  admin: 'ADMIN',
} as const

export type TUser = {
  id: number
  email: string
  name: string
  role: ValueOf<typeof USER_ROLES>
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

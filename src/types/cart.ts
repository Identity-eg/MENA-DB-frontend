import type { TCartItem } from './cart-item'

export type TCart = {
  id: number
  items: TCartItem[]
  subtotal: number
  tax: number
  total: number
  itemCount: number
}

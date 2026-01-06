export interface IVendorPageCoupon {
  startsAt: any
  id: number
  documentId: string
  code: string
  type: string
  value: number
  minSubtotal: number
  maxDiscount: number
  endsAt: any
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  scope: string
  firstOrderOnly: any
  freeDelivery: any
  usageLimit: any
  perUserLimit: any
}

export interface ICartItems {
  id: number
  documentId: string
  discount: number
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  user: User
  businessType: BusinessType
  vendor: Vendor
  coupon: any
  items: Item[]
}

export interface User {
  id: number
  documentId: string
  username: string
  email: string
  provider: string
  password: any
  resetPasswordToken: any
  confirmationToken: any
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  accountType: string
  phone: any
  walletBalance: number
  loyaltyPoints: number
}

export interface BusinessType {
  id: number
  documentId: string
  name: string
  slug: string
  homeTitle: string
  description: string
  layoutType: string
  orderMode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

export interface Vendor {
  id: number
  documentId: string
  name: string
  slug: string
  description: string
  rating: number
  isOpen: boolean
  deliveryTime: string
  deliveryFee: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  commissionType: any
  commissionValue: any
  saleMode: any
}

export interface Item {
  id: number
  documentId: string
  quantity: number
  selectedOptions: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  product: Product
  variant: any
  vendor: Vendor3
}

export interface Product {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  basePrice: number
  baseSalePrice: any
  sku: string
  stock: number
  isFeatured: boolean
  isActive: boolean
  attributes: Attributes
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  vendor: Vendor2
  businessType: BusinessType2
  category: Category
  images: any
}

export interface Attributes {
  spicyLevel: number
}

export interface Vendor2 {
  id: number
  documentId: string
  name: string
  slug: string
  description: string
  rating: number
  isOpen: boolean
  deliveryTime: string
  deliveryFee: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  commissionType: any
  commissionValue: any
  saleMode: any
}

export interface BusinessType2 {
  id: number
  documentId: string
  name: string
  slug: string
  homeTitle: string
  description: string
  layoutType: string
  orderMode: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

export interface Category {
  id: number
  documentId: string
  name: string
  slug: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

export interface Vendor3 {
  id: number
  documentId: string
  name: string
  slug: string
  description: string
  rating: number
  isOpen: boolean
  deliveryTime: string
  deliveryFee: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  commissionType: any
  commissionValue: any
  saleMode: any
}

export interface IWishList {
  createdAt: string
  id: number
  documentId: string
  updatedAt: string
  publishedAt: string
  locale: any
  product: Product
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
  images: any
  vendor: Vendor
  variants: any[]
  optionGroups: any[]
}

export interface Attributes {
  spicyLevel: number
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

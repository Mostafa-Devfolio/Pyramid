export interface IRelatedAndDiscounted {
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
  variants: any[]
  optionGroups: any[]
  vendor: Vendor
  category: Category
  businessType: BusinessType
  ratingAverage: number
  ratingCount: number
  reviews: Review[]
  relatedProducts: RelatedProduct[]
  vendorRandomProducts: VendorRandomProduct[]
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
  commissionType: any
  commissionValue: any
  saleMode: any
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
}

export interface Review {
  createdAt: string
  id: number
  documentId: string
  rating: number
  comment: string
  isApproved: boolean
  updatedAt: string
  publishedAt: string
  locale: any
  user: User
}

export interface User {
  id: number
  username: string
}

export interface RelatedProduct {
  createdAt: string
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
  attributes: Attributes2
  updatedAt: string
  publishedAt: string
  locale: string
  images: any
  vendor: Vendor2
  category: Category2
  businessType: BusinessType2
}

export interface Attributes2 {
  spicyLevel: number
}

export interface Vendor2 {
  id: number
  name: string
  slug: string
}

export interface Category2 {
  id: number
  name: string
  slug: string
}

export interface BusinessType2 {
  id: number
  name: string
  slug: string
}

export interface VendorRandomProduct {
  createdAt: string
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  basePrice: number
  baseSalePrice?: number
  sku: string
  stock: number
  isFeatured: boolean
  isActive: boolean
  attributes: Attributes3
  updatedAt: string
  publishedAt: string
  locale: string
  images: any
  vendor: Vendor3
  category: Category3
}

export interface Attributes3 {
  spicyLevel: number
}

export interface Vendor3 {
  id: number
  name: string
  slug: string
}

export interface Category3 {
  id: number
  name: string
  slug: string
}

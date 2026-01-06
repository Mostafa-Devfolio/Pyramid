export interface ICategoryHome {
  id: number
  documentId: string
  name: string
  slug: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  homeImage: any
  vendorImage: any
  businessType: BusinessType
  parent: any
  children: Children[]
  products: Product[]
  vendors: Vendor[]
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

export interface Children {
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

export interface Product {
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
  attributes: Attributes
  createdAt: string
  updatedAt: string
  publishedAt: string
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
}

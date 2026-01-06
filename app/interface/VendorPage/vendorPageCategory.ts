export interface IVendorPageCategory {
  order: number
  id: number
  documentId: string
  name: string
  slug: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  homeImage: HomeImage
  vendorImage: any
  businessType: BusinessType
  parent: any
  children: Children[]
  products: Product[]
  vendors: Vendor[]
}

export interface HomeImage {
  id: number
  documentId: string
  name: string
  alternativeText: any
  caption: any
  width: number
  height: number
  formats: Formats
  hash: string
  ext: string
  mime: string
  size: number
  url: string
  previewUrl: any
  provider: string
  provider_metadata: any
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Formats {
  thumbnail: Thumbnail
}

export interface Thumbnail {
  name: string
  hash: string
  ext: string
  mime: string
  path: any
  width: number
  height: number
  size: number
  sizeInBytes: number
  url: string
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

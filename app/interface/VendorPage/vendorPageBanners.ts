export interface IVendorPageBanner {
  order: number
  id: number
  documentId: string
  title: string
  slug: string
  placement: string
  targetType: string
  targetUrl: any
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  targetCategory: any
  targetVendor: any
  targetProduct: TargetProduct
  image: Image
  businessType: BusinessType
  vendor: Vendor
}

export interface TargetProduct {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  basePrice: number
  baseSalePrice: number
  sku: string
  stock: any
  isFeatured: boolean
  isActive: boolean
  attributes: any
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Image {
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

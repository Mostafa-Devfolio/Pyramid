export interface IProductDetailsPage {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  basePrice: number
  baseSalePrice: number
  sku: string
  stock: number
  isFeatured: boolean
  isActive: boolean
  attributes: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string
  variants: Variant[]
  optionGroups: OptionGroup[]
  vendor: Vendor
  category: Category
  reviews: any[]
  ratingAverage: number
  ratingCount: number
  shortDescription: string
}

export interface Variant {
  id: number
  documentId: string
  price: number
  salePrice: number
  stock: number
  options: Option[]
}

export interface Option {
  id: number
  documentId: string
  label: string
  group: Group
}

export interface Group {
  id: number
  documentId: string
  name: string
}

export interface OptionGroup {
  id: number
  documentId: string
  name: string
  slug: string
  isRequired: boolean
  multiSelect: boolean
  minSelect: number
  maxSelect?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  options: Option2[]
}

export interface Option2 {
  id: number
  documentId: string
  label: string
  value: any
  price: number
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

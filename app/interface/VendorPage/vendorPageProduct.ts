export interface IVendorPageProduct {
  createdAt: string
  id: number
  title: string
  slug: string
  basePrice: number
  baseSalePrice: number
  stock: number
  isFeatured: boolean
  images: any
  vendor: Vendor
  brand: any
}

export interface Vendor {
  id: number
  name: string
  slug: string
}

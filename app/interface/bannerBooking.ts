export interface IBannerBooking {
  id: number
  documentId: string
  title: string
  slug: string
  placement: any
  targetType: any
  targetUrl: any
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  module: string
  section: string
  targetProperty: TargetProperty
  targetCategory: any
  targetVendor: any
  targetProduct: any
  image: Image
  businessType: any
  secondaryBusinessType: any
  tertiaryBusinessType: any
  vendor: any
  createdBy: CreatedBy
  updatedBy: UpdatedBy
  localizations: any[]
}

export interface TargetProperty {
  id: number
  documentId: string
  name: string
  propertyType: string
  description: string
  starRating: number
  address: string
  latitude: number
  longitude: number
  amenities: string[]
  availableAddons: AvailableAddon[]
  createdAt: string
  updatedAt: string
  publishedAt: any
  locale: any
  country: string
  city: string
  isFeatured: any
  paymentRequirement: any
}

export interface AvailableAddon {
  addonId: string
  name: string
  price: number
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
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
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

export interface CreatedBy {
  id: number
  documentId: string
  firstname: string
  lastname: string
  username: any
  email: string
  password: string
  resetPasswordToken: any
  registrationToken: any
  isActive: boolean
  blocked: boolean
  preferedLanguage: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

export interface UpdatedBy {
  id: number
  documentId: string
  firstname: string
  lastname: string
  username: any
  email: string
  password: string
  resetPasswordToken: any
  registrationToken: any
  isActive: boolean
  blocked: boolean
  preferedLanguage: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

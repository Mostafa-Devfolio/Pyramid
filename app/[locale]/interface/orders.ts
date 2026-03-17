export interface IOrders {
  id: number
  documentId: string
  status: string
  paymentMethod: string
  subtotal: number
  deliveryFee: number
  discount: number
  total: number
  couponSnapshot: any
  addressSnapshot: AddressSnapshot
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  currencySnapshot: CurrencySnapshot
  paymentStatus: string
  walletUsedAmount: number
  amountDue: number
  deliverTo: string
  recipientName: any
  recipientPhone: any
  tipAmount: number
  customerNote: any
  loyaltyAwarded: boolean
  loyaltyPointsAwarded: number
  deliveryTimingType: string
  deliveryAfterMinutes: any
  deliveryScheduledAt: any
  deliveryWindowDate: any
  deliveryWindowStart: any
  deliveryWindowEnd: any
  deliverySlotSnapshot: any
  deliveryInstructions: any
  fulfillmentStatus: string
  returnRequested: boolean
  isSubscriptionOrder: boolean
  address: Address2
  subscription: any
  subOrders: SubOrder[]
}

export interface AddressSnapshot {
  id: number
  documentId: string
  label: string
  city: string
  street: string
  building: string
  notes: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  isDefault: boolean
  latitude: number
  longitude: number
  formattedAddress: string
  placeId: any
  mapProvider: string
  geoData: GeoData
  country: string
  state: string
  postalCode: string
  buildingNumber: any
  floor: string
  apartment: string
  user: User
}

export interface GeoData {
  provider: string
  latitude: number
  longitude: number
  formattedAddress: string
  placeId: string
  country: string
  state: string
  city: string
  postalCode: string
  street: string
  raw: Raw
}

export interface Raw {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  category: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: Address
  boundingbox: string[]
}

export interface Address {
  house_number: string
  road: string
  neighbourhood: string
  suburb: string
  city: string
  state: string
  "ISO3166-2-lvl4": string
  postcode: string
  country: string
  country_code: string
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

export interface CurrencySnapshot {
  id: number
  code: string
  symbol: string
  symbolPosition: string
  decimalPlaces: number
  name: string
}

export interface Address2 {
  id: number
  documentId: string
  label: string
  city: string
  street: string
  building: string
  notes: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  isDefault: boolean
  latitude: number
  longitude: number
  formattedAddress: string
  placeId: any
  mapProvider: string
  geoData: GeoData2
  country: string
  state: string
  postalCode: string
  buildingNumber: any
  floor: string
  apartment: string
}

export interface GeoData2 {
  provider: string
  latitude: number
  longitude: number
  formattedAddress: string
  placeId: string
  country: string
  state: string
  city: string
  postalCode: string
  street: string
  raw: Raw2
}

export interface Raw2 {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  lat: string
  lon: string
  category: string
  type: string
  place_rank: number
  importance: number
  addresstype: string
  name: string
  display_name: string
  address: Address3
  boundingbox: string[]
}

export interface Address3 {
  house_number: string
  road: string
  neighbourhood: string
  suburb: string
  city: string
  state: string
  "ISO3166-2-lvl4": string
  postcode: string
  country: string
  country_code: string
}

export interface SubOrder {
  id: number
  documentId: string
  status: string
  subtotal: number
  deliveryFee: number
  total: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  vendorNote: any
  tipAmount: number
  deliveryTimingType: string
  deliveryAfterMinutes: any
  deliveryScheduledAt: any
  deliveryWindowDate: any
  deliveryWindowStart: any
  deliveryWindowEnd: any
  deliverySlotSnapshot: any
  deliveryInstructions: any
  deliveredAt: any
  cancelledAt: any
  returnedAt: any
  deliveryManSnapshot: any
  returnRequested: boolean
  vendor: Vendor
  deliveryMan: any
  items: Item[]
  alreadyReviewed: boolean
  userReview: any
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
  logo: any
  coverImage: any
}

export interface Item {
  id: number
  documentId: string
  titleSnapshot: string
  skuSnapshot: string
  unitPriceSnapshot: number
  quantity: number
  selectedOptions: any
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  product: Product
  variant: any
  alreadyReviewed: boolean
  userReview: any
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
}

export interface Attributes {
  spicyLevel: number
}

export interface ILoyalty {
  createdAt: string
  id: number
  documentId: string
  type: string
  points: number
  moneyAmount: any
  currency: any
  description: string
  metadata: any
  updatedAt: string
  publishedAt: string
  locale: any
  order: Order
  withdrawal: any
}

export interface Order {
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


export interface ILoyaltyT {
  loyaltyPoints: number
  walletBalance: number
}

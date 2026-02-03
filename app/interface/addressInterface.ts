export interface IAddress {
  isDefault: boolean
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
  latitude: any
  longitude: any
  formattedAddress: any
  placeId: any
  mapProvider: any
  geoData: any
  country: any
  state: any
  postalCode: any
  buildingNumber: any
  floor: string
  apartment: string
}
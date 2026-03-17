export interface IParcelOrders {
  createdAt: string
  id: number
  documentId: string
  pickupLocation: PickupLocation
  dropoffLocation: DropoffLocation
  receiverName: string
  receiverPhone: string
  distanceKm: number
  deliveryFee: number
  deliveryStatus: string
  paymentMethod: string
  paymentStatus: string
  scheduledAt: any
  updatedAt: string
  publishedAt: string
  locale: any
  senderName: string
  senderPhone: string
  senderAddress: string
  recipientName: string
  recipientPhone: string
  recipientAddress: string
  payer: string
  generalNotes: string
  pickupLat: number
  pickupLng: number
  dropoffLat: number
  dropoffLng: number
  estimatedPrice: number
  parcelTypeString: string
  parcelType: any
}

export interface PickupLocation {
  lat: number
  lng: number
  address: string
}

export interface DropoffLocation {
  lat: number
  lng: number
  address: string
}

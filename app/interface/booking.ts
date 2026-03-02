export interface IBooking {
  id: number;
  documentId: string;
  name: string;
  propertyType: string;
  description: string;
  starRating: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: any;
  availableAddons: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ISearchProperty {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  rooms: number;
  propertyType: string | null;
    minStarRating: number | null;
  lat: number | null;
  lng: number | null;
  radiusKm: number;
}

export interface ISearchBooking {
  id: number
  name: string
  propertyType: string
  city: string
  government: string
  address: string
  latitude: number
  longitude: number
  distanceKm: number
  distanceFromCityCenterKm: number
  nearbyLandmark: string
  landmarkName: string
  landmarkDistance: string
  isFeatured: boolean
  isNewlyAdded: boolean
  isHighestRated: boolean
  images: string[]
  thumbnailUrl: string
  starRating: number
  userReviewScore: number
  reviewWord: string
  totalReviews: number
  numberOfNights: number
  totalStayPrice: number
  taxesAndFees: number
  bestOptionSummary: BestOptionSummary
  paymentPolicy: string
  propertyAmenitiesPreview: string[]
  availableRooms: AvailableRoom[]
}

export interface BestOptionSummary {
  roomsLeft: number
  sizeSqm: number
  bedConfiguration: string
  isFreeCancellation: boolean
}

export interface AvailableRoom {
  id: number
  name: string
  basePricePerNight: number
  totalRoomPrice: number
  maxGuests: number
  sizeSqm: number
  bedConfiguration: string
  roomAmenities: string[]
  cancellationPolicy: string
  availableUnits: number
}

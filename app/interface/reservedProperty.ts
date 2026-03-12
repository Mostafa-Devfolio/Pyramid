export interface IReserved {
  id: number;
  documentId: string;
  checkInDate: string;
  checkOutDate: string;
  bookedRooms: BookedRoom[];
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  cancellationPolicyApplied: any;
  isKycVerified: boolean;
  specialRequests: string;
  selectedAddons: any;
  externalId: any;
  externalSource: any;
  guestFirstName: string;
  guestLastName: string;
  guestEmail: string;
  guestPhone: string;
  bookingFor: string;
  travelForWork: boolean;
  arrivalTime: string;
  airportShuttleRequested: boolean;
  rentalCarRequested: boolean;
  airportTaxiRequested: boolean;
  paperlessConfirmation: boolean;
  property: Property;
  guestIdDocuments: any;
}

export interface BookedRoom {
  roomTypeId: number;
  rateId: string;
  quantity: number;
  price: number;
  mealPlan: string;
}

export interface Property {
  id: number;
  documentId: string;
  name: string;
  propertyType: string;
  description: string;
  starRating: number;
  address: string;
  latitude: number;
  longitude: number;
  amenities: string[];
  availableAddons: AvailableAddon[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  country: string;
  city: string;
  isFeatured: boolean;
  paymentRequirement: string;
  slug: string;
  houseRules: any;
  facilitiesCategories: any;
  surroundings: any;
  sustainability: any;
  highlights: any;
  faqs: any;
  topFacilities: any;
  languagesSpoken: any;
  importantInformation: any;
  offersAirportShuttle: any;
  offersCarRental: any;
  offersAirportTaxi: any;
  earlyBookerDiscountPercent: any;
  geniusDiscountPercent: any;
  images: Image[];
}

export interface AvailableAddon {
  addonId: string;
  name: string;
  price: number;
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText: any;
  caption: any;
  width: number;
  height: number;
  formats: Formats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: any;
  provider: string;
  provider_metadata: any;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Formats {
  thumbnail: Thumbnail;
}

export interface Thumbnail {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  path: any;
  width: number;
  height: number;
  size: number;
  sizeInBytes: number;
  url: string;
}

export interface IProperty {
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
  isFeatured: boolean
  paymentRequirement: string
  slug: string
  houseRules: HouseRules
  facilitiesCategories: FacilitiesCategory[]
  surroundings: Surrounding[]
  sustainability: Sustainability
  highlights: string[]
  faqs: Faq[]
  topFacilities: TopFacility[]
  languagesSpoken: string[]
  importantInformation: string
  images: Image[]
  room_types: RoomType[]
  reviews: Review[]
  owner: any
  numberOfNights: number
  totalStayPrice: number
  taxesAndFees: number
  bestOptionSummary: BestOptionSummary
  availableRooms: AvailableRoom[]
  available_rooms: AvailableRoom2[]
  distanceKm: number
  distanceFromCityCenterKm: number
  isNewlyAdded: boolean
  isHighestRated: boolean
  thumbnailUrl: string
  userReviewScore: number
  reviewWord: string
  totalReviews: number
  propertyAmenitiesPreview: string[]
  paymentPolicy: string
  government: string
  nearbyLandmark: string
  landmarkName: string
  landmarkDistance: string
  rawLandmarkDistance: number
  gallery: Gallery[]
  badges: string[]
  propertySizeSummary: any
  mealPlanSummary: string
  cancellationText: string
  recentReviews: RecentReview[]
  locationScore: string
  scarcityMessage: any
  reviewsSummary: ReviewsSummary
  hostInfo: HostInfo
}

export interface AvailableAddon {
  addonId: string
  name: string
  price: number
}

export interface HouseRules {
  checkInTime: string
  checkOutTime: string
  cancellationPrepayment: string
  childrenAndBeds: string
  ageRestriction: string
  pets: string
  acceptedPaymentMethods: string[]
}

export interface FacilitiesCategory {
  category: string
  icon: string
  items: string[]
}

export interface Surrounding {
  type: string
  places: Place[]
}

export interface Place {
  name: string
  distance: string
}

export interface Sustainability {
  level: number
  isSustainable: boolean
  badgeText: string
  description: string
}

export interface Faq {
  question: string
  answer: string
}

export interface TopFacility {
  name: string
  icon: string
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

export interface IImage {
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
  folderPath: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: any;
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

export interface RoomType {
  id: number
  documentId: string
  name: string
  basePricePerNight: number
  totalUnits: number
  cancellationPolicy: string
  createdAt: string
  updatedAt: string
  publishedAt: any
  locale: any
  sizeSqm: any
  maxAdults: any
  maxChildren: any
  bedrooms: any
  bathrooms: any
  allowExtraGuests: any
  extraGuestFee: any
  beds: any
  roomAmenities: any
}

export interface Review {
  id: number
  documentId: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

export interface BestOptionSummary {
  roomsLeft: number
  sizeSqm: number
  isFreeCancellation: boolean
  maxAdults: number
  maxChildren: number
  beds: any[]
  bedrooms: number
  bathrooms: number
}

export interface AvailableRoom {
  id: number
  name: string
  basePricePerNight: number
  maxAdults: number
  maxChildren: number
  sleeps: Sleeps
  allowExtraGuests: boolean
  extraGuestFee: number
  beds: any[]
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  smokingPolicy: string
  roomAmenities: string[]
  cancellationPolicy: string
  availableUnits: number
  rateOptions: RateOption[]
}

export interface Sleeps {
  total: number
  adults: number
  children: number
}

export interface RateOption {
  rateId: string
  name: string
  priceForStay: number
  taxesAndFees: number
  mealPlan: string
  cancellationText: string
  cancellationDetails: string
  paymentText: string
  scarcityMessage: any
  features: string[]
}

export interface AvailableRoom2 {
  id: number
  name: string
  basePricePerNight: number
  maxAdults: number
  maxChildren: number
  sleeps: Sleeps2
  allowExtraGuests: boolean
  extraGuestFee: number
  beds: any[]
  bedrooms: number
  bathrooms: number
  sizeSqm: number
  smokingPolicy: string
  roomAmenities: string[]
  cancellationPolicy: string
  availableUnits: number
  rateOptions: RateOption2[]
}

export interface Sleeps2 {
  total: number
  adults: number
  children: number
}

export interface RateOption2 {
  rateId: string
  name: string
  priceForStay: number
  taxesAndFees: number
  mealPlan: string
  cancellationText: string
  cancellationDetails: string
  paymentText: string
  scarcityMessage: any
  features: string[]
}

export interface Gallery {
  url: string
  thumbnail: string
  alt: string
}

export interface RecentReview {
  id: number
  documentId: string
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

export interface ReviewsSummary {
  overallScore: number
  totalReviews: number
  categories: Category[]
}

export interface Category {
  name: string
  score: string
}

export interface HostInfo {
  name: string
  joinedOn: string
  reviewScore: string
  description: string
}

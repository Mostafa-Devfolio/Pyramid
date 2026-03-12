export interface IBanner {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  placement: string;
  targetType: string;
  targetUrl: any;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  module?: string;
  section: any;
  checkin?: string;
  checkout?: string;
  adults?: number;
  children?: number;
  expirationDate: any;
  image: Image;
  businessType?: BusinessType;
  targetVendor?: TargetVendor;
  targetProduct?: TargetProduct;
  targetCategory: any;
  targetProperty?: TargetProperty;
}

export interface Image {
  id: number;
  documentId: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats?: Formats;
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

export interface BusinessType {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  homeTitle: string;
  description: string;
  layoutType: string;
  orderMode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface TargetVendor {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  rating: number;
  isOpen: boolean;
  deliveryTime: string;
  deliveryFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  commissionType: any;
  commissionValue: any;
  saleMode: any;
}

export interface TargetProduct {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  baseSalePrice: number;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  attributes: Attributes;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  soldCount: any;
  reviewCount: any;
  averageRating: any;
  isFlashSale: any;
  saleStartDate: any;
  saleEndDate: any;
  vendor: Vendor;
}

export interface Attributes {
  spicyLevel: number;
}

export interface Vendor {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  rating: number;
  isOpen: boolean;
  deliveryTime: string;
  deliveryFee: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  commissionType: any;
  commissionValue: any;
  saleMode: any;
}

export interface TargetProperty {
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
  isFeatured: any;
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
}

export interface AvailableAddon {
  addonId: string;
  name: string;
  price: number;
}

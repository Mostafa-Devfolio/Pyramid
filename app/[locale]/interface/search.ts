export interface IVendor5 {
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
  locationLat?: number;
  locationLng?: number;
  deliveryZoneType?: string;
  deliveryRadiusKm?: number;
  deliveryPolygon: any;
}

export interface IProduct5 {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  baseSalePrice?: number;
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
  images: any;
  businessType: BusinessType;
  vendor: Vendor;
  category: Category;
  vendorCategory: any;
  brand: any;
  variants: Variant[];
  relatedProducts: any[];
  optionGroups: any[];
  localizations: any[];
  ratingAverage: number;
  ratingCount: number;
}

export interface Attributes {
  spicyLevel: number;
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
  locationLat: any;
  locationLng: any;
  deliveryZoneType: any;
  deliveryRadiusKm: any;
  deliveryPolygon: any;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Variant {
  id: number;
  documentId: string;
  sku: string;
  price: number;
  salePrice: any;
  stock: number;
  variantAttributes: VariantAttributes;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface VariantAttributes {
  spicyLevel: number;
}

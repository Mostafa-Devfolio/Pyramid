export interface IVendorInfo {
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
  logo: any;
  coverImage: any;
  businessType: BusinessType;
  products: Product[];
  vendorCategories: any[];
  reviews: any[];
  banners: Banner[];
  brands: any[];
  categories: Category[];
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

export interface Product {
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
}

export interface Attributes {
  spicyLevel: number;
}

export interface Banner {
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

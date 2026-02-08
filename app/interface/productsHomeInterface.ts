export interface IProductsHome {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  baseSalePrice: any;
  sku: string;
  stock: number;
  isFeatured: boolean;
  isActive: boolean;
  attributes: Attributes;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  images: any;
  businessType: BusinessType;
  vendor: Vendor;
  category: Category;
  vendorCategory: any;
  brand: any;
  variants: any[];
  reviews: any[];
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

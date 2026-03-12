export interface ICategoriesOfProducts {
  order: number;
  id: number;
  documentId: string;
  name: string;
  slug: string;
  isActive: boolean;
  homeImage: any;
  products: IProduct[];
}

export interface IProduct {
  soldCount: any;
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
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  reviewCount: any;
  averageRating: any;
  isFlashSale: any;
  saleStartDate: any;
  saleEndDate: any;
  images: any;
  brand: Brand;
  vendor: Vendor;
  category: Category;
  businessType: BusinessType;
}

export interface Brand {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: any;
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
  locale: any;
  commissionType: any;
  commissionValue: any;
  saleMode: any;
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
  locale: any;
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
  locale: any;
}

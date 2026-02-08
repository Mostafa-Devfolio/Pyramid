export interface IVendorPageProductDiscounted {
  id: number;
  title: string;
  slug: string;
  basePrice: number;
  baseSalePrice: number;
  stock: any;
  createdAt: string;
  isFeatured: boolean;
  images: Image[];
  variants: any[];
  brand: any;
}

export interface Image {
  url: string;
  alternativeText: any;
  name: string;
  width: number;
  height: number;
}

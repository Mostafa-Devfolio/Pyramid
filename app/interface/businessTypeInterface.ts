export interface IBusiness {
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
  icon: Icon;
}

export interface Icon {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
  name: string;
  width: number;
  height: number;
}

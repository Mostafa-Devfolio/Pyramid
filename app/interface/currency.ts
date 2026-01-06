export interface ICurrency {
  id: number
  documentId: string
  name: string
  code: string
  symbol: string
  symbolPosition: string
  decimalPlaces: number
  isDefault: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

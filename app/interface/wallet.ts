export interface IWallet {
  id: number
  documentId: string
  type: string
  amount: number
  balanceAfter: number
  reason: string
  metadata: Metadata
  createdAt: string
  updatedAt: string
  publishedAt: string
}

export interface Metadata {
  source: string
  previousStatus: string
}

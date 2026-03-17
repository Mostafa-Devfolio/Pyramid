export interface IUser {
  id: number
  documentId: string
  username: string
  email: string
  provider: string
  password: any
  resetPasswordToken: any
  confirmationToken: any
  confirmed: boolean
  blocked: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
  accountType: string
  phone: any
  walletBalance: number
  loyaltyPoints: number
  vendor: any
  role: Role
}

export interface Role {
  id: number
  documentId: string
  name: string
  description: string
  type: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: any
}

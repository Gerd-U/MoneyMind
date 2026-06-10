export interface MovementResponse {
  idTransaction: number
  idUsuario: number
  idCategory: number
  categoryName: string
  idPaymentMethod: number
  paymentMethodName: string
  amount: number
  description: string
  transactionDate: string
  createdAt: string
}

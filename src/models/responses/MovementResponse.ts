export interface MovementResponse {
  idMovement: number
  idUsuario: number
  idCategory: number
  categoryName: string
  idPaymentMethod: number
  paymentMethodName: string
  amount: number
  description: string
  movementDate: string
  createdAt: string
}

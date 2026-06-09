import { config } from '../config'
import type { PaymentMethodRequest } from '../models/requests/PaymentMethodRequest'
import type { PaymentMethodResponse } from '../models/responses/PaymentMethodResponse'

const API_URL = `${config.api.url}/payment-methods`

export async function getPaymentMethods(): Promise<PaymentMethodResponse[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Error al obtener los métodos de pago')
  }

  return await response.json()
}

export async function createPaymentMethod(data: PaymentMethodRequest): Promise<PaymentMethodResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al crear el método de pago')
  }

  return await response.json()
}

export async function deletePaymentMethod(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Error al eliminar el método de pago')
  }
}

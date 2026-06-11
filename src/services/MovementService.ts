import { config } from '../config'
import type { MovementRequest } from '../models/requests/MovementRequest'
import type { MovementResponse } from '../models/responses/MovementResponse'

const API_URL = `${config.api.url}/movement`

export async function getMovements(idUsuario: number, startDate: string, endDate: string): Promise<MovementResponse[]> {
  const response = await fetch(`${API_URL}?idUsuario=${idUsuario}&startDate=${startDate}&endDate=${endDate}`)

  if (!response.ok) {
    throw new Error('Error al obtener los movimientos')
  }

  return await response.json()
}

export async function createMovement(data: MovementRequest): Promise<MovementResponse> {
  console.log('Creando movimiento:', data)
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al crear el movimiento')
  }

  return await response.json()
}

export async function deleteMovement(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error('Error al eliminar el movimiento')
  }
}
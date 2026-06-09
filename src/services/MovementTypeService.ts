import { config } from '../config'
import type { MovementTypeResponse } from '../models/responses/MovementTypeResponse'

const API_URL = `${config.api.url}/movement-types`

export async function getMovementTypes(): Promise<MovementTypeResponse[]> {
  const response = await fetch(API_URL)

  if (!response.ok) {
    throw new Error('Error al obtener los tipos de movimiento')
  }

  return await response.json()
}

import { config } from '../config'
import type { MovementTypeResponse } from '../models/responses/MovementTypeResponse'

const API_URL = `${config.api.url}/movement-types`

export async function getAllMovementTypes(): Promise<MovementTypeResponse[]> {
  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error('Error al obtener los tipos de movimiento')
    }

    return await response.json()
  } catch (error) {
    console.error('Error en MovementTypeService:', error)
    throw error
  }
}
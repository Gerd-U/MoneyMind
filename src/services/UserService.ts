import { config } from '../config'
import type { UserResponse } from '../models/responses/UserResponse'

const API_URL = `${config.api.url}/users`

export async function getUserByEmail(email: string): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/${email}`)
  if (!response.ok) throw new Error('Error al obtener el usuario')
  return await response.json()
}

export async function updateUser(
  email: string,
  data: {
    firstName: string
    lastName: string
    email: string
    password: string
    active: boolean
  }
): Promise<void> {
  const response = await fetch(`${API_URL}/${email}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!response.ok) throw new Error('Error al actualizar el usuario')
}
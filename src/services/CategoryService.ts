import { config } from '../config'
import type { CategoryRequest } from '../models/requests/CategoryRequest'
import type { CategoryResponse } from '../models/responses/CategoryResponse'

const API_URL = `${config.api.url}/categories`

export async function getCategories(idUsuario: number): Promise<CategoryResponse[]> {
  const response = await fetch(`${API_URL}?idUsuario=${encodeURIComponent(idUsuario)}`)

  if (!response.ok) {
    throw new Error('Error al obtener las categorías')
  }

  return await response.json()
}

export async function createCategory(data: CategoryRequest): Promise<CategoryResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al crear la categoría')
  }

  return await response.json()
}

export async function updateCategory(id: number, data: CategoryRequest): Promise<CategoryResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar la categoría')
  }

  return await response.json()
}

export async function deleteCategory(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Error al eliminar la categoría')
  }
}

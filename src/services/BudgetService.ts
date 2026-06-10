import { config } from '../config'
import type { BudgetRequest } from '../models/requests/BudgetRequest'
import type { BudgetResponse } from '../models/responses/BudgetResponse'

const API_URL = `${config.api.url}/budgets`

export async function getBudgets(idUsuario: number, month: number, year: number): Promise<BudgetResponse[]> {
  const response = await fetch(`${API_URL}?idUsuario=${idUsuario}&month=${month}&year=${year}`)

  if (!response.ok) {
    throw new Error('Error al obtener los presupuestos')
  }

  return await response.json()
}

export async function createBudget(data: BudgetRequest): Promise<BudgetResponse> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al crear el presupuesto')
  }

  return await response.json()
}

export async function updateBudget(id: number, data: BudgetRequest): Promise<BudgetResponse> {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error al actualizar el presupuesto')
  }

  return await response.json()
}

export async function deleteBudget(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' })

  if (!response.ok) {
    throw new Error('Error al eliminar el presupuesto')
  }
}

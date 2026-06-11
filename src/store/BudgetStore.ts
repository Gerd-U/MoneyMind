import { create } from 'zustand'
import type { BudgetResponse } from '../models/responses/BudgetResponse'
import type { BudgetRequest } from '../models/requests/BudgetRequest'
import { getBudgets, createBudget, updateBudget, deleteBudget } from '../services/BudgetService'

interface BudgetStore {
  budgets: BudgetResponse[]
  isLoading: boolean
  error: string | null
  load: (month: number, year: number, idUsuario: number) => Promise<void>
  add: (data: Omit<BudgetRequest, 'idUsuario'>, idUsuario: number) => Promise<void>
  edit: (id: number, data: Omit<BudgetRequest, 'idUsuario'>, idUsuario: number) => Promise<void>
  remove: (id: number) => Promise<void>
}

export const useBudgetStore = create<BudgetStore>((set) => ({
  budgets: [],
  isLoading: false,
  error: null,

  load: async (month, year, idUsuario) => {
    try {
      set({ isLoading: true, error: null })
      const data = await getBudgets(idUsuario, month, year)
      set({ budgets: data })
    } catch (error) {
      console.error('Error en BudgetStore:', error)
      set({ error: 'No se pudieron cargar los presupuestos' })
    } finally {
      set({ isLoading: false })
    }
  },

  add: async (data, idUsuario) => {
    try {
      set({ error: null })
      const newBudget = await createBudget({ ...data, idUsuario })
      set(state => ({ budgets: [...state.budgets, newBudget] }))
    } catch (error) {
      console.error('Error en BudgetStore:', error)
      set({ error: 'No se pudo crear el presupuesto' })
    }
  },

  edit: async (id, data, idUsuario) => {
    try {
      set({ error: null })
      const updated = await updateBudget(id, { ...data, idUsuario })
      set(state => ({ budgets: state.budgets.map(b => b.idBudget === id ? updated : b) }))
    } catch (error) {
      console.error('Error en BudgetStore:', error)
      set({ error: 'No se pudo actualizar el presupuesto' })
    }
  },

  remove: async (id) => {
    try {
      set({ error: null })
      await deleteBudget(id)
      set(state => ({ budgets: state.budgets.filter(b => b.idBudget !== id) }))
    } catch (error) {
      console.error('Error en BudgetStore:', error)
      set({ error: 'No se pudo eliminar el presupuesto' })
    }
  },
}))
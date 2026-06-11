import { create } from 'zustand'
import type { CategoryRequest } from '../models/requests/CategoryRequest'
import type { CategoryResponse } from '../models/responses/CategoryResponse'
import type { MovementTypeResponse } from '../models/responses/MovementTypeResponse'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '../services/CategoryService'
import { getAllMovementTypes } from '../services/MovementTypeService'

interface CategoryStore {
  categories: CategoryResponse[]
  movementTypes: MovementTypeResponse[]
  isLoading: boolean
  error: string | null
  load: () => Promise<void>
  add: (category: CategoryRequest) => Promise<void>
  update: (id: number, data: CategoryRequest) => Promise<void>
  remove: (id: number) => Promise<void>
  toggleStatus: (id: number) => Promise<void>
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  movementTypes: [],
  isLoading: false,
  error: null,

  load: async () => {
    try {
      set({ isLoading: true, error: null })
      const [categories, movementTypes] = await Promise.all([
        getCategories(),
        getAllMovementTypes(),
      ])
      set({ categories, movementTypes })
    } catch (error) {
      console.error('Error en CategoryStore:', error)
      set({ error: 'No se pudieron cargar las categorías' })
    } finally {
      set({ isLoading: false })
    }
  },

  add: async (data) => {
    try {
      set({ error: null })
      const newCategory = await createCategory(data)
      set(state => ({ categories: [...state.categories, newCategory] }))
    } catch (error) {
      console.error('Error en CategoryStore:', error)
      set({ error: 'No se pudo crear la categoría' })
    }
  },

  update: async (id, data) => {
    try {
      set({ error: null })
      const updated = await updateCategory(id, data)
      set(state => ({
        categories: state.categories.map(c => c.idCategory === id ? updated : c)
      }))
    } catch (error) {
      console.error('Error en CategoryStore:', error)
      set({ error: 'No se pudo actualizar la categoría' })
    }
  },

  remove: async (id) => {
    try {
      set({ error: null })
      await deleteCategory(id)
      set(state => ({ categories: state.categories.filter(c => c.idCategory !== id) }))
    } catch (error) {
      console.error('Error en CategoryStore:', error)
      set({ error: 'No se pudo eliminar la categoría' })
    }
  },

  toggleStatus: async (id) => {
    const category = get().categories.find(c => c.idCategory === id)
    if (!category) {
      set({ error: 'Categoría no encontrada' })
      return
    }
    try {
      set({ error: null })
      const updatedCategory = await updateCategory(id, {
        idMovementType: category.idMovementType,
        categoryName: category.categoryName,
        description: category.description,
        active: !category.active,
      })
      set(state => ({
        categories: state.categories.map(c => c.idCategory === id ? updatedCategory : c)
      }))
    } catch (error) {
      console.error('Error en CategoryStore:', error)
      set({ error: 'No se pudo actualizar la categoría' })
    }
  },
}))
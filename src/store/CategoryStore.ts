import { create } from 'zustand'
import { mockCategorias } from '../data/mockData'
import type { Categoria } from '../types'

interface CategoryStore {
  categories: Categoria[]
  add: (category: Omit<Categoria, 'idCategoria'>) => void
  remove: (id: number) => void
  toggleStatus: (id: number) => void
}

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: mockCategorias,

  add: (data) => {
    const newCategory: Categoria = {
      ...data,
      idCategoria: get().categories.length + 1,
    }
    set(state => ({ categories: [...state.categories, newCategory] }))
  },

  remove: (id) => {
    set(state => ({ categories: state.categories.filter(c => c.idCategoria !== id) }))
  },

  toggleStatus: (id) => {
    set(state => ({
      categories: state.categories.map(c =>
        c.idCategoria === id ? { ...c, estadoCategoria: !c.estadoCategoria } : c
      )
    }))
  },
}))
import { create } from 'zustand'
import type { MovementResponse } from '../models/responses/MovementResponse'
import type { MovementRequest } from '../models/requests/MovementRequest'
import { getMovements, createMovement, deleteMovement } from '../services/MovementService'

interface MovementStore {
  movements: MovementResponse[]
  isLoading: boolean
  error: string | null
  load: (startDate: string, endDate: string, idUsuario: number) => Promise<void>
  add: (data: MovementRequest) => Promise<void>
  remove: (id: number) => Promise<void>
}

export const useMovementStore = create<MovementStore>((set) => ({
  movements: [],
  isLoading: false,
  error: null,

  load: async (startDate, endDate, idUsuario) => {
    try {
      set({ isLoading: true, error: null })
      const data = await getMovements(idUsuario, startDate, endDate)
      set({ movements: data })
    } catch (error) {
      console.error('Error en MovementStore:', error)
      set({ error: 'No se pudieron cargar los movimientos' })
    } finally {
      set({ isLoading: false })
    }
  },

  add: async (data) => {
    try {
      set({ error: null })
      const newMovement = await createMovement(data)
      set(state => ({ movements: [...state.movements, newMovement] }))
    } catch (error) {
      console.error('Error en MovementStore:', error)
      set({ error: 'No se pudo crear el movimiento' })
    }
  },

  remove: async (id) => {
    try {
      set({ error: null })
      await deleteMovement(id)
      set(state => ({ movements: state.movements.filter(m => m.idMovement !== id) }))
    } catch (error) {
      console.error('Error en MovementStore:', error)
      set({ error: 'No se pudo eliminar el movimiento' })
    }
  },
}))
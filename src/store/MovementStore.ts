import { create } from 'zustand'
import { mockMovimientos } from '../data/mockData'
import type { Movimiento } from '../types'

interface MovementStore {
  movements: Movimiento[]
  add: (movement: Omit<Movimiento, 'idMovimiento' | 'idUsuario' | 'fechaRegistro'>) => void
  remove: (id: number) => void
}

export const useMovementStore = create<MovementStore>((set, get) => ({
  movements: mockMovimientos,

  add: (data) => {
    const newMovement: Movimiento = {
      ...data,
      idMovimiento: get().movements.length + 1,
      idUsuario: 1,
      fechaRegistro: new Date().toISOString(),
    }
    set(state => ({ movements: [...state.movements, newMovement] }))
  },

  remove: (id) => {
    set(state => ({ movements: state.movements.filter(m => m.idMovimiento !== id) }))
  },
}))
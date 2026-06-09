import { create } from 'zustand'
import type { PaymentMethodRequest } from '../models/requests/PaymentMethodRequest'
import type { PaymentMethodResponse } from '../models/responses/PaymentMethodResponse'
import {
  createPaymentMethod,
  deletePaymentMethod,
  getPaymentMethods,
} from '../services/PaymentMethodService'

interface PaymentMethodStore {
  paymentMethods: PaymentMethodResponse[]
  isLoading: boolean
  error: string | null
  load: () => Promise<void>
  add: (paymentMethod: PaymentMethodRequest) => Promise<void>
  remove: (id: number) => Promise<void>
}

export const usePaymentMethodStore = create<PaymentMethodStore>((set) => ({
  paymentMethods: [],
  isLoading: false,
  error: null,

  load: async () => {
    try {
      set({ isLoading: true, error: null })
      const paymentMethods = await getPaymentMethods()
      set({ paymentMethods })
    } catch (error) {
      console.error('Error en paymentMethodStore:', error)
      set({ error: 'No se pudieron cargar los métodos de pago' })
    } finally {
      set({ isLoading: false })
    }
  },

  add: async (data) => {
    try {
      set({ error: null })
      const newPaymentMethod = await createPaymentMethod(data)
      set(state => ({ paymentMethods: [...state.paymentMethods, newPaymentMethod] }))
    } catch (error) {
      console.error('Error en paymentMethodStore:', error)
      set({ error: 'No se pudo crear el método de pago' })
    }
  },

  remove: async (id) => {
    try {
      set({ error: null })
      await deletePaymentMethod(id)
      set(state => ({ paymentMethods: state.paymentMethods.filter(m => m.idPaymentMethod !== id) }))
    } catch (error) {
      console.error('Error en paymentMethodStore:', error)
      set({ error: 'No se pudo eliminar el método de pago' })
    }
  },
}))

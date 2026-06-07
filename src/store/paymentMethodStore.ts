import { create } from 'zustand'
import { mockMetodosPago } from '../data/mockData'
import type { MetodoPago } from '../types'

interface PaymentMethodStore {
  paymentMethods: MetodoPago[]
  add: (paymentMethod: Omit<MetodoPago, 'idMetodoPago'>) => void
  remove: (id: number) => void
}

export const usePaymentMethodStore = create<PaymentMethodStore>((set, get) => ({
  paymentMethods: mockMetodosPago,

  add: (data) => {
    const newPaymentMethod: MetodoPago = {
      ...data,
      idMetodoPago: get().paymentMethods.length + 1,
    }
    set(state => ({ paymentMethods: [...state.paymentMethods, newPaymentMethod] }))
  },

  remove: (id) => {
    set(state => ({ paymentMethods: state.paymentMethods.filter(m => m.idMetodoPago !== id) }))
  },
}))
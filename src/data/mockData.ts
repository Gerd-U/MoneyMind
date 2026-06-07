import type { TipoMovimiento, MetodoPago, Categoria, Movimiento, Presupuesto } from '../types'

export const mockTiposMovimiento: TipoMovimiento[] = [
  { idTipoMovimiento: 1, nombreTipo: 'Ingreso' },
  { idTipoMovimiento: 2, nombreTipo: 'Egreso' },
]

export const mockMetodosPago: MetodoPago[] = [
  { idMetodoPago: 1, nombreMetodo: 'Efectivo' },
  { idMetodoPago: 2, nombreMetodo: 'Tarjeta de débito' },
  { idMetodoPago: 3, nombreMetodo: 'Tarjeta de crédito' },
  { idMetodoPago: 4, nombreMetodo: 'Transferencia' },
]

export const mockCategorias: Categoria[] = [
  { idCategoria: 1, idTipoMovimiento: 1, nombreCategoria: 'Salario', descripcion: 'Ingreso mensual fijo', estadoCategoria: true },
  { idCategoria: 2, idTipoMovimiento: 1, nombreCategoria: 'Freelance', descripcion: 'Trabajos independientes', estadoCategoria: true },
  { idCategoria: 3, idTipoMovimiento: 2, nombreCategoria: 'Alimentación', descripcion: 'Supermercado y restaurantes', estadoCategoria: true },
  { idCategoria: 4, idTipoMovimiento: 2, nombreCategoria: 'Transporte', descripcion: 'Combustible y transporte público', estadoCategoria: true },
  { idCategoria: 5, idTipoMovimiento: 2, nombreCategoria: 'Entretenimiento', descripcion: 'Streaming, salidas, ocio', estadoCategoria: true },
  { idCategoria: 6, idTipoMovimiento: 2, nombreCategoria: 'Servicios', descripcion: 'Luz, agua, internet', estadoCategoria: true },
]

export const mockMovimientos: Movimiento[] = [
  { idMovimiento: 1, idUsuario: 1, idCategoria: 1, idMetodoPago: 4, monto: 1500000, descripcion: 'Salario junio', fechaMovimiento: '2026-06-01', fechaRegistro: '2026-06-01T08:00:00' },
  { idMovimiento: 2, idUsuario: 1, idCategoria: 2, idMetodoPago: 4, monto: 350000, descripcion: 'Proyecto web cliente', fechaMovimiento: '2026-06-03', fechaRegistro: '2026-06-03T10:30:00' },
  { idMovimiento: 3, idUsuario: 1, idCategoria: 3, idMetodoPago: 1, monto: 85000, descripcion: 'Supermercado semanal', fechaMovimiento: '2026-06-04', fechaRegistro: '2026-06-04T17:00:00' },
  { idMovimiento: 4, idUsuario: 1, idCategoria: 4, idMetodoPago: 2, monto: 45000, descripcion: 'Gasolina', fechaMovimiento: '2026-06-05', fechaRegistro: '2026-06-05T09:15:00' },
  { idMovimiento: 5, idUsuario: 1, idCategoria: 5, idMetodoPago: 3, monto: 25000, descripcion: 'Netflix + Spotify', fechaMovimiento: '2026-06-05', fechaRegistro: '2026-06-05T12:00:00' },
  { idMovimiento: 6, idUsuario: 1, idCategoria: 6, idMetodoPago: 2, monto: 120000, descripcion: 'Internet + electricidad', fechaMovimiento: '2026-06-06', fechaRegistro: '2026-06-06T11:00:00' },
]

export const mockPresupuestos: Presupuesto[] = [
  { idPresupuesto: 1, idUsuario: 1, idCategoria: 3, montoLimite: 200000, mes: 6, anio: 2026, fechaCreacion: '2026-06-01T00:00:00' },
  { idPresupuesto: 2, idUsuario: 1, idCategoria: 4, montoLimite: 100000, mes: 6, anio: 2026, fechaCreacion: '2026-06-01T00:00:00' },
  { idPresupuesto: 3, idUsuario: 1, idCategoria: 5, montoLimite: 80000, mes: 6, anio: 2026, fechaCreacion: '2026-06-01T00:00:00' },
  { idPresupuesto: 4, idUsuario: 1, idCategoria: 6, montoLimite: 150000, mes: 6, anio: 2026, fechaCreacion: '2026-06-01T00:00:00' },
]
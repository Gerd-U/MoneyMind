// Interfaz transitoria — se mantiene mientras MovementForm migra completamente
export interface Movimiento {
  idMovimiento: number
  idUsuario: number
  idCategoria: number
  idMetodoPago: number
  monto: number
  descripcion: string
  fechaMovimiento: string
  fechaRegistro: string
}

export interface Presupuesto {
  idPresupuesto: number
  idUsuario: number
  idCategoria: number
  montoLimite: number
  mes: number
  anio: number
  fechaCreacion: string
}
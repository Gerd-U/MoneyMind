// USUARIO
export interface Usuario {
  idUsuario: number
  nombre: string
  apellido: string
  correo: string
  contrasena: string
  fechaRegistro: string
  estadoUsuario: boolean
}

// TIPO_MOVIMIENTO
export interface TipoMovimiento {
  idTipoMovimiento: number
  nombreTipo: string
}

// METODO_PAGO
export interface MetodoPago {
  idMetodoPago: number
  nombreMetodo: string
}

// CATEGORIA
export interface Categoria {
  idCategoria: number
  idTipoMovimiento: number
  nombreCategoria: string
  descripcion: string
  estadoCategoria: boolean
}

// MOVIMIENTO
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

// PRESUPUESTO
export interface Presupuesto {
  idPresupuesto: number
  idUsuario: number
  idCategoria: number
  montoLimite: number
  mes: number
  anio: number
  fechaCreacion: string
}

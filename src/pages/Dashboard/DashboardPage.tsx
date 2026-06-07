import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useMovementStore } from '../../store/MovementStore'
import { mockCategorias, mockMetodosPago, mockPresupuestos } from '../../data/mockData'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

// MetricCard
interface MetricCardProps {
  label: string
  value: string
  accent: string
}

function MetricCard({ label, value, accent }: MetricCardProps) {
  return (
    <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
      <span className="text-slate-400 text-sm">{label}</span>
      <span style={{ color: accent }} className="text-2xl font-bold tracking-tight">
        {value}
      </span>
    </div>
  )
}

// PresupuestoBar
function PresupuestoBar({ nombreCategoria, gastado, limite }: {
  nombreCategoria: string
  gastado: number
  limite: number
}) {
  const porcentaje = Math.min((gastado / limite) * 100, 100)
  const color = porcentaje >= 90 ? '#f07060' : porcentaje >= 70 ? '#f0a060' : '#3ecf8e'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-slate-300 text-sm">{nombreCategoria}</span>
        <span className="text-slate-400 text-xs">
          {formatMonto(gastado)} / {formatMonto(limite)}
        </span>
      </div>
      <div style={{ backgroundColor: '#0D1520' }} className="w-full h-2 rounded-full overflow-hidden">
        <div
          style={{ width: `${porcentaje}%`, backgroundColor: color }}
          className="h-full rounded-full transition-all duration-500"
        />
      </div>
    </div>
  )
}

// MovimientoRow
function MovimientoRow({ descripcion, categoria, metodo, monto, fecha, esIngreso }: {
  descripcion: string
  categoria: string
  metodo: string
  monto: number
  fecha: string
  esIngreso: boolean
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex flex-col gap-0.5">
        <span className="text-white text-sm font-medium">{descripcion}</span>
        <span className="text-slate-500 text-xs">{categoria} · {metodo}</span>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <span
          style={{ color: esIngreso ? '#3ecf8e' : '#f07060' }}
          className="text-sm font-semibold"
        >
          {esIngreso ? '+' : '-'}{formatMonto(monto)}
        </span>
        <span className="text-slate-500 text-xs">{fecha}</span>
      </div>
    </div>
  )
}

// GraficoBarras
function GraficoBarras({ ingresos, egresos }: { ingresos: number, egresos: number }) {
  const datosGrafico = [
    { mes: 'Ene', ingresos: 1200000, egresos: 800000 },
    { mes: 'Feb', ingresos: 1500000, egresos: 950000 },
    { mes: 'Mar', ingresos: 1300000, egresos: 1100000 },
    { mes: 'Abr', ingresos: 1800000, egresos: 700000 },
    { mes: 'May', ingresos: 1600000, egresos: 1200000 },
    { mes: 'Jun', ingresos, egresos },
  ]

  return (
    <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
      <h2 className="text-white font-semibold text-base">Resumen mensual</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={datosGrafico} barGap={4}>
          <XAxis
            dataKey="mes"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0D1520', border: '1px solid #1e3a5f', borderRadius: '8px' }}
            labelStyle={{ color: '#94a3b8' }}
            formatter={(value) => [formatMonto(Number(value)), '']}
          />
          <Bar dataKey="ingresos" fill="#3ecf8e" radius={[4, 4, 0, 0]} name="Ingresos" />
          <Bar dataKey="egresos" fill="#f07060" radius={[4, 4, 0, 0]} name="Egresos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// DashboardPage
export default function DashboardPage() {
  const { movements } = useMovementStore()

  const ingresos = movements
    .filter(m => mockCategorias.find(c => c.idCategoria === m.idCategoria)?.idTipoMovimiento === 1)
    .reduce((acc, m) => acc + m.monto, 0)

  const egresos = movements
    .filter(m => mockCategorias.find(c => c.idCategoria === m.idCategoria)?.idTipoMovimiento === 2)
    .reduce((acc, m) => acc + m.monto, 0)

  const balance = ingresos - egresos

  const movimientosRecientes = [...movements]
    .sort((a, b) => new Date(b.fechaMovimiento).getTime() - new Date(a.fechaMovimiento).getTime())
    .slice(0, 5)

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Junio 2026</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Balance actual" value={formatMonto(balance)} accent="#7dc0f0" />
        <MetricCard label="Ingresos del mes" value={formatMonto(ingresos)} accent="#3ecf8e" />
        <MetricCard label="Egresos del mes" value={formatMonto(egresos)} accent="#f07060" />
      </div>

      {/* Gráfico */}
      <GraficoBarras ingresos={ingresos} egresos={egresos} />

      {/* Fila inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Presupuestos */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-5">
          <h2 className="text-white font-semibold text-base">Presupuestos del mes</h2>
          <div className="flex flex-col gap-4">
            {mockPresupuestos.map(p => {
              const categoria = mockCategorias.find(c => c.idCategoria === p.idCategoria)
              const gastado = movements
                .filter(m => m.idCategoria === p.idCategoria)
                .reduce((acc, m) => acc + m.monto, 0)

              return (
                <PresupuestoBar
                  key={p.idPresupuesto}
                  nombreCategoria={categoria?.nombreCategoria ?? ''}
                  gastado={gastado}
                  limite={p.montoLimite}
                />
              )
            })}
          </div>
        </div>

        {/* Movimientos recientes */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Movimientos recientes</h2>
          <div className="flex flex-col">
            {movimientosRecientes.map(m => {
              const categoria = mockCategorias.find(c => c.idCategoria === m.idCategoria)
              const metodo = mockMetodosPago.find(mp => mp.idMetodoPago === m.idMetodoPago)
              const esIngreso = categoria?.idTipoMovimiento === 1

              return (
                <MovimientoRow
                  key={m.idMovimiento}
                  descripcion={m.descripcion}
                  categoria={categoria?.nombreCategoria ?? ''}
                  metodo={metodo?.nombreMetodo ?? ''}
                  monto={m.monto}
                  fecha={m.fechaMovimiento}
                  esIngreso={esIngreso}
                />
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
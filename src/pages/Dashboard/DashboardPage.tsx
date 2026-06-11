import { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { useMovementStore } from '../../store/MovementStore'
import { useBudgetStore } from '../../store/BudgetStore'
import { useCategoryStore } from '../../store/CategoryStore'
import { useAuth } from '../../context/AuthContext'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

const now = new Date()
const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-30`

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

function PresupuestoBar({ categoryName, spent, limit }: {
  categoryName: string
  spent: number
  limit: number
}) {
  const porcentaje = Math.min((spent / limit) * 100, 100)
  const color = porcentaje >= 90 ? '#f07060' : porcentaje >= 70 ? '#f0a060' : '#3ecf8e'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-slate-300 text-sm">{categoryName}</span>
        <span className="text-slate-400 text-xs">
          {formatMonto(spent)} / {formatMonto(limit)}
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

export default function DashboardPage() {
  const { idUsuario } = useAuth()
  const { movements, load: loadMovements } = useMovementStore()
  const { budgets, load: loadBudgets } = useBudgetStore()
  const { categories, load: loadCategories } = useCategoryStore()

  useEffect(() => {
    if (!idUsuario) return
    void loadMovements(startDate, endDate, idUsuario)
    void loadBudgets(now.getMonth() + 1, now.getFullYear(), idUsuario)
    void loadCategories()
  }, [loadMovements, loadBudgets, loadCategories, idUsuario])

  const ingresos = movements
    .filter(m => categories.find(c => c.idCategory === m.idCategory)?.idMovementType === 1)
    .reduce((acc, m) => acc + m.amount, 0)

  const egresos = movements
    .filter(m => categories.find(c => c.idCategory === m.idCategory)?.idMovementType === 2)
    .reduce((acc, m) => acc + m.amount, 0)

  const balance = ingresos - egresos

  const movimientosRecientes = [...movements]
    .sort((a, b) => new Date(b.movementDate).getTime() - new Date(a.movementDate).getTime())
    .slice(0, 5)

  const datosGrafico = [
    { mes: 'Ene', ingresos: 0, egresos: 0 },
    { mes: 'Feb', ingresos: 0, egresos: 0 },
    { mes: 'Mar', ingresos: 0, egresos: 0 },
    { mes: 'Abr', ingresos: 0, egresos: 0 },
    { mes: 'May', ingresos: 0, egresos: 0 },
    { mes: 'Jun', ingresos, egresos },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          {now.toLocaleString('es-CR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Balance actual" value={formatMonto(balance)} accent="#7dc0f0" />
        <MetricCard label="Ingresos del mes" value={formatMonto(ingresos)} accent="#3ecf8e" />
        <MetricCard label="Egresos del mes" value={formatMonto(egresos)} accent="#f07060" />
      </div>

      {/* Gráfico */}
      <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
        <h2 className="text-white font-semibold text-base">Resumen mensual</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={datosGrafico} barGap={4}>
            <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
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

      {/* Fila inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Presupuestos */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-5">
          <h2 className="text-white font-semibold text-base">Presupuestos del mes</h2>
          <div className="flex flex-col gap-4">
            {budgets.length === 0 && (
              <p className="text-slate-500 text-sm">No hay presupuestos registrados.</p>
            )}
            {budgets.map(b => {
              const spent = movements
                .filter(m => m.idCategory === b.idCategory)
                .reduce((acc, m) => acc + m.amount, 0)

              return (
                <PresupuestoBar
                  key={b.idBudget}
                  categoryName={b.categoryName}
                  spent={spent}
                  limit={b.limitAmount}
                />
              )
            })}
          </div>
        </div>

        {/* Movimientos recientes */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Movimientos recientes</h2>
          <div className="flex flex-col">
            {movimientosRecientes.length === 0 && (
              <p className="text-slate-500 text-sm">No hay movimientos registrados.</p>
            )}
            {movimientosRecientes.map(m => {
              const categoria = categories.find(c => c.idCategory === m.idCategory)
              const esIngreso = categoria?.idMovementType === 1

              return (
                <div key={m.idMovement} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-white text-sm font-medium">{m.description}</span>
                    <span className="text-slate-500 text-xs">{m.categoryName} · {m.paymentMethodName}</span>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span style={{ color: esIngreso ? '#3ecf8e' : '#f07060' }} className="text-sm font-semibold">
                      {esIngreso ? '+' : '-'}{formatMonto(m.amount)}
                    </span>
                    <span className="text-slate-500 text-xs">{m.movementDate}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
import { useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useMovementStore } from '../../store/MovementStore'
import { useCategoryStore } from '../../store/CategoryStore'
import { useAuth } from '../../context/AuthContext'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

const PIE_COLORS = ['#3ecf8e', '#f07060', '#4a9eda', '#f0a060', '#a78bfa']

const now = new Date()
const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-30`

export default function ReportsPage() {
  const { idUsuario } = useAuth()
  const { movements, load: loadMovements } = useMovementStore()
  const { categories, load: loadCategories } = useCategoryStore()

  useEffect(() => {
    if (!idUsuario) return
    void loadMovements(startDate, endDate, idUsuario)
    void loadCategories()
  }, [loadMovements, loadCategories, idUsuario])

  const totalIngresos = movements
    .filter(m => categories.find(c => c.idCategory === m.idCategory)?.idMovementType === 1)
    .reduce((acc, m) => acc + m.amount, 0)

  const totalEgresos = movements
    .filter(m => categories.find(c => c.idCategory === m.idCategory)?.idMovementType === 2)
    .reduce((acc, m) => acc + m.amount, 0)

  const tasaAhorro = totalIngresos > 0
    ? (((totalIngresos - totalEgresos) / totalIngresos) * 100).toFixed(1)
    : '0.0'

  const datosPorCategoria = categories
    .filter(c => c.idMovementType === 2)
    .map(c => {
      const total = movements
        .filter(m => m.idCategory === c.idCategory)
        .reduce((acc, m) => acc + m.amount, 0)
      return { name: c.categoryName, value: total }
    })
    .filter(d => d.value > 0)

  const datosMensuales = [
    { mes: 'Ene', ingresos: 0, egresos: 0 },
    { mes: 'Feb', ingresos: 0, egresos: 0 },
    { mes: 'Mar', ingresos: 0, egresos: 0 },
    { mes: 'Abr', ingresos: 0, egresos: 0 },
    { mes: 'May', ingresos: 0, egresos: 0 },
    { mes: 'Jun', ingresos: totalIngresos, egresos: totalEgresos },
  ]

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Reportes</h1>
        <p className="text-slate-400 text-sm mt-1">
          {now.toLocaleString('es-CR', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Total ingresos</span>
          <span style={{ color: '#3ecf8e' }} className="text-2xl font-bold">{formatMonto(totalIngresos)}</span>
          <span className="text-slate-500 text-xs">Este mes</span>
        </div>
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Total egresos</span>
          <span style={{ color: '#f07060' }} className="text-2xl font-bold">{formatMonto(totalEgresos)}</span>
          <span className="text-slate-500 text-xs">Este mes</span>
        </div>
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Tasa de ahorro</span>
          <span style={{ color: '#7dc0f0' }} className="text-2xl font-bold">{tasaAhorro}%</span>
          <span className="text-slate-500 text-xs">Este mes</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar chart */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Resumen mensual</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datosMensuales} barGap={4}>
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

        {/* Pie chart */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Egresos por categoría</h2>
          {datosPorCategoria.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-slate-500 text-sm">No hay egresos registrados este mes.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={datosPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {datosPorCategoria.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0D1520', border: '1px solid #1e3a5f', borderRadius: '8px' }}
                    formatter={(value) => [formatMonto(Number(value)), '']}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                {datosPorCategoria.map((d, index) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    />
                    <div className="flex flex-col">
                      <span className="text-slate-300 text-xs">{d.name}</span>
                      <span className="text-slate-500 text-xs">{formatMonto(d.value)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
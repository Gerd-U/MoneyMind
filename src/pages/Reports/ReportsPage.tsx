import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { mockMovimientos, mockCategorias } from '../../data/mockData'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

const datosPorCategoria = mockCategorias
  .filter(c => c.idTipoMovimiento === 2)
  .map(c => {
    const total = mockMovimientos
      .filter(m => m.idCategoria === c.idCategoria)
      .reduce((acc, m) => acc + m.monto, 0)
    return { name: c.nombreCategoria, value: total }
  })
  .filter(d => d.value > 0)

const PIE_COLORS = ['#3ecf8e', '#f07060', '#4a9eda', '#f0a060', '#a78bfa']

const datosMensuales = [
  { mes: 'Ene', ingresos: 1200000, egresos: 800000 },
  { mes: 'Feb', ingresos: 1500000, egresos: 950000 },
  { mes: 'Mar', ingresos: 1300000, egresos: 1100000 },
  { mes: 'Abr', ingresos: 1800000, egresos: 700000 },
  { mes: 'May', ingresos: 1600000, egresos: 1200000 },
  { mes: 'Jun', ingresos: 1850000, egresos: 275000 },
]

const totalIngresos = datosMensuales.reduce((acc, d) => acc + d.ingresos, 0)
const totalEgresos = datosMensuales.reduce((acc, d) => acc + d.egresos, 0)
const tasaAhorro = (((totalIngresos - totalEgresos) / totalIngresos) * 100).toFixed(1)

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Reportes</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen financiero — 2026</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Total ingresos</span>
          <span style={{ color: '#3ecf8e' }} className="text-2xl font-bold">{formatMonto(totalIngresos)}</span>
          <span className="text-slate-500 text-xs">Últimos 6 meses</span>
        </div>
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Total egresos</span>
          <span style={{ color: '#f07060' }} className="text-2xl font-bold">{formatMonto(totalEgresos)}</span>
          <span className="text-slate-500 text-xs">Últimos 6 meses</span>
        </div>
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Tasa de ahorro</span>
          <span style={{ color: '#7dc0f0' }} className="text-2xl font-bold">{tasaAhorro}%</span>
          <span className="text-slate-500 text-xs">Últimos 6 meses</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-4">

        {/* Bar chart */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Resumen mensual</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={datosMensuales} barGap={4}>
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

        {/* Pie chart */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Egresos por categoría</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
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

            {/* Leyenda */}
            <div className="flex flex-col gap-3">
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
        </div>

      </div>
    </div>
  )
}
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useMovementStore } from '../../store/MovementStore'
import { useCategoryStore } from '../../store/CategoryStore'
import { useAuth } from '../../context/AuthContext'

const formatMonto = (monto: number) =>
  new Intl.NumberFormat('es-CR', { style: 'currency', currency: 'CRC', maximumFractionDigits: 0 }).format(monto)

const PIE_COLORS = ['#3ecf8e', '#f07060', '#4a9eda', '#f0a060', '#a78bfa']

const now = new Date()

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const YEARS = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

export default function ReportsPage() {
  const { idUsuario } = useAuth()
  const { movements, load: loadMovements } = useMovementStore()
  const { categories, load: loadCategories } = useCategoryStore()

  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())

  const startDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`
  const endDate = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-30`

  useEffect(() => {
    if (!idUsuario) return
    void loadMovements(startDate, endDate, idUsuario)
    void loadCategories(idUsuario)
  }, [loadMovements, loadCategories, idUsuario, selectedMonth, selectedYear])

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

  const semanasDelMes = () => {
    const diasEnMes = new Date(selectedYear, selectedMonth, 0).getDate()
    const semanas: { semana: string; ingresos: number; egresos: number }[] = []

    let semana = 1
    for (let inicio = 1; inicio <= diasEnMes; inicio += 7) {
      const fin = Math.min(inicio + 6, diasEnMes)

      const ingresosSemana = movements
        .filter(m => {
          const dia = parseInt(m.movementDate.split('-')[2])
          return dia >= inicio && dia <= fin &&
            categories.find(c => c.idCategory === m.idCategory)?.idMovementType === 1
        })
        .reduce((acc, m) => acc + m.amount, 0)

      const egresosSemana = movements
        .filter(m => {
          const dia = parseInt(m.movementDate.split('-')[2])
          return dia >= inicio && dia <= fin &&
            categories.find(c => c.idCategory === m.idCategory)?.idMovementType === 2
        })
        .reduce((acc, m) => acc + m.amount, 0)

      semanas.push({
        semana: `S${semana}`,
        ingresos: ingresosSemana,
        egresos: egresosSemana,
      })
      semana++
    }
    return semanas
  }

  const selectStyle = {
    backgroundColor: '#0D1520',
    border: '1px solid #1e3a5f',
    color: 'white',
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Reportes</h1>
          <p className="text-slate-400 text-sm mt-1">
            {MESES[selectedMonth - 1]} {selectedYear}
          </p>
        </div>
        {/* Selectores */}
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            style={selectStyle}
            className="rounded-lg px-3 py-2 text-sm outline-none"
          >
            {MESES.map((mes, index) => (
              <option key={index + 1} value={index + 1}>{mes}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            style={selectStyle}
            className="rounded-lg px-3 py-2 text-sm outline-none"
          >
            {YEARS.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Total ingresos</span>
          <span style={{ color: '#3ecf8e' }} className="text-2xl font-bold">{formatMonto(totalIngresos)}</span>
          <span className="text-slate-500 text-xs">{MESES[selectedMonth - 1]} {selectedYear}</span>
        </div>
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Total egresos</span>
          <span style={{ color: '#f07060' }} className="text-2xl font-bold">{formatMonto(totalEgresos)}</span>
          <span className="text-slate-500 text-xs">{MESES[selectedMonth - 1]} {selectedYear}</span>
        </div>
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-2">
          <span className="text-slate-400 text-sm">Tasa de ahorro</span>
          <span style={{ color: '#7dc0f0' }} className="text-2xl font-bold">{tasaAhorro}%</span>
          <span className="text-slate-500 text-xs">{MESES[selectedMonth - 1]} {selectedYear}</span>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Bar chart */}
        <div style={{ backgroundColor: '#101D32' }} className="rounded-xl p-6 flex flex-col gap-4">
          <h2 className="text-white font-semibold text-base">Movimientos por semana</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={semanasDelMes()} barGap={4}>
              <XAxis
                dataKey="semana"
                tick={{ fill: '#64748b', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
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
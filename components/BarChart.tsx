'use client'

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ChartDataPoint } from '@/lib/types'

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

export default function BarChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-sm font-medium text-gray-500 mb-4">Últimos 6 meses</h2>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBarChart data={data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => typeof value === 'number' ? formatBRL(value) : value} />
          <Legend />
          <Bar dataKey="entradas" name="Entradas" fill="#16a34a" />
          <Bar dataKey="saidas" name="Saídas" fill="#dc2626" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  )
}

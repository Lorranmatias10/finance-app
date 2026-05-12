'use client'

import { motion } from 'framer-motion'
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
    <motion.div
      className="bg-white rounded-lg shadow p-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.35 }}
    >
      <h2 className="text-sm font-medium text-gray-500 mb-4">Últimos 6 meses</h2>
      <ResponsiveContainer width="100%" height={280}>
        <RechartsBarChart data={data} margin={{ top: 4, right: 16, left: 16, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => typeof value === 'number' ? formatBRL(value) : value} />
          <Legend />
          <Bar dataKey="entradas" name="Entradas" fill="#16a34a" animationBegin={400} animationDuration={800} animationEasing="ease-out" />
          <Bar dataKey="saidas" name="Saídas" fill="#dc2626" animationBegin={500} animationDuration={800} animationEasing="ease-out" />
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}

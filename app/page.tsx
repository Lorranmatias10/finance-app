import KpiCard from '@/components/KpiCard'
import BarChart from '@/components/BarChart'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import type { SummaryResponse } from '@/lib/types'

const PT_MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

async function getSummary(): Promise<SummaryResponse> {
  const now = new Date()
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

  const [monthTxs, allTxs] = await Promise.all([
    prisma.transaction.findMany({
      where: { date: { gte: firstOfMonth, lt: firstOfNextMonth } },
    }),
    prisma.transaction.findMany(),
  ])

  const totalEntradas = monthTxs
    .filter(t => t.type === 'ENTRADA')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalSaidas = monthTxs
    .filter(t => t.type === 'SAIDA')
    .reduce((sum, t) => sum + t.amount, 0)

  const saldo = allTxs.reduce(
    (sum, t) => (t.type === 'ENTRADA' ? sum + t.amount : sum - t.amount),
    0
  )

  const chart = []
  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const txs = allTxs.filter(t => {
      const d = new Date(t.date)
      return d >= start && d < end
    })
    chart.push({
      month: PT_MONTHS[start.getMonth()],
      entradas: txs.filter(t => t.type === 'ENTRADA').reduce((s, t) => s + t.amount, 0),
      saidas: txs.filter(t => t.type === 'SAIDA').reduce((s, t) => s + t.amount, 0),
    })
  }

  return { kpi: { saldo, totalEntradas, totalSaidas }, chart }
}

export default async function DashboardPage() {
  const { kpi, chart } = await getSummary()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Nova transação
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <KpiCard
          label="Saldo atual"
          value={kpi.saldo}
          color={kpi.saldo >= 0 ? 'green' : 'red'}
          index={0}
        />
        <KpiCard label="Entradas do mês" value={kpi.totalEntradas} color="green" index={1} />
        <KpiCard label="Saídas do mês" value={kpi.totalSaidas} color="red" index={2} />
      </div>

      <BarChart data={chart} />
    </div>
  )
}

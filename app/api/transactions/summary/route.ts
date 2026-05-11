import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { SummaryResponse } from '@/lib/types'

const PT_MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

export async function GET() {
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

  const response: SummaryResponse = {
    kpi: { saldo, totalEntradas, totalSaidas },
    chart,
  }

  return NextResponse.json(response)
}

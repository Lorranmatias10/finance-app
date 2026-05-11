import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { CreateTransactionBody } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const month = searchParams.get('month')
  const type = searchParams.get('type')

  const where: Record<string, unknown> = {}

  if (month) {
    const [year, m] = month.split('-').map(Number)
    where.date = {
      gte: new Date(year, m - 1, 1),
      lt: new Date(year, m, 1),
    }
  }

  if (type === 'ENTRADA' || type === 'SAIDA') {
    where.type = type
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  })

  return NextResponse.json(transactions)
}

export async function POST(req: NextRequest) {
  const body: CreateTransactionBody = await req.json()
  const { type, amount, description, category, date } = body

  if (!['ENTRADA', 'SAIDA'].includes(type)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Valor deve ser maior que zero' }, { status: 400 })
  }
  if (!description?.trim()) {
    return NextResponse.json({ error: 'Descrição obrigatória' }, { status: 400 })
  }
  if (!date) {
    return NextResponse.json({ error: 'Data obrigatória' }, { status: 400 })
  }

  const transaction = await prisma.transaction.create({
    data: {
      type,
      amount,
      description: description.trim(),
      category: category?.trim() || 'Geral',
      date: new Date(date),
    },
  })

  return NextResponse.json(transaction, { status: 201 })
}

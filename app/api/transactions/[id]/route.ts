import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { CreateTransactionBody } from '@/lib/types'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId)
  const body: Partial<CreateTransactionBody> = await req.json()

  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
  }

  if (body.type && !['ENTRADA', 'SAIDA'].includes(body.type)) {
    return NextResponse.json({ error: 'Tipo inválido' }, { status: 400 })
  }
  if (body.amount !== undefined && body.amount <= 0) {
    return NextResponse.json({ error: 'Valor deve ser maior que zero' }, { status: 400 })
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: {
      ...(body.type && { type: body.type }),
      ...(body.amount && { amount: body.amount }),
      ...(body.description && { description: body.description.trim() }),
      ...(body.category && { category: body.category.trim() }),
      ...(body.date && { date: new Date(body.date) }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = Number(rawId)

  const existing = await prisma.transaction.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Transação não encontrada' }, { status: 404 })
  }

  await prisma.transaction.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}

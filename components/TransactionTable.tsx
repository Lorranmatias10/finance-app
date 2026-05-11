'use client'

import { useState } from 'react'
import type { Transaction } from '@/lib/types'

interface TransactionTableProps {
  transactions: Transaction[]
  onDelete: (id: number) => void
  onEdit: (t: Transaction) => void
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR')

export default function TransactionTable({ transactions, onDelete, onEdit }: TransactionTableProps) {
  const [month, setMonth] = useState('')
  const [typeFilter, setTypeFilter] = useState<'TODOS' | 'ENTRADA' | 'SAIDA'>('TODOS')

  const filtered = transactions.filter(t => {
    const matchMonth = month ? t.date.startsWith(month) : true
    const matchType = typeFilter === 'TODOS' || t.type === typeFilter
    return matchMonth && matchType
  })

  return (
    <div>
      <div className="flex gap-4 mb-4">
        <input
          type="month"
          value={month}
          onChange={e => setMonth(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          className="border rounded px-3 py-1.5 text-sm"
        >
          <option value="TODOS">Todos</option>
          <option value="ENTRADA">Entradas</option>
          <option value="SAIDA">Saídas</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-left">
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Categoria</th>
              <th className="px-4 py-2 text-right">Valor</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Nenhuma transação encontrada
                </td>
              </tr>
            )}
            {filtered.map(t => (
              <tr key={t.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(t.date)}</td>
                <td className="px-4 py-3">{t.description}</td>
                <td className="px-4 py-3 text-gray-400">{t.category}</td>
                <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${t.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'ENTRADA' ? '+' : '-'}{formatBRL(t.amount)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => onEdit(t)} className="text-blue-600 hover:underline text-xs">
                      Editar
                    </button>
                    <button onClick={() => onDelete(t.id)} className="text-red-500 hover:underline text-xs">
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

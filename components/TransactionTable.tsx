'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
          className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          className="border rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <AnimatePresence>
              {filtered.length === 0 ? (
                <motion.tr
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    Nenhuma transação encontrada
                  </td>
                </motion.tr>
              ) : (
                filtered.map((t, i) => (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
                    className="border-t hover:bg-slate-50 transition-colors group"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(t.date)}</td>
                    <td className="px-4 py-3">{t.description}</td>
                    <td className="px-4 py-3 text-gray-400">{t.category}</td>
                    <td className={`px-4 py-3 text-right font-medium whitespace-nowrap ${t.type === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'ENTRADA' ? '+' : '-'}{formatBRL(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3 justify-end opacity-40 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(t)} className="text-blue-600 hover:underline text-xs">Editar</button>
                        <button onClick={() => onDelete(t.id)} className="text-red-500 hover:underline text-xs">Excluir</button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  )
}

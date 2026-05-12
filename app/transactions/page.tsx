'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import TransactionTable from '@/components/TransactionTable'
import TransactionForm from '@/components/TransactionForm'
import Toast from '@/components/Toast'
import type { Transaction, CreateTransactionBody } from '@/lib/types'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [editingTx, setEditingTx] = useState<Transaction | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const router = useRouter()

  const loadTransactions = useCallback(async () => {
    const res = await fetch('/api/transactions')
    setTransactions(await res.json())
  }, [])

  useEffect(() => { loadTransactions() }, [loadTransactions])

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta transação?')) return
    const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setToast({ message: 'Transação excluída', type: 'success' })
      loadTransactions()
      router.refresh()
    } else {
      setToast({ message: 'Erro ao excluir', type: 'error' })
    }
  }

  const handleEdit = async (data: CreateTransactionBody) => {
    if (!editingTx) return
    const res = await fetch(`/api/transactions/${editingTx.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      setToast({ message: 'Transação atualizada', type: 'success' })
      setEditingTx(null)
      loadTransactions()
      router.refresh()
    } else {
      setToast({ message: 'Erro ao atualizar', type: 'error' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Link
          href="/transactions/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + Nova transação
        </Link>
      </div>

      {editingTx && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-sm font-medium text-gray-500 mb-4">Editar transação</h2>
          <TransactionForm
            initialData={editingTx}
            onSubmit={handleEdit}
            onCancel={() => setEditingTx(null)}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <TransactionTable
          transactions={transactions}
          onDelete={handleDelete}
          onEdit={setEditingTx}
        />
      </div>

      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

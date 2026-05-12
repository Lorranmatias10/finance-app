'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import TransactionForm from '@/components/TransactionForm'
import Toast from '@/components/Toast'
import type { CreateTransactionBody } from '@/lib/types'

export default function NewTransactionPage() {
  const router = useRouter()
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleSubmit = async (data: CreateTransactionBody) => {
    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      router.push('/transactions')
      router.refresh()
    } else {
      const err = await res.json()
      setToast({ message: err.error ?? 'Erro ao salvar', type: 'error' })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Nova transação</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-md">
        <TransactionForm onSubmit={handleSubmit} onCancel={() => router.back()} />
      </div>
      <AnimatePresence>
        {toast && (
          <Toast key="toast" message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

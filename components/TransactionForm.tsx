'use client'

import { useState, useEffect } from 'react'
import type { CreateTransactionBody, Transaction, TransactionType } from '@/lib/types'

interface TransactionFormProps {
  initialData?: Transaction
  onSubmit: (data: CreateTransactionBody) => Promise<void>
  onCancel?: () => void
}

export default function TransactionForm({ initialData, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initialData?.type ?? 'ENTRADA')
  const [amount, setAmount] = useState(initialData?.amount?.toString() ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [date, setDate] = useState(
    initialData?.date?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/transactions')
      .then(r => r.json())
      .then((txs: Transaction[]) => {
        setSuggestions([...new Set(txs.map(t => t.category))])
      })
  }, [])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!amount || Number(amount) <= 0) e.amount = 'Valor deve ser maior que zero'
    if (!description.trim()) e.description = 'Descrição obrigatória'
    if (!date) e.date = 'Data obrigatória'
    return e
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    await onSubmit({
      type,
      amount: Number(amount),
      description: description.trim(),
      category: category.trim() || 'Geral',
      date,
    })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="text-sm font-medium text-gray-700">Tipo</label>
        <div className="flex gap-2 mt-1">
          {(['ENTRADA', 'SAIDA'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${
                type === t
                  ? t === 'ENTRADA'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t === 'ENTRADA' ? 'Entrada' : 'Saída'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Valor (R$)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          placeholder="0,00"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          placeholder="Ex: Venda produto X"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Categoria</label>
        <input
          type="text"
          list="categories"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
          placeholder="Ex: Vendas, Aluguel..."
        />
        <datalist id="categories">
          {suggestions.map(s => <option key={s} value={s} />)}
        </datalist>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Data</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2 text-sm"
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : initialData ? 'Atualizar' : 'Salvar'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded text-sm hover:bg-gray-50"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

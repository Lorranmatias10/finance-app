'use client'

import { useState, useEffect } from 'react'
import { motion, circOut } from 'framer-motion'
import type { CreateTransactionBody, Transaction, TransactionType } from '@/lib/types'

interface TransactionFormProps {
  initialData?: Transaction
  onSubmit: (data: CreateTransactionBody) => Promise<void>
  onCancel?: () => void
}

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: circOut },
  }),
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

  const inputClass = "mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <motion.div custom={0} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="text-sm font-medium text-gray-700">Tipo</label>
        <div className="flex gap-2 mt-1">
          {(['ENTRADA', 'SAIDA'] as const).map(t => (
            <motion.button
              key={t}
              type="button"
              onClick={() => setType(t)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`flex-1 py-2 rounded border text-sm font-medium transition-colors ${
                type === t
                  ? t === 'ENTRADA'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {t === 'ENTRADA' ? 'Entrada' : 'Saída'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div custom={1} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="text-sm font-medium text-gray-700">Valor (R$)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className={inputClass}
          placeholder="0,00"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </motion.div>

      <motion.div custom={2} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="text-sm font-medium text-gray-700">Descrição</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className={inputClass}
          placeholder="Ex: Venda produto X"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </motion.div>

      <motion.div custom={3} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="text-sm font-medium text-gray-700">Categoria</label>
        <input
          type="text"
          list="categories"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className={inputClass}
          placeholder="Ex: Vendas, Aluguel..."
        />
        <datalist id="categories">
          {suggestions.map(s => <option key={s} value={s} />)}
        </datalist>
      </motion.div>

      <motion.div custom={4} variants={fieldVariants} initial="hidden" animate="visible">
        <label className="text-sm font-medium text-gray-700">Data</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className={inputClass}
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </motion.div>

      <motion.div custom={5} variants={fieldVariants} initial="hidden" animate="visible" className="flex gap-3 pt-2">
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"
              />
              Salvando...
            </>
          ) : (
            initialData ? 'Atualizar' : 'Salvar'
          )}
        </motion.button>
        {onCancel && (
          <motion.button
            type="button"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 border border-gray-300 text-gray-600 py-2 rounded text-sm hover:bg-gray-50"
          >
            Cancelar
          </motion.button>
        )}
      </motion.div>
    </form>
  )
}

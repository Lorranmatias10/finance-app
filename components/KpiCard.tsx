'use client'

import { motion, animate } from 'framer-motion'
import { useEffect, useState } from 'react'

interface KpiCardProps {
  label: string
  value: number
  color?: 'green' | 'red' | 'blue'
  index?: number
}

const formatBRL = (v: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)

function AnimatedNumber({ value, colorClass }: { value: number; colorClass: string }) {
  const [display, setDisplay] = useState(formatBRL(0))

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1,
      ease: 'easeOut',
      onUpdate: v => setDisplay(formatBRL(v)),
    })
    return controls.stop
  }, [value])

  return <span className={`text-2xl font-bold ${colorClass}`}>{display}</span>
}

export default function KpiCard({ label, value, color = 'blue', index = 0 }: KpiCardProps) {
  const colorClass = { green: 'text-green-600', red: 'text-red-600', blue: 'text-blue-600' }[color]

  return (
    <motion.div
      className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24, delay: index * 0.1 }}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.10)' }}
    >
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <AnimatedNumber value={value} colorClass={colorClass} />
    </motion.div>
  )
}

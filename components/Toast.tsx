'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`fixed bottom-6 right-6 ${bg} text-white px-4 py-3 rounded-lg shadow-lg z-50 text-sm`}
    >
      {message}
    </motion.div>
  )
}

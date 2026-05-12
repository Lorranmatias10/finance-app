'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/transactions', label: 'Transações' },
]

export default function NavSidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      className="w-56 bg-white shadow-sm flex flex-col py-8 px-4 gap-1 shrink-0"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <div className="text-lg font-bold text-blue-600 mb-6 px-2">💰 Finanças</div>
      {links.map(({ href, label }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            className="relative px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-lg"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </Link>
        )
      })}
    </motion.aside>
  )
}

import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Finanças',
  description: 'Controle de fluxo de caixa para pequenos negócios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex">
          <aside className="w-56 bg-white shadow-sm flex flex-col py-8 px-4 gap-1 shrink-0">
            <div className="text-lg font-bold text-blue-600 mb-6 px-2">💰 Finanças</div>
            <Link
              href="/"
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700"
            >
              Dashboard
            </Link>
            <Link
              href="/transactions"
              className="px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 text-gray-700"
            >
              Transações
            </Link>
          </aside>
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}

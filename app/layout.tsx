import type { Metadata } from 'next'
import './globals.css'
import NavSidebar from '@/components/NavSidebar'
import PageTransition from '@/components/PageTransition'

export const metadata: Metadata = {
  title: 'Finanças',
  description: 'Controle de fluxo de caixa para pequenos negócios',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex">
          <NavSidebar />
          <main className="flex-1 p-8">
            <div className="max-w-4xl mx-auto">
              <PageTransition>{children}</PageTransition>
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}

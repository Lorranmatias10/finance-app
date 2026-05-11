export type TransactionType = 'ENTRADA' | 'SAIDA'

export interface Transaction {
  id: number
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
}

export interface KpiSummary {
  saldo: number
  totalEntradas: number
  totalSaidas: number
}

export interface ChartDataPoint {
  month: string
  entradas: number
  saidas: number
}

export interface SummaryResponse {
  kpi: KpiSummary
  chart: ChartDataPoint[]
}

export interface CreateTransactionBody {
  type: TransactionType
  amount: number
  description: string
  category: string
  date: string
}

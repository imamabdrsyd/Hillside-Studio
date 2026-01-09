export type TransactionCategory = 'EARN' | 'OPEX' | 'VAR' | 'CAPEX' | 'FIN'

export interface Transaction {
  id: number
  date: string
  category: TransactionCategory
  description: string
  income: number
  expense: number
  account: string
  created_at?: string
  updated_at?: string
}

export interface FinancialSummary {
  earn: number
  opex: number
  var: number
  capex: number
  fin: number
  income: number
  expense: number
  net: number
  gross: number
  cash: number
  margin: number
}

export interface MonthlyData {
  income: number
  expense: number
}

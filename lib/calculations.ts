import { Transaction, FinancialSummary, MonthlyData } from '@/types/transaction'

const CAPITAL = 350000000 // Initial capital

export function calculateSummary(data: Transaction[]): FinancialSummary {
  const summary = {
    earn: 0,
    opex: 0,
    var: 0,
    capex: 0,
    fin: 0,
    income: 0,
    expense: 0,
    net: 0,
    gross: 0,
    cash: 0,
    margin: 0,
  }

  data.forEach(transaction => {
    summary.income += transaction.income
    summary.expense += transaction.expense

    const amount = transaction.income || transaction.expense
    const category = transaction.category.toLowerCase() as 'earn' | 'opex' | 'var' | 'capex' | 'fin'
    summary[category] += amount
  })

  summary.net = summary.earn - summary.opex - summary.var
  summary.gross = summary.earn - summary.var
  summary.cash = summary.income - summary.expense
  summary.margin = summary.earn > 0 ? ((summary.gross / summary.earn) * 100) : 0

  return summary
}

export function calculateMonthlyData(data: Transaction[]): MonthlyData[] {
  const monthlyData: MonthlyData[] = Array(12).fill(0).map(() => ({ income: 0, expense: 0 }))

  data.forEach(transaction => {
    const month = new Date(transaction.date).getMonth()
    monthlyData[month].income += transaction.income
    monthlyData[month].expense += transaction.expense
  })

  return monthlyData
}

export function formatCurrency(amount: number): string {
  return 'Rp ' + Math.abs(amount).toLocaleString('id-ID')
}

export function formatShort(amount: number): string {
  if (amount >= 1e6) {
    return (amount / 1e6).toFixed(1) + 'jt'
  }
  return (amount / 1e3).toFixed(0) + 'rb'
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function getBadgeClass(category: string): string {
  const classes: Record<string, string> = {
    EARN: 'bg-emerald-100 text-emerald-700',
    OPEX: 'bg-indigo-100 text-indigo-700',
    VAR: 'bg-amber-100 text-amber-700',
    CAPEX: 'bg-blue-100 text-blue-700',
    FIN: 'bg-purple-100 text-purple-700',
  }
  return classes[category] || 'bg-gray-100'
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    EARN: '💰',
    OPEX: '🏢',
    VAR: '🔧',
    CAPEX: '📦',
    FIN: '💸',
  }
  return icons[category] || '📁'
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    EARN: '#d1fae5',
    OPEX: '#e0e7ff',
    VAR: '#fef3c7',
    CAPEX: '#dbeafe',
    FIN: '#ede9fe',
  }
  return colors[category] || '#f1f5f9'
}

export { CAPITAL }

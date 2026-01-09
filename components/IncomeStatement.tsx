import { FinancialSummary } from '@/types/transaction'
import { formatCurrency } from '@/lib/calculations'

interface IncomeStatementProps {
  summary: FinancialSummary
}

export default function IncomeStatement({ summary }: IncomeStatementProps) {
  const row = (label: string, value: string, className = '') => (
    <div className={`flex justify-between py-2 ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
        <h3 className="font-semibold text-white">HILLSIDE STUDIO LLC</h3>
        <p className="text-indigo-200 text-sm">Income Statement • 2025</p>
      </div>
      <div className="p-6">
        <div className="bg-emerald-50 px-4 py-3 rounded-xl mb-4">
          <span className="font-bold text-emerald-700">REVENUE</span>
        </div>
        {row('Service Revenue', formatCurrency(summary.earn))}
        <div className="flex justify-between py-3 border-t border-gray-200 font-semibold">
          <span>Total Revenue</span>
          <span>{formatCurrency(summary.earn)}</span>
        </div>

        <div className="bg-amber-50 px-4 py-3 rounded-xl my-4">
          <span className="font-bold text-amber-700">COGS</span>
        </div>
        {row('Variable', formatCurrency(summary.var))}
        <div className="flex justify-between py-3 border-t border-gray-200 font-semibold">
          <span>Gross Profit</span>
          <span>{formatCurrency(summary.gross)}</span>
        </div>
        {row('Margin', summary.margin.toFixed(1) + '%')}

        <div className="bg-red-50 px-4 py-3 rounded-xl my-4">
          <span className="font-bold text-red-700">OPEX</span>
        </div>
        {row('Operational', formatCurrency(summary.opex))}

        <div className={`flex justify-between py-4 px-4 rounded-xl font-bold text-white mt-4 ${summary.net >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <span>NET PROFIT</span>
          <span>{formatCurrency(summary.net)}</span>
        </div>
      </div>
    </div>
  )
}

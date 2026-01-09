import { FinancialSummary } from '@/types/transaction'
import { formatCurrency } from '@/lib/calculations'

interface CashFlowProps {
  summary: FinancialSummary
}

export default function CashFlow({ summary }: CashFlowProps) {
  const row = (label: string, value: string, className = '') => (
    <div className={`flex justify-between py-2 ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )

  return (
    <div className="max-w-2xl bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
        <h3 className="font-semibold text-white">Statement of Cash Flows</h3>
        <p className="text-emerald-200 text-sm">Year 2025</p>
      </div>
      <div className="p-6">
        <div className="bg-emerald-50 px-4 py-3 rounded-xl mb-4">
          <span className="font-bold text-emerald-700">Operating</span>
        </div>
        {row('Cash from customers', '+' + formatCurrency(summary.earn), 'text-emerald-600')}
        {row('Cash paid (OPEX)', '-' + formatCurrency(summary.opex), 'text-red-500')}
        {row('Cash paid (VAR)', '-' + formatCurrency(summary.var), 'text-red-500')}
        <div className="flex justify-between py-3 border-t border-gray-200 font-semibold">
          <span>Net from Operations</span>
          <span>{formatCurrency(summary.earn - summary.opex - summary.var)}</span>
        </div>

        <div className="bg-indigo-50 px-4 py-3 rounded-xl my-4">
          <span className="font-bold text-indigo-700">Investing</span>
        </div>
        {row('Purchase assets', '-' + formatCurrency(summary.capex), 'text-red-500')}

        <div className="bg-purple-50 px-4 py-3 rounded-xl my-4">
          <span className="font-bold text-purple-700">Financing</span>
        </div>
        {row('Dividends', '-' + formatCurrency(summary.fin), 'text-red-500')}

        <div className="flex justify-between py-4 px-4 rounded-xl bg-gray-800 text-white font-bold mt-4">
          <span>Net Cash Change</span>
          <span>{formatCurrency(summary.cash)}</span>
        </div>
      </div>
    </div>
  )
}

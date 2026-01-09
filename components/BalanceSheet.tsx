import { FinancialSummary } from '@/types/transaction'
import { formatCurrency, CAPITAL } from '@/lib/calculations'

interface BalanceSheetProps {
  summary: FinancialSummary
}

export default function BalanceSheet({ summary }: BalanceSheetProps) {
  const row = (label: string, value: string, className = '') => (
    <div className={`flex justify-between py-2 ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-blue-500 px-6 py-4">
          <h3 className="font-semibold text-white">ASSETS</h3>
        </div>
        <div className="p-6">
          <div className="font-semibold text-indigo-600 py-2">Current Assets</div>
          {row('Cash & Bank', formatCurrency(summary.cash))}

          <div className="font-semibold text-blue-500 py-2 mt-4">Fixed Assets</div>
          {row('Property', formatCurrency(CAPITAL))}
          {row('Equipment (CAPEX)', formatCurrency(summary.capex))}

          <div className="flex justify-between py-4 px-4 rounded-xl bg-blue-500 text-white font-bold mt-4">
            <span>TOTAL ASSETS</span>
            <span>{formatCurrency(CAPITAL + summary.cash + summary.capex)}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="bg-purple-500 px-6 py-4">
          <h3 className="font-semibold text-white">LIABILITIES & EQUITY</h3>
        </div>
        <div className="p-6">
          <div className="font-semibold text-red-600 py-2">Liabilities</div>
          {row('Accounts Payable', 'Rp 0')}

          <div className="font-semibold text-purple-500 py-2 mt-4">Equity</div>
          {row('Paid-in Capital', formatCurrency(CAPITAL))}
          {row('Retained Earnings', formatCurrency(summary.net))}
          {row('(-) Dividends', formatCurrency(summary.fin))}

          <div className="flex justify-between py-4 px-4 rounded-xl bg-purple-500 text-white font-bold mt-4">
            <span>TOTAL L+E</span>
            <span>{formatCurrency(CAPITAL + summary.net - summary.fin)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

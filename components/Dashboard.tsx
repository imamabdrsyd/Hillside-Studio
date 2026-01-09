'use client'

import { Transaction, FinancialSummary, MonthlyData } from '@/types/transaction'
import { formatCurrency, formatShort, formatDate, getBadgeClass, getCategoryIcon, getCategoryColor } from '@/lib/calculations'
import { useState, useEffect } from 'react'
import { Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler)

interface DashboardProps {
  transactions: Transaction[]
  summary: FinancialSummary
  monthlyData: MonthlyData[]
  searchQuery: string
}

export default function Dashboard({ transactions, summary, monthlyData, searchQuery }: DashboardProps) {
  const [selectedMonth, setSelectedMonth] = useState('all')

  const expensesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        data: monthlyData.map((m) => m.expense),
        backgroundColor: '#6366f1',
        borderRadius: 6,
      },
    ],
  }

  const expensesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: {
          callback: (value: any) => formatShort(value),
        },
      },
    },
  }

  const breakdownChartData = {
    labels: ['OPEX', 'VAR', 'CAPEX', 'FIN'],
    datasets: [
      {
        data: [summary.opex, summary.var, summary.capex, summary.fin],
        backgroundColor: ['#6366f1', '#f59e0b', '#3b82f6', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  }

  const breakdownChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: { display: false },
    },
  }

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesMonth = selectedMonth === 'all' || t.date.split('-')[1] === selectedMonth
      const matchesSearch =
        !searchQuery ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesMonth && matchesSearch
    })
    .slice(-10)
    .reverse()

  return (
    <>
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Expenses Overview</h3>
            <span className="font-semibold">2025</span>
          </div>
          <div className="h-64">
            <Line data={expensesChartData} options={expensesChartOptions as any} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Net Profit</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.net)}</p>
            <p className="text-xs text-gray-400">Jan - Dec 2025</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Closing Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(summary.cash)}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">Gross Margin</p>
            <p className="text-2xl font-bold text-emerald-600">{summary.margin.toFixed(1)}%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-500">Revenue (EARN)</span>
            <span className="text-emerald-500">↑</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(summary.earn)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-500">Expenses</span>
            <span className="text-red-500">↓</span>
          </div>
          <p className="text-xl font-bold">{formatCurrency(summary.expense)}</p>
        </div>
        <div className="col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Expenses Breakdown</p>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <Doughnut data={breakdownChartData} options={breakdownChartOptions as any} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] text-gray-400">Total</span>
                <span className="text-xs font-bold">{formatShort(summary.opex + summary.var + summary.capex + summary.fin)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs flex-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                OPEX <span className="ml-auto font-semibold">{formatShort(summary.opex)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                VAR <span className="ml-auto font-semibold">{formatShort(summary.var)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                CAPEX <span className="ml-auto font-semibold">{formatShort(summary.capex)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                FIN <span className="ml-auto font-semibold">{formatShort(summary.fin)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="font-semibold">Transaction History</h3>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium"
          >
            <option value="all">All Months</option>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 uppercase">
              <th className="px-6 py-3 text-left">Transaction</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: getCategoryColor(transaction.category) }}
                    >
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <span className="font-medium text-sm">{transaction.description}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(transaction.date)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getBadgeClass(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm font-semibold ${transaction.income > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                  {transaction.income > 0 ? '+' : '-'}
                  {formatCurrency(transaction.income || transaction.expense)}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                    ● Done
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

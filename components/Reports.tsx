'use client'

import { useState } from 'react'
import { Transaction, FinancialSummary } from '@/types/transaction'
import { formatCurrency, formatDate } from '@/lib/calculations'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportsProps {
  transactions: Transaction[]
  summary: FinancialSummary
}

export default function Reports({ transactions, summary }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState('12')

  const exportMonthlyPDF = () => {
    const doc = new jsPDF()
    const monthNames = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const monthTransactions = transactions.filter((t) => t.date.split('-')[1] === selectedMonth)

    const monthSummary = {
      earn: 0,
      opex: 0,
      var: 0,
      capex: 0,
      fin: 0,
    }

    monthTransactions.forEach((t) => {
      if (t.category === 'EARN') monthSummary.earn += t.income
      else monthSummary[t.category.toLowerCase() as 'opex' | 'var' | 'capex' | 'fin'] += t.expense
    })

    const netProfit = monthSummary.earn - monthSummary.opex - monthSummary.var

    doc.setFontSize(20)
    doc.setTextColor(99, 102, 241)
    doc.text('HILLSIDE STUDIO LLC', 105, 20, { align: 'center' })

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text(`Monthly Report - ${monthNames[parseInt(selectedMonth)]} 2025`, 105, 30, { align: 'center' })

    doc.setFillColor(99, 102, 241)
    doc.rect(14, 40, 182, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(12)
    doc.text('INCOME STATEMENT', 105, 46, { align: 'center' })

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    let y = 58
    doc.text('Revenue', 20, y)
    doc.text(formatCurrency(monthSummary.earn), 180, y, { align: 'right' })
    y += 8
    doc.text('(-) Variable', 20, y)
    doc.text(formatCurrency(monthSummary.var), 180, y, { align: 'right' })
    y += 8
    doc.setFont(undefined, 'bold')
    doc.text('Gross Profit', 20, y)
    doc.text(formatCurrency(monthSummary.earn - monthSummary.var), 180, y, { align: 'right' })
    y += 8
    doc.setFont(undefined, 'normal')
    doc.text('(-) OPEX', 20, y)
    doc.text(formatCurrency(monthSummary.opex), 180, y, { align: 'right' })
    y += 10

    doc.setFillColor(netProfit >= 0 ? 16 : 239, netProfit >= 0 ? 185 : 68, netProfit >= 0 ? 129 : 68)
    doc.rect(14, y - 5, 182, 10, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont(undefined, 'bold')
    doc.text('NET PROFIT', 20, y + 2)
    doc.text(formatCurrency(netProfit), 180, y + 2, { align: 'right' })

    y += 20
    doc.setTextColor(0, 0, 0)
    doc.setFillColor(16, 185, 129)
    doc.rect(14, y, 182, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text('TRANSACTIONS', 105, y + 6, { align: 'center' })

    autoTable(doc, {
      head: [['Date', 'Desc', 'Cat', 'Income', 'Expense']],
      body: monthTransactions.map((t) => [
        formatDate(t.date),
        t.description.substring(0, 20),
        t.category,
        t.income > 0 ? formatCurrency(t.income) : '-',
        t.expense > 0 ? formatCurrency(t.expense) : '-',
      ]),
      startY: y + 12,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 102, 241] },
    })

    doc.save(`hillside_${monthNames[parseInt(selectedMonth)]}_2025.pdf`)
  }

  const row = (label: string, value: string, className = '') => (
    <div className={`flex justify-between py-2 ${className}`}>
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Financial Reports</h2>
        <div className="flex gap-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold"
          >
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
          <button
            onClick={exportMonthlyPDF}
            className="px-5 py-2 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600"
          >
            📄 Export Monthly
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-indigo-500 px-6 py-4">
            <h3 className="font-semibold text-white">📊 Income Statement</h3>
          </div>
          <div className="p-6">
            {row('Revenue (EARN)', formatCurrency(summary.earn))}
            {row('(-) VAR', formatCurrency(summary.var))}
            <div className="flex justify-between py-3 border-t-2 border-gray-200 font-bold">
              <span>Gross Profit</span>
              <span>{formatCurrency(summary.gross)}</span>
            </div>
            {row('(-) OPEX', formatCurrency(summary.opex))}
            <div className={`flex justify-between py-3 border-t-2 border-gray-200 font-bold ${summary.net >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              <span>Net Profit</span>
              <span>{formatCurrency(summary.net)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-emerald-500 px-6 py-4">
            <h3 className="font-semibold text-white">💰 Cash Flow</h3>
          </div>
          <div className="p-6">
            {row('Cash In (EARN)', '+' + formatCurrency(summary.earn), 'text-emerald-600')}
            {row('Cash Out (OPEX)', '-' + formatCurrency(summary.opex), 'text-red-500')}
            {row('Cash Out (VAR)', '-' + formatCurrency(summary.var), 'text-red-500')}
            {row('Cash Out (CAPEX)', '-' + formatCurrency(summary.capex), 'text-red-500')}
            {row('Cash Out (FIN)', '-' + formatCurrency(summary.fin), 'text-red-500')}
            <div className="flex justify-between py-3 border-t-2 border-gray-200 font-bold">
              <span>Net Cash</span>
              <span>{formatCurrency(summary.cash)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

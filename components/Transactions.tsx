'use client'

import { useState } from 'react'
import { Transaction, TransactionCategory } from '@/types/transaction'
import { formatCurrency, formatDate, getBadgeClass } from '@/lib/calculations'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface TransactionsProps {
  transactions: Transaction[]
  searchQuery: string
  onAdd: (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => void
  onDelete: (id: number) => void
  onBulkDelete: (category: string) => void
}

export default function Transactions({ transactions, searchQuery, onAdd, onDelete, onBulkDelete }: TransactionsProps) {
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '' as TransactionCategory | '',
    description: '',
    amount: '',
    account: 'BCA',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category || !formData.amount) return

    const amount = parseFloat(formData.amount)
    onAdd({
      date: formData.date,
      category: formData.category as TransactionCategory,
      description: formData.description,
      income: formData.category === 'EARN' ? amount : 0,
      expense: formData.category !== 'EARN' ? amount : 0,
      account: formData.account,
    })

    setFormData({
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: '',
      account: 'BCA',
    })
  }

  const handleBulkDelete = () => {
    const selected = (document.querySelector('input[name="delType"]:checked') as HTMLInputElement)?.value
    if (!selected) return

    onBulkDelete(selected)
    setShowModal(false)
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.text('Hillside Studio - Transactions', 14, 22)

    const totalIncome = transactions.reduce((sum, t) => sum + t.income, 0)
    const totalExpense = transactions.reduce((sum, t) => sum + t.expense, 0)
    const profit = totalIncome - totalExpense

    doc.setFontSize(11)
    doc.text(`Revenue: ${formatCurrency(totalIncome)} | Expense: ${formatCurrency(totalExpense)} | Profit: ${formatCurrency(profit)}`, 14, 32)

    autoTable(doc, {
      head: [['Date', 'Description', 'Cat', 'Income', 'Expense']],
      body: transactions.map((t) => [
        formatDate(t.date),
        t.description.substring(0, 25),
        t.category,
        t.income > 0 ? formatCurrency(t.income) : '-',
        t.expense > 0 ? formatCurrency(t.expense) : '-',
      ]),
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [99, 102, 241] },
    })

    doc.save('hillside_transactions.pdf')
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filter === 'all' || t.category === filter
    const matchesSearch =
      !searchQuery ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">➕</span>
          Add Transaction
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as TransactionCategory })}
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select</option>
              <option value="EARN">🟢 EARN</option>
              <option value="OPEX">🔵 OPEX</option>
              <option value="VAR">🟡 VAR</option>
              <option value="CAPEX">🔷 CAPEX</option>
              <option value="FIN">🟣 FIN</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="2 nights/Guest"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Amount (Rp)</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="500000"
              required
              min="0"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Account</label>
            <select
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option>BCA</option>
              <option>Jago</option>
              <option>Cash</option>
            </select>
          </div>
        </form>
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-all"
          >
            ➕ Add Transaction
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200"
          >
            🗑️ Bulk Delete
          </button>
          <button
            onClick={exportPDF}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200"
          >
            📄 Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100">
          <h3 className="font-semibold">All Transactions</h3>
          <div className="flex gap-2">
            {['all', 'EARN', 'OPEX', 'VAR', 'CAPEX', 'FIN'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  filter === cat
                    ? 'bg-indigo-500 text-white'
                    : 'border border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 uppercase">
              <th className="px-6 py-3 text-left">No</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Income</th>
              <th className="px-6 py-3 text-left">Expense</th>
              <th className="px-6 py-3 text-left">Account</th>
              <th className="px-6 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredTransactions.map((transaction, index) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{index + 1}</td>
                <td className="px-6 py-4 text-sm">{formatDate(transaction.date)}</td>
                <td className="px-6 py-4 text-sm font-medium">{transaction.description}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getBadgeClass(transaction.category)}`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-emerald-600">
                  {transaction.income > 0 ? formatCurrency(transaction.income) : '-'}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-red-500">
                  {transaction.expense > 0 ? formatCurrency(transaction.expense) : '-'}
                </td>
                <td className="px-6 py-4 text-sm">{transaction.account}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-semibold hover:bg-red-200"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🗑️
            </div>
            <h3 className="text-xl font-bold text-center mb-6">Delete Transactions</h3>
            <div className="space-y-2 mb-6">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="delType" value="EARN" /> Delete all EARN
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="delType" value="OPEX" /> Delete all OPEX
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="delType" value="VAR" /> Delete all VAR
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="delType" value="CAPEX" /> Delete all CAPEX
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer">
                <input type="radio" name="delType" value="FIN" /> Delete all FIN
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 cursor-pointer text-red-600">
                <input type="radio" name="delType" value="ALL" /> ⚠️ Delete ALL
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-5 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex-1 px-5 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { Transaction } from '@/types/transaction'
import { transactionService } from '@/lib/transactions'
import { calculateSummary, calculateMonthlyData } from '@/lib/calculations'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import Dashboard from '@/components/Dashboard'
import Transactions from '@/components/Transactions'
import Reports from '@/components/Reports'
import IncomeStatement from '@/components/IncomeStatement'
import BalanceSheet from '@/components/BalanceSheet'
import CashFlow from '@/components/CashFlow'
import Toast from '@/components/Toast'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' as 'success' | 'error' })

  // Load transactions from Supabase
  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      const data = await transactionService.getAll()
      setTransactions(data)
    } catch (error) {
      console.error('Error loading transactions:', error)
      showToast('Failed to load transactions', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type })
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000)
  }

  const handleAddTransaction = async (transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await transactionService.create(transaction)
      await loadTransactions()
      showToast('Transaction added successfully!')
    } catch (error) {
      console.error('Error adding transaction:', error)
      showToast('Failed to add transaction', 'error')
    }
  }

  const handleDeleteTransaction = async (id: number) => {
    if (!confirm('Delete this transaction?')) return

    try {
      await transactionService.delete(id)
      await loadTransactions()
      showToast('Transaction deleted!')
    } catch (error) {
      console.error('Error deleting transaction:', error)
      showToast('Failed to delete transaction', 'error')
    }
  }

  const handleBulkDelete = async (category: string) => {
    try {
      if (category === 'ALL') {
        if (!confirm('Delete ALL transactions?')) return
        await transactionService.deleteAll()
      } else {
        await transactionService.bulkDeleteByCategory(category as any)
      }
      await loadTransactions()
      showToast('Transactions deleted!')
    } catch (error) {
      console.error('Error deleting transactions:', error)
      showToast('Failed to delete transactions', 'error')
    }
  }

  const summary = calculateSummary(transactions)
  const monthlyData = calculateMonthlyData(transactions)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 ml-60 min-h-screen">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <div className="p-8">
          <div data-tab="dashboard" className={activeTab === 'dashboard' ? 'active' : ''}>
            <Dashboard
              transactions={transactions}
              summary={summary}
              monthlyData={monthlyData}
              searchQuery={searchQuery}
            />
          </div>

          <div data-tab="transactions" className={activeTab === 'transactions' ? 'active' : ''}>
            <Transactions
              transactions={transactions}
              searchQuery={searchQuery}
              onAdd={handleAddTransaction}
              onDelete={handleDeleteTransaction}
              onBulkDelete={handleBulkDelete}
            />
          </div>

          <div data-tab="reports" className={activeTab === 'reports' ? 'active' : ''}>
            <Reports transactions={transactions} summary={summary} />
          </div>

          <div data-tab="income" className={activeTab === 'income' ? 'active' : ''}>
            <IncomeStatement summary={summary} />
          </div>

          <div data-tab="balance" className={activeTab === 'balance' ? 'active' : ''}>
            <BalanceSheet summary={summary} />
          </div>

          <div data-tab="cashflow" className={activeTab === 'cashflow' ? 'active' : ''}>
            <CashFlow summary={summary} />
          </div>
        </div>
      </main>

      <Toast show={toast.show} message={toast.message} type={toast.type} />
    </div>
  )
}

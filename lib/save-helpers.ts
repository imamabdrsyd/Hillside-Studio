/**
 * Hillside Studio - Database Save Functions Documentation
 *
 * Fungsi-fungsi untuk menyimpan data transaksi ke Supabase database
 */

import { transactionService } from './transactions'
import { TransactionCategory } from '@/types/transaction'

/**
 * 1. SAVE TRANSACTION (CREATE)
 * Menyimpan transaksi baru ke database
 *
 * @example
 * ```typescript
 * await saveTransaction({
 *   date: '2025-01-09',
 *   category: 'EARN',
 *   description: '2 nights/Guest Name',
 *   amount: 1000000,
 *   account: 'BCA'
 * })
 * ```
 */
export async function saveTransaction(data: {
  date: string
  category: TransactionCategory
  description: string
  amount: number
  account: string
}) {
  try {
    // Tentukan apakah income atau expense berdasarkan category
    const isIncome = data.category === 'EARN'

    const transaction = {
      date: data.date,
      category: data.category,
      description: data.description,
      income: isIncome ? data.amount : 0,
      expense: !isIncome ? data.amount : 0,
      account: data.account,
    }

    const result = await transactionService.create(transaction)
    console.log('✅ Transaction saved:', result)
    return { success: true, data: result }
  } catch (error) {
    console.error('❌ Error saving transaction:', error)
    return { success: false, error }
  }
}

/**
 * 2. SAVE MULTIPLE TRANSACTIONS (BULK INSERT)
 * Menyimpan banyak transaksi sekaligus
 *
 * @example
 * ```typescript
 * await saveBulkTransactions([
 *   { date: '2025-01-09', category: 'EARN', description: 'Payment 1', amount: 500000, account: 'BCA' },
 *   { date: '2025-01-10', category: 'OPEX', description: 'Rent', amount: 1000000, account: 'Cash' },
 * ])
 * ```
 */
export async function saveBulkTransactions(
  transactions: Array<{
    date: string
    category: TransactionCategory
    description: string
    amount: number
    account: string
  }>
) {
  try {
    const results = []
    for (const data of transactions) {
      const result = await saveTransaction(data)
      results.push(result)
    }

    const successCount = results.filter((r) => r.success).length
    console.log(`✅ Saved ${successCount}/${transactions.length} transactions`)

    return { success: true, results, successCount }
  } catch (error) {
    console.error('❌ Error bulk saving:', error)
    return { success: false, error }
  }
}

/**
 * 3. QUICK SAVE HELPERS
 * Helper functions untuk kategori spesifik
 */

// Save revenue/income
export async function saveRevenue(description: string, amount: number, account: string = 'BCA', date?: string) {
  return saveTransaction({
    date: date || new Date().toISOString().split('T')[0],
    category: 'EARN',
    description,
    amount,
    account,
  })
}

// Save operational expense
export async function saveOperationalExpense(description: string, amount: number, account: string = 'BCA', date?: string) {
  return saveTransaction({
    date: date || new Date().toISOString().split('T')[0],
    category: 'OPEX',
    description,
    amount,
    account,
  })
}

// Save variable cost
export async function saveVariableCost(description: string, amount: number, account: string = 'BCA', date?: string) {
  return saveTransaction({
    date: date || new Date().toISOString().split('T')[0],
    category: 'VAR',
    description,
    amount,
    account,
  })
}

// Save capital expenditure
export async function saveCapitalExpense(description: string, amount: number, account: string = 'BCA', date?: string) {
  return saveTransaction({
    date: date || new Date().toISOString().split('T')[0],
    category: 'CAPEX',
    description,
    amount,
    account,
  })
}

// Save financial/dividend
export async function saveFinancial(description: string, amount: number, account: string = 'Cash', date?: string) {
  return saveTransaction({
    date: date || new Date().toISOString().split('T')[0],
    category: 'FIN',
    description,
    amount,
    account,
  })
}

/**
 * 4. TEST DATABASE CONNECTION
 * Fungsi untuk test koneksi database
 */
export async function testDatabaseConnection() {
  try {
    console.log('🔍 Testing database connection...')
    const transactions = await transactionService.getAll()
    console.log(`✅ Connection successful! Found ${transactions.length} transactions`)
    return { success: true, count: transactions.length }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return { success: false, error }
  }
}

/**
 * 5. IMPORT FROM ARRAY
 * Import data dari array (misalnya dari CSV atau Excel)
 */
export async function importFromArray(
  data: Array<{
    tanggal: string
    kategori: string
    deskripsi: string
    jumlah: number
    akun: string
  }>
) {
  const categoryMap: Record<string, TransactionCategory> = {
    'PENDAPATAN': 'EARN',
    'EARN': 'EARN',
    'OPERASIONAL': 'OPEX',
    'OPEX': 'OPEX',
    'VARIABEL': 'VAR',
    'VAR': 'VAR',
    'MODAL': 'CAPEX',
    'CAPEX': 'CAPEX',
    'KEUANGAN': 'FIN',
    'FIN': 'FIN',
  }

  const transactions = data.map((item) => ({
    date: item.tanggal,
    category: categoryMap[item.kategori.toUpperCase()] || 'OPEX',
    description: item.deskripsi,
    amount: item.jumlah,
    account: item.akun,
  }))

  return saveBulkTransactions(transactions)
}

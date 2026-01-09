/**
 * TEST SCRIPT - Hillside Studio Database
 *
 * Script untuk test koneksi dan save data ke database
 *
 * Cara menggunakan:
 * 1. Pastikan .env.local sudah benar
 * 2. Pastikan database schema sudah dijalankan di Supabase
 * 3. Run: npm run dev
 * 4. Buka browser console dan test functions
 */

import {
  saveTransaction,
  saveRevenue,
  saveOperationalExpense,
  testDatabaseConnection,
  saveBulkTransactions
} from '@/lib/save-helpers'

/**
 * TEST 1: Test Database Connection
 */
export async function test1_Connection() {
  console.log('=== TEST 1: Database Connection ===')
  const result = await testDatabaseConnection()
  return result
}

/**
 * TEST 2: Save Single Transaction
 */
export async function test2_SaveSingle() {
  console.log('=== TEST 2: Save Single Transaction ===')

  const result = await saveTransaction({
    date: '2025-01-09',
    category: 'EARN',
    description: 'TEST - 1 night/Test Guest',
    amount: 500000,
    account: 'BCA'
  })

  return result
}

/**
 * TEST 3: Save Revenue (Quick Helper)
 */
export async function test3_SaveRevenue() {
  console.log('=== TEST 3: Save Revenue (Quick Helper) ===')

  const result = await saveRevenue(
    'TEST - 2 nights/Test Guest 2',
    750000,
    'BCA'
  )

  return result
}

/**
 * TEST 4: Save Expense
 */
export async function test4_SaveExpense() {
  console.log('=== TEST 4: Save Operational Expense ===')

  const result = await saveOperationalExpense(
    'TEST - Internet Bill',
    300000,
    'BCA'
  )

  return result
}

/**
 * TEST 5: Bulk Insert
 */
export async function test5_BulkInsert() {
  console.log('=== TEST 5: Bulk Insert Multiple Transactions ===')

  const transactions = [
    {
      date: '2025-01-09',
      category: 'EARN' as const,
      description: 'BULK TEST - Guest 1',
      amount: 600000,
      account: 'BCA'
    },
    {
      date: '2025-01-09',
      category: 'OPEX' as const,
      description: 'BULK TEST - Electricity',
      amount: 200000,
      account: 'BCA'
    },
    {
      date: '2025-01-09',
      category: 'VAR' as const,
      description: 'BULK TEST - Cleaning Supplies',
      amount: 50000,
      account: 'Cash'
    }
  ]

  const result = await saveBulkTransactions(transactions)
  return result
}

/**
 * RUN ALL TESTS
 */
export async function runAllTests() {
  console.log('🧪 ============================================')
  console.log('🧪 RUNNING ALL DATABASE TESTS')
  console.log('🧪 ============================================\n')

  const test1 = await test1_Connection()
  console.log('\n')

  if (!test1.success) {
    console.error('❌ Database connection failed. Please check:')
    console.error('1. Supabase credentials in .env.local')
    console.error('2. Database schema is created (run supabase-schema.sql)')
    console.error('3. Network connection')
    return
  }

  const test2 = await test2_SaveSingle()
  console.log('\n')

  const test3 = await test3_SaveRevenue()
  console.log('\n')

  const test4 = await test4_SaveExpense()
  console.log('\n')

  const test5 = await test5_BulkInsert()
  console.log('\n')

  console.log('🧪 ============================================')
  console.log('🧪 ALL TESTS COMPLETED')
  console.log('🧪 ============================================')

  return {
    connection: test1.success,
    singleSave: test2.success,
    quickHelper: test3.success,
    expense: test4.success,
    bulkInsert: test5.success,
  }
}

// Export untuk digunakan di browser console
if (typeof window !== 'undefined') {
  (window as any).testDB = {
    connection: test1_Connection,
    saveSingle: test2_SaveSingle,
    saveRevenue: test3_SaveRevenue,
    saveExpense: test4_SaveExpense,
    bulkInsert: test5_BulkInsert,
    runAll: runAllTests,
  }

  console.log('✅ Test functions loaded! Use in console:')
  console.log('   await testDB.connection()')
  console.log('   await testDB.saveSingle()')
  console.log('   await testDB.runAll()')
}

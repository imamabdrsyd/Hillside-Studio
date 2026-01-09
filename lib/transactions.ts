import { supabase } from './supabase'
import { Transaction, TransactionCategory } from '@/types/transaction'

export const transactionService = {
  // Get all transactions
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error
    return (data || []) as Transaction[]
  },

  // Get transactions by category
  async getByCategory(category: TransactionCategory): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: true })

    if (error) throw error
    return (data || []) as Transaction[]
  },

  // Get transactions by month
  async getByMonth(year: number, month: number): Promise<Transaction[]> {
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (error) throw error
    return (data || []) as Transaction[]
  },

  // Search transactions
  async search(query: string): Promise<Transaction[]> {
    const { data, error} = await supabase
      .from('transactions')
      .select('*')
      .or(`description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('date', { ascending: true })

    if (error) throw error
    return (data || []) as Transaction[]
  },

  // Add new transaction
  async create(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const { data, error } = await (supabase
      .from('transactions')
      .insert({
        date: transaction.date,
        category: transaction.category,
        description: transaction.description,
        income: transaction.income,
        expense: transaction.expense,
        account: transaction.account,
      })
      .select()
      .single() as any)

    if (error) throw error
    return data as Transaction
  },

  // Update transaction
  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const updateData: any = {}

    if (transaction.date) updateData.date = transaction.date
    if (transaction.category) updateData.category = transaction.category
    if (transaction.description) updateData.description = transaction.description
    if (transaction.income !== undefined) updateData.income = transaction.income
    if (transaction.expense !== undefined) updateData.expense = transaction.expense
    if (transaction.account) updateData.account = transaction.account

    const { data, error } = await (supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single() as any)

    if (error) throw error
    return data as Transaction
  },

  // Delete transaction
  async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Bulk delete by category
  async bulkDeleteByCategory(category: TransactionCategory): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('category', category)

    if (error) throw error
  },

  // Delete all transactions
  async deleteAll(): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .neq('id', 0) // Delete all where id != 0 (i.e., all records)

    if (error) throw error
  },
}

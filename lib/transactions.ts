import { supabase } from './supabase'
import { Transaction, TransactionCategory } from '@/types/transaction'
import { Database } from '@/types/database'

type TransactionInsert = Database['public']['Tables']['transactions']['Insert']

export const transactionService = {
  // Get all transactions
  async getAll(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Get transactions by category
  async getByCategory(category: TransactionCategory): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
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
    return data || []
  },

  // Search transactions
  async search(query: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .or(`description.ilike.%${query}%,category.ilike.%${query}%`)
      .order('date', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Add new transaction
  async create(transaction: TransactionInsert): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Update transaction
  async update(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
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

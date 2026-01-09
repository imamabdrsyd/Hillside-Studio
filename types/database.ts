export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: number
          date: string
          category: 'EARN' | 'OPEX' | 'VAR' | 'CAPEX' | 'FIN'
          description: string
          income: number
          expense: number
          account: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          date: string
          category: 'EARN' | 'OPEX' | 'VAR' | 'CAPEX' | 'FIN'
          description: string
          income?: number
          expense?: number
          account: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          date?: string
          category?: 'EARN' | 'OPEX' | 'VAR' | 'CAPEX' | 'FIN'
          description?: string
          income?: number
          expense?: number
          account?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

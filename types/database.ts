export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

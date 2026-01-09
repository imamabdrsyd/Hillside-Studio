-- Hillside Studio Database Schema
-- Run this in Supabase SQL Editor

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  category VARCHAR(10) NOT NULL CHECK (category IN ('EARN', 'OPEX', 'VAR', 'CAPEX', 'FIN')),
  description TEXT NOT NULL,
  income DECIMAL(12, 2) DEFAULT 0,
  expense DECIMAL(12, 2) DEFAULT 0,
  account VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_account ON transactions(account);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Allow all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON transactions
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Insert sample data (optional - migrate from existing data)
INSERT INTO transactions (date, category, description, income, expense, account) VALUES
  ('2025-01-02', 'EARN', '4 nights/Laras Dipa', 1312005, 0, 'BCA'),
  ('2025-01-04', 'FIN', 'Owners Withdrawal', 0, 811597, 'Cash'),
  ('2025-01-09', 'EARN', '2 nights/Edwin', 609021, 0, 'BCA'),
  ('2025-01-10', 'CAPEX', 'Vitrase', 0, 240000, 'BCA'),
  ('2025-01-12', 'EARN', '1 night/Luisa', 734464, 0, 'BCA'),
  ('2025-01-19', 'OPEX', 'Indihome', 0, 319808, 'BCA'),
  ('2025-01-20', 'EARN', '3 nights/Karina', 1029536, 0, 'BCA'),
  ('2025-01-20', 'OPEX', 'IPL', 0, 776024, 'Jago'),
  ('2025-01-24', 'OPEX', 'Kosan', 0, 665000, 'Jago'),
  ('2025-01-30', 'EARN', '2 nights/Paramita', 790515, 0, 'BCA');

-- Create a view for financial summary
CREATE OR REPLACE VIEW financial_summary AS
SELECT
  EXTRACT(YEAR FROM date) as year,
  EXTRACT(MONTH FROM date) as month,
  category,
  SUM(income) as total_income,
  SUM(expense) as total_expense,
  COUNT(*) as transaction_count
FROM transactions
GROUP BY year, month, category
ORDER BY year DESC, month DESC, category;

COMMENT ON TABLE transactions IS 'Stores all financial transactions for Hillside Studio';
COMMENT ON COLUMN transactions.category IS 'EARN=Revenue, OPEX=Operational Expense, VAR=Variable Cost, CAPEX=Capital Expenditure, FIN=Financial/Dividends';

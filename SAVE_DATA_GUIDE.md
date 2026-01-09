# 💾 Panduan Save Data ke Database

## 📋 Cara Kerja Save Data

Aplikasi Hillside Studio menggunakan **3 layer** untuk save data:

```
Form UI → Handler Function → Supabase Service → Database
```

### 1️⃣ Form Input (UI Layer)
**File**: `components/Transactions.tsx`

User mengisi form dengan fields:
- **Date**: Tanggal transaksi
- **Category**: EARN/OPEX/VAR/CAPEX/FIN
- **Description**: Deskripsi transaksi
- **Amount**: Jumlah uang
- **Account**: BCA/Jago/Cash

### 2️⃣ Handler Function (Logic Layer)
**File**: `app/page.tsx`

```typescript
const handleAddTransaction = async (transaction) => {
  try {
    await transactionService.create(transaction)  // ← Save ke database
    await loadTransactions()                      // ← Reload data
    showToast('Transaction added successfully!')  // ← Tampilkan notifikasi
  } catch (error) {
    showToast('Failed to add transaction', 'error')
  }
}
```

### 3️⃣ Database Service (Data Layer)
**File**: `lib/transactions.ts`

```typescript
async create(transaction) {
  const { data, error } = await supabase
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
    .single()

  if (error) throw error
  return data
}
```

---

## 🚀 Cara Menggunakan

### A. Via UI (User Interface)

1. Buka aplikasi di browser
2. Klik tab **"Transactions"**
3. Isi form:
   - Date: `2025-01-09`
   - Category: `EARN` (untuk pendapatan)
   - Description: `2 nights/Guest Name`
   - Amount: `1000000`
   - Account: `BCA`
4. Klik **"Add Transaction"**
5. Data otomatis tersimpan ke database! ✅

### B. Via Code (Programmatically)

```typescript
import { saveTransaction, saveRevenue } from '@/lib/save-helpers'

// Method 1: General save
await saveTransaction({
  date: '2025-01-09',
  category: 'EARN',
  description: '3 nights/Guest Name',
  amount: 1500000,
  account: 'BCA'
})

// Method 2: Quick helper (lebih simple!)
await saveRevenue('2 nights/Guest Name', 1000000, 'BCA')
await saveOperationalExpense('Internet', 300000, 'BCA')
await saveVariableCost('Cleaning', 50000, 'Cash')
```

### C. Bulk Insert (Banyak Data Sekaligus)

```typescript
import { saveBulkTransactions } from '@/lib/save-helpers'

const data = [
  { date: '2025-01-09', category: 'EARN', description: 'Guest 1', amount: 500000, account: 'BCA' },
  { date: '2025-01-10', category: 'OPEX', description: 'Rent', amount: 1000000, account: 'Cash' },
  { date: '2025-01-11', category: 'VAR', description: 'Supplies', amount: 50000, account: 'Cash' },
]

await saveBulkTransactions(data)
```

---

## 🧪 Testing Database

### Test Koneksi Database

```typescript
import { testDatabaseConnection } from '@/lib/save-helpers'

const result = await testDatabaseConnection()
// ✅ Connection successful! Found 44 transactions
```

### Test via Browser Console

1. Jalankan aplikasi: `npm run dev`
2. Buka browser di http://localhost:3000
3. Buka **Developer Console** (F12)
4. Run tests:

```javascript
// Import test functions
import('@/lib/test-database').then(m => window.testDB = m)

// Test koneksi
await testDB.connection()

// Test save single transaction
await testDB.saveSingle()

// Test save revenue
await testDB.saveRevenue()

// Run semua tests
await testDB.runAll()
```

---

## ⚠️ Troubleshooting

### Error: "Missing Supabase environment variables"

**Solusi**:
1. Cek file `.env.local` exists
2. Pastikan isi credentials benar:
```
NEXT_PUBLIC_SUPABASE_URL=https://vrtubmgeipellkfsfdbc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI...
```
3. Restart dev server: `npm run dev`

### Error: "relation 'transactions' does not exist"

**Solusi**:
1. Buka Supabase SQL Editor
2. Run script dari file `supabase-schema.sql`
3. Refresh aplikasi

### Error: "No rows returned"

**Solusi**:
- Database empty (normal untuk database baru)
- Tambah data via UI atau test script

### Data tidak muncul setelah save

**Solusi**:
1. Check browser console untuk errors
2. Refresh halaman (F5)
3. Check Supabase dashboard → Table Editor
4. Verify RLS policies enabled

---

## 📊 Struktur Data

Setiap transaction yang disimpan memiliki struktur:

```typescript
{
  id: 1,                          // Auto-generated
  date: '2025-01-09',             // Tanggal transaksi
  category: 'EARN',               // EARN|OPEX|VAR|CAPEX|FIN
  description: '2 nights/Guest',  // Deskripsi
  income: 1000000,                // Pendapatan (jika EARN)
  expense: 0,                     // Pengeluaran (jika bukan EARN)
  account: 'BCA',                 // Account: BCA|Jago|Cash
  created_at: '2025-01-09 10:00', // Auto-generated
  updated_at: '2025-01-09 10:00'  // Auto-generated
}
```

---

## 🎯 Quick Reference

| Category | Description | Example |
|----------|-------------|---------|
| **EARN** | Revenue/Pendapatan | Sewa kamar, booking |
| **OPEX** | Operational Expense | Listrik, internet, gaji |
| **VAR** | Variable Cost | Supplies, maintenance |
| **CAPEX** | Capital Expenditure | Furniture, equipment |
| **FIN** | Financial/Dividends | Withdrawal, dividends |

---

## 📝 Files Reference

| File | Purpose |
|------|---------|
| `lib/transactions.ts` | Core CRUD operations |
| `lib/save-helpers.ts` | Helper functions untuk save |
| `lib/test-database.ts` | Testing utilities |
| `components/Transactions.tsx` | UI Form |
| `app/page.tsx` | Main app logic |

---

## ✅ Checklist

Sebelum save data, pastikan:

- [ ] Database schema sudah dijalankan di Supabase
- [ ] `.env.local` sudah ada dan benar
- [ ] Development server running (`npm run dev`)
- [ ] Browser console tidak ada error
- [ ] Test connection berhasil

Setelah save data:

- [ ] Data muncul di UI
- [ ] Toast notification muncul
- [ ] Data ada di Supabase Table Editor
- [ ] Dashboard metrics update

---

## 🆘 Butuh Bantuan?

1. Check browser console untuk error messages
2. Verify Supabase credentials
3. Run test scripts untuk diagnose
4. Check Supabase dashboard logs

**Happy Coding!** 🎉

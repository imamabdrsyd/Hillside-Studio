# Hillside Studio - Financial Management System

A modern financial management system built with Next.js, TypeScript, Tailwind CSS, and Supabase for Hillside Studio.

## 🚀 Features

- **Dashboard**: Real-time financial overview with charts and metrics
- **Transaction Management**: Add, edit, delete, and bulk operations
- **Financial Reports**: Income Statement, Balance Sheet, Cash Flow
- **Export to PDF**: Generate professional financial reports
- **Real-time Sync**: All data synced with Supabase database
- **Responsive Design**: Beautiful UI with Tailwind CSS

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (create one at [supabase.com](https://supabase.com))
- Git installed

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Hillside-Studio
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Supabase Database

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project (or use your existing "Hillside Studio" project)
3. Go to **SQL Editor** in your Supabase dashboard
4. Copy the contents of `supabase-schema.sql` and run it in the SQL Editor

This will:
- Create the `transactions` table with proper schema
- Set up indexes for better performance
- Enable Row Level Security (RLS)
- Insert sample data (optional)

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project
   - Click on **Settings** → **API**
   - Copy the **Project URL** and **anon/public** key

3. Update `.env.local` with your credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Hillside-Studio/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main application page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard.tsx      # Dashboard view
│   ├── Transactions.tsx   # Transaction management
│   ├── Reports.tsx        # Financial reports
│   ├── IncomeStatement.tsx
│   ├── BalanceSheet.tsx
│   ├── CashFlow.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── Toast.tsx
├── lib/                   # Utilities and services
│   ├── supabase.ts       # Supabase client config
│   ├── transactions.ts   # Transaction CRUD operations
│   └── calculations.ts   # Financial calculations
├── types/                 # TypeScript type definitions
│   ├── database.ts       # Database types
│   └── transaction.ts    # Transaction types
├── supabase-schema.sql   # Database schema
└── README.md

```

## 💾 Database Schema

The application uses a single `transactions` table with the following structure:

| Column      | Type        | Description                              |
|-------------|-------------|------------------------------------------|
| id          | BIGSERIAL   | Primary key                             |
| date        | DATE        | Transaction date                        |
| category    | VARCHAR(10) | EARN, OPEX, VAR, CAPEX, or FIN         |
| description | TEXT        | Transaction description                 |
| income      | DECIMAL     | Income amount (for EARN category)       |
| expense     | DECIMAL     | Expense amount (for other categories)   |
| account     | VARCHAR(50) | Account name (BCA, Jago, Cash)         |
| created_at  | TIMESTAMP   | Record creation timestamp               |
| updated_at  | TIMESTAMP   | Record update timestamp                 |

## 🎨 Category Types

- **EARN**: Revenue/Income
- **OPEX**: Operational Expenses
- **VAR**: Variable Costs
- **CAPEX**: Capital Expenditures
- **FIN**: Financial/Dividends

## 📊 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

Vercel will automatically detect Next.js and configure the build settings.

## 🔒 Security Notes

- Never commit `.env.local` to version control
- Use Supabase Row Level Security (RLS) policies
- The anon key is safe to use in client-side code
- For production, consider adding authentication

## 📝 Migration from HTML Version

The original static HTML version has been converted to:
- ✅ Next.js with TypeScript for better type safety
- ✅ Supabase for persistent database storage
- ✅ React components for better maintainability
- ✅ Server-side data fetching capabilities
- ✅ API routes for secure operations

The original `index.html` is preserved for reference.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

ISC

---

Built with ❤️ for Hillside Studio

# 🏦 Family FinTech SaaS

> Atur Keuangan Rumah Tangga, Tanpa Drama

Aplikasi manajemen keuangan keluarga modern dengan fitur multi-wallet, budgeting, analytics, dan collaboration antar anggota keluarga.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Latest-green?logo=supabase)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## ✨ Features

### 👥 Multi-User Household
- **Household Management** - Create or join household dengan invite code
- **Role-based Access** - Owner dan Member dengan permission berbeda
- **Member Contributions** - Track kontribusi setiap anggota keluarga

### 💰 Wallet & Transaction Management
- **Multiple Wallets** - Cash, Bank, E-wallet, Credit Card, Investment
- **Transaction Tracking** - Income & expense dengan kategori
- **Wallet Transfer** - Transfer antar wallet dengan mudah
- **Real-time Balance** - Saldo ter-update otomatis via database triggers

### 📊 Budget & Analytics
- **Budget Planning** - Set budget per kategori (monthly/yearly)
- **Progress Tracking** - Visual progress dengan color-coded indicators
- **Expense Analytics** - Pie chart, bar chart, trend analysis
- **Category Breakdown** - Analisis pengeluaran per kategori
- **Wallet Distribution** - Distribusi aset per wallet

### 📈 Reports & Insights
- **Buku Kas** - Ledger transaksi lengkap dengan filter
- **Date Range Filter** - Filter berdasarkan periode tertentu
- **Wallet Filter** - Filter per wallet spesifik
- **Print Ready** - Optimized untuk print/export PDF

### 🎨 UI/UX
- **Responsive Design** - Mobile-first, tablet & desktop friendly
- **Dark Mode** - System, light, dan dark theme
- **PWA Ready** - Installable sebagai Progressive Web App
- **Hamburger Menu** - Mobile navigation dengan sidebar toggle
- **Modern Design** - Clean interface dengan Shadcn UI components

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Theme:** next-themes
- **Icons:** Lucide React
- **Date:** date-fns

### Backend
- **Database:** PostgreSQL (via Supabase)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime
- **RLS:** Row Level Security enabled

### DevOps
- **Hosting:** Vercel (recommended)
- **Database:** Supabase Cloud
- **Version Control:** Git

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/family-fintech-saas.git
cd family-fintech-saas
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Setup Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run database migrations**
   - Execute SQL files in `lib/schema/` in order:
     1. `supabase_schema.sql`
     2. `supabase_schema_transactions.sql`
     3. `supabase_schema_budgets.sql`
     4. `migration_wallets.sql`
     5. `trigger_update_wallet_balance.sql`
     6. All `fix_rls_*.sql` files
     7. `add_email_to_profiles.sql`

5. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
family-fintech-saas/
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── auth/            # Auth callback
│   ├── dashboard/       # Dashboard pages
│   │   ├── analytics/
│   │   ├── budget/
│   │   ├── reports/
│   │   ├── settings/
│   │   ├── transactions/
│   │   └── wallets/
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── analytics/       # Chart components
│   ├── auth/           # Auth forms
│   ├── budget/         # Budget components
│   ├── dashboard/      # Dashboard components
│   ├── onboarding/     # Onboarding flows
│   ├── reports/        # Report components
│   ├── settings/       # Settings components
│   ├── transactions/   # Transaction components
│   ├── wallets/        # Wallet components
│   └── ui/            # Shadcn UI components
├── lib/
│   ├── actions/        # Server actions
│   ├── schema/         # Database schemas
│   ├── supabase/       # Supabase clients
│   ├── validations/    # Zod schemas
│   └── utils.ts        # Utility functions
├── public/
│   ├── icons/          # PWA icons
│   └── manifest.json   # PWA manifest
└── middleware.ts       # Auth middleware
```

## 🔒 Security

- **Row Level Security (RLS)** - All tables protected with RLS policies
- **Authentication** - Supabase Auth dengan email/password
- **Authorization** - Role-based access (Owner/Member)
- **Input Validation** - Zod schemas untuk semua forms
- **SQL Injection** - Protected via Supabase parameterized queries

## 🎯 Key Features Implementation

### Wallet Balance Auto-update
Database trigger automatically updates wallet balance when transactions are added/deleted:
```sql
-- See: lib/schema/trigger_update_wallet_balance.sql
CREATE TRIGGER update_wallet_balance_trigger
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();
```

### Household Collaboration
Members can view all household transactions but only owners can manage members:
```typescript
// RLS Policy ensures data isolation per household
await supabase
  .from('transactions')
  .select('*')
  // Automatically filtered by household_id via RLS
```

### Responsive Design
Mobile-first approach with breakpoints:
- **Mobile:** `< 768px` - Card layouts, hamburger menu
- **Tablet:** `768px - 1024px` - Hybrid layouts
- **Desktop:** `> 1024px` - Full table views

## 📱 PWA Features

- ✅ Installable on mobile & desktop
- ✅ Offline-ready (service worker)
- ✅ App icons (192x192, 512x512)
- ✅ Theme color adaptation
- ✅ Standalone display mode

## 🧪 Building & Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npx vercel
```

**Environment Variables:**
Make sure to add these to your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🐛 Known Issues & Fixes

### ✅ Resolved
- ✅ Double scroll issue (duplicate children render)
- ✅ Type errors in Zod schemas (removed `coerce`, added manual parsing)
- ✅ Chart tooltip undefined values
- ✅ ESLint warnings (React Compiler + unused imports)
- ✅ Hydration warnings (ThemeProvider)

### 📝 To-Do
- [ ] Unit tests with Vitest
- [ ] E2E tests with Playwright
- [ ] Email notifications
- [ ] Export to CSV/Excel
- [ ] Recurring transactions
- [ ] Mobile app (React Native)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

---

**Made with ❤️ for Indonesian Families**

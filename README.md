# SolMarket - Solana-Based Decentralized Marketplace

![Status](https://img.shields.io/badge/status-MVP%20Ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.5-black)
![Solana](https://img.shields.io/badge/Solana-Devnet-purple)

A fully-featured decentralized marketplace built on Solana with escrow-protected transactions, auctions, and raffles.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- A Solana wallet (Phantom or Solflare recommended)
- PostgreSQL database (we use Neon)

### Development Setup

```bash
# Navigate to the active implementation
cd SolMarket

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## ✨ Features

### ✅ Implemented & Production-Ready
- **Authentication**: Google OAuth with NextAuth.js
- **Solana Wallet Integration**: Phantom & Solflare support via Gill adapter
- **Escrow System**: Secure on-chain SOL escrow with PDA-based accounts
- **Product Marketplace**: Create, browse, and purchase products
- **Shopping Cart**: Multi-item cart with checkout flow
- **Order Management**: Complete order lifecycle with escrow funding
- **Rate Limiting**: 30 requests/minute API protection
- **Error Handling**: React error boundaries + logging system
- **Database**: PostgreSQL with complete schema (merchants, products, orders, auctions, raffles)

### ⚠️ Partially Implemented
- **Auctions**: Database + UI ready, smart contract is stub only
- **Raffles**: Database + UI ready, smart contract is stub only
- **Testing**: Basic unit tests (needs expansion)

### 📋 Roadmap (Phase 2)
- Image upload & storage
- Product search & filtering
- Complete auction smart contract
- Complete raffle smart contract with VRF
- Admin dashboard
- SPL token payments (USDC, USDT)
- Order fulfillment workflow
- Mobile optimization

## 🏗️ Architecture

```
SolMarket/
├── anchor/               # Solana smart contracts
│   ├── programs/
│   │   ├── solmarket/   # Escrow program (✅ Complete)
│   │   ├── auction/     # Auction program (⚠️ Stub)
│   │   └── raffle/      # Raffle program (⚠️ Stub)
│   └── src/client/      # Generated TypeScript clients
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── api/         # API routes
│   │   ├── shop/        # Shop page
│   │   ├── cart/        # Cart page
│   │   ├── checkout/    # Checkout flow
│   │   └── ...
│   ├── components/      # React components
│   │   ├── solana/      # Wallet integration
│   │   ├── shop/        # Shopping components
│   │   └── ui/          # UI primitives (Radix)
│   ├── lib/             # Utilities
│   │   ├── auth.ts      # Authentication
│   │   ├── db.ts        # Database
│   │   ├── rate-limit.ts # Rate limiting
│   │   └── monitoring.ts # Error tracking
│   └── features/        # Feature modules
└── ...
```

## 🔐 Environment Variables

### Required

```bash
# Database
NEON_DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Authentication
NEXTAUTH_SECRET=<32+ character random string>
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>

# Solana
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_ESCROW_EXPIRY_SECS=259200
```

See [`.env.example`](SolMarket/.env.example) for complete list.

## 🧪 Testing

```bash
cd SolMarket

# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run Anchor tests
npm run anchor-test
```

Current test coverage:
- ✅ Authentication module
- ✅ Rate limiting
- ✅ Database connection
- ✅ Basic smoke tests

## 🚢 Deployment

### cPanel Deployment (Recommended)

Complete step-by-step guide: [`CPANEL_DEPLOYMENT.md`](CPANEL_DEPLOYMENT.md)

Quick deploy:
```bash
cd SolMarket
npm run build
# Upload to cPanel and configure Node.js app
```

### Vercel/Railway/Other

```bash
cd SolMarket
npm run build
npm start
```

Set environment variables in your hosting platform's dashboard.

## 📚 Documentation

- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Complete feature status
- **[cPanel Deployment Guide](CPANEL_DEPLOYMENT.md)** - Detailed deployment steps
- **[Environment Setup](ENVIRONMENT_SETUP.md)** - Environment variable reference
- **[Deployment Checklist](DEPLOYMENT_CHECKLIST.md)** - Pre/post deployment tasks
- **[Quick Start Guide](QUICK_START.md)** - Fast deployment overview

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Sonner** - Toast notifications

### Blockchain
- **Solana** - L1 blockchain
- **Anchor 0.30.1** - Smart contract framework
- **Gill 0.11.0** - Modern Solana wallet adapter
- **@wallet-ui/react** - Wallet UI components

### Backend
- **Next.js API Routes** - Serverless API
- **NextAuth.js v5** - Authentication
- **Neon PostgreSQL** - Database
- **Vitest** - Testing framework

## 🤝 Contributing

This is an active development project. Contributions are welcome!

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Follow existing patterns in the codebase

## 📊 Project Status

**Current Version**: 1.0.0-beta  
**Status**: MVP Ready for Staging Deployment

### Completed (Phase 1) ✅
1. Authentication integration
2. Escrow funding flow
3. API security & rate limiting
4. Testing infrastructure
5. Monitoring & error tracking

### In Progress (Phase 2)
- Image upload system
- Product search & filtering
- Complete auction/raffle smart contracts
- Admin dashboard

### Planned (Phase 3)
- SPL token payments
- Order fulfillment
- Dispute resolution
- Mobile optimization

See [Implementation Summary](IMPLEMENTATION_SUMMARY.md) for detailed status.

## 🔒 Security

- ✅ API rate limiting (30 req/min per IP)
- ✅ Input validation on all endpoints
- ✅ NextAuth.js session management
- ✅ Escrow smart contract security
- ⚠️ Smart contract audit pending (Phase 4)

Report security issues to: [your-email@example.com]

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Built with [create-solana-dapp](https://github.com/solana-developers/create-solana-dapp)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Wallet adapter powered by [Gill](https://github.com/anza-xyz/gill)

## 📞 Support

- **Documentation**: See `/docs` folder
- **Issues**: Open a GitHub issue
- **Discussions**: Start a GitHub discussion

---

**Built with ❤️ on Solana**

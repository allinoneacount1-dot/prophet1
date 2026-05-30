# Prophet Dashboard

A modern Web3 dashboard built with TanStack Start, React 19, Tailwind CSS, and Wagmi.

## Features

- Real-time portfolio mock data with multi-chain allocation
- Token swap simulator (Jupiter/Uniswap style)
- Live activity ticker
- DeAI Alert Builder (AI-powered on-chain/off-chain triggers)
- Responsive design with glassmorphism UI
- Animations powered by Framer Motion
- Wallet connect ready (Wagmi + Web3Modal)
- Modular component architecture

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + Vite)
- **UI:** Tailwind CSS v4 + Radix UI + Lucide Icons
- **State:** TanStack Query & Router (built-in Start)
- **Web3:** Wagmi v3 + Viem + WalletConnect
- **Animations:** Framer Motion
- **Toast:** Sonner
- **Charts:** Recharts (used elsewhere)
- **Linting:** ESLint + Prettier + TypeScript

## Getting Started

### Prerequisites

- Node.js >= 18
- bun (optional) or npm/yarn/pnpm
- A wallet provider (MetaMask, Phantom, etc.) for Web3 features

### Installation

```bash
# Clone the repo
git clone https://github.com/allinoneacount1-dot/prophet1.git
cd prophet1

# Install dependencies
npm install
# or
# bun install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID | `abc123...` |
| `VITE_ALCHEMY_API_KEY` | Alchemy API key (optional) | `demo` |
| `VITE_GOOGLE_ANALYTICS_ID` | Google Analytics ID (optional) | `G-XXXXXXXXXX` |

### Development

```bash
npm run dev
# or
# bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
# or
# bun build
```

Preview the production build locally:

```bash
npm run preview
# or
# bun preview
```

### Deployment

This project is configured for easy deployment to Vercel:

1. Push to GitHub
2. Import repository in Vercel
3. Vercel will automatically detect it's a Vite app and deploy

### Environment Variables on Vercel

Add the same variables in Vercel project settings under "Environment Variables".

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── app/            # Dashboard-specific components
│   └── ui/             # Generic UI (buttons, inputs, etc.)
├── lib/                # Custom hooks, utilities, config
│   ├── mock.ts         # Mock data hooks (useLivePrice, useTicker, etc.)
│   ├── chain.ts        # Chain constants
│   ├── wagmi.ts        # Wagmi configuration
│   └── usePortfolio.ts # Custom hook for portfolio data
├── routes/             # TanStack Start file-based routes
│   ├── _app.dashboard.tsx   # Main dashboard (refactored)
│   ├── _app.tsx              # Root layout
│   └── index.tsx             # Home page
├── public/             # Static assets
└── styles.css          # Global Tailwind styles
```

## Development Guidelines

- **Component First:** Break down large components into smaller, reusable ones.
- **Data Fetching:** Use custom hooks in `lib/` for data logic.
- **Styling:** Use Tailwind utility classes; extend `tailwind.config.ts` if needed.
- **Animations:** Use Framer Motion for page transitions and micro-interactions.
- **Web3:** Wagmi is configured in `lib/wagmi.ts`. Use `useAccount`, `useConnect`, etc.
- **Mock Data:** All data in dashboard is mock for demonstration. Replace with real API calls in production.

## License

MIT

## Acknowledgments

- TanStack Team for Start and Router
- Tailwind CSS
- Wagmi Team
- Framer Motion
- Lucide Icons
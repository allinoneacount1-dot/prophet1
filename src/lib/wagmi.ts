import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, base, bsc } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || ''

if (!projectId) {
  console.warn('VITE_WALLETCONNECT_PROJECT_ID is not set. Please set it in your .env file.')
}

export const config = defaultWagmiConfig({
  chains: [mainnet, sepolia, base, bsc],
  projectId,
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  metadata: {
    name: 'Prophet',
    description: 'Prophet — AI Multi-Chain Wealth OS',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:8080',
    icons: [import.meta.env.VITE_APP_LOGO_URL || 'http://localhost:8080/prophet-logo.png']
  }
})

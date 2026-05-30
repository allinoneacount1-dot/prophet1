import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { cookieStorage, createStorage } from 'wagmi'
import { mainnet, sepolia, base, bsc } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = 'd4d049a81df98c9f13ef7bfcf08599d5'

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
    url: 'http://localhost:8080',
    icons: ['http://localhost:8080/prophet-logo.png']
  }
})

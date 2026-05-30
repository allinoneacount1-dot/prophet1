import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { shortAddr } from '../../lib/chain'

export function ConnectWallet() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // Shorten address for display
  const shortAddress = shortAddr(address || null)

  return (
    <div className="flex items-center gap-2">
      {isConnected ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 rounded-xl border border-border bg-surface-1/60 px-4 py-2"
        >
          <div className="h-8 w-8 rounded-full bg-[color:var(--chain)]/20 flex items-center justify-center text-[color:var(--chain)]">
            <Wallet className="h-4 w-4" />
          </div>
          <div className="text-sm font-semibold">{shortAddress}</div>
          <button
            onClick={() => disconnect()}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Disconnect
          </button>
        </motion.div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => open()}
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-4 py-2 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-[color:var(--chain)]/20 transition-all"
        >
          <Wallet className="h-4 w-4" />
          Connect Wallet
        </motion.button>
      )}
    </div>
  )
}

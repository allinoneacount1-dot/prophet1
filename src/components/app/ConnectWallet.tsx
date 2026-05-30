import { Wallet } from "lucide-react";
import { motion } from "framer-motion";

export function ConnectWallet() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(135deg,var(--prophet),var(--chain))] px-4 py-2 text-sm font-semibold text-primary-foreground"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </motion.button>
  );
}
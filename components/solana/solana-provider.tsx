"use client"

import { ReactNode, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"
import { CustomWalletModalProvider } from "./custom-wallet-modal-provider"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@solana/wallet-adapter-react-ui/styles.css"

export function SolanaProvider({ children }: { children: ReactNode }) {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), [])
  const wallets = useMemo(() => {
    // Explicitly create only Solana wallets
    const phantom = new PhantomWalletAdapter()
    const solflare = new SolflareWalletAdapter()

    // Return only the wallets we explicitly created
    // This ensures no auto-detected wallets (like MetaMask) are included
    return [phantom, solflare]
  }, [])

  const queryClient = useMemo(() => new QueryClient(), [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false}>
        <CustomWalletModalProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </CustomWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}





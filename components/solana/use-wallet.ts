"use client"

import { useWallet } from "@solana/wallet-adapter-react"

export function useSolanaWallet() {
  const wallet = useWallet()
  const address = wallet.publicKey?.toBase58() ?? ""
  const truncated =
    address ? `${address.slice(0, 4)}…${address.slice(-4)}` : ""
  return {
    ...wallet,
    address,
    label: truncated,
  }
}





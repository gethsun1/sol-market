"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useWalletModal } from "@/components/solana/custom-wallet-modal-provider"
import { useSolanaWallet } from "@/components/solana/use-wallet"

export default function HeroSection() {
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const sol = useSolanaWallet()
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/2 -top-1/2 h-full w-full rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 blur-3xl animate-pulse" />
        <div className="absolute -right-1/2 -bottom-1/2 h-full w-full rounded-full bg-gradient-to-l from-purple-500/10 to-cyan-500/10 blur-3xl animate-pulse" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-cyan-400" />
          <span className="text-sm text-cyan-300">Secured by Solana</span>
        </div>

        {/* Main heading with gradient */}
        <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl font-bold gradient-text text-balance">
          Decentralized
          <br />
          Marketplace
        </h1>

        {/* Subheading */}
        <p className="mx-auto mb-12 max-w-2xl text-lg text-foreground/70">
          Buy and sell merchandise securely using Solana tokens. Every transaction protected by smart contract escrow
          for complete peace of mind.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 h-12 px-8 text-base">
                {sol.connected && sol.label ? sol.label : "Connect to Start"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuItem onClick={() => signIn("google")}>Sign in with Google</DropdownMenuItem>
              <DropdownMenuSeparator />
              {sol.connected ? (
                <DropdownMenuItem onClick={() => sol.disconnect()}>Disconnect Solana Wallet</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => setVisible(true)}>Connect Solana Wallet</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            className="border border-foreground/20 hover:border-cyan-500/50 h-12 px-8 text-base bg-transparent"
          >
            Explore <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
          <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6">
            <div className="text-3xl font-bold mb-2">1.2M SOL</div>
            <div className="text-sm text-foreground/60">Total Volume</div>
          </div>
          <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6">
            <div className="text-3xl font-bold mb-2">12,450</div>
            <div className="text-sm text-foreground/60">Active Users</div>
          </div>
          <div className="rounded-lg border border-border bg-card/50 backdrop-blur p-6">
            <div className="text-3xl font-bold mb-2">45.2K</div>
            <div className="text-sm text-foreground/60">Transactions</div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { Sun, Moon } from "lucide-react"
import { CreateListingModal } from "@/components/create-listing-modal"
import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useSolanaWallet } from "@/components/solana/use-wallet"
import { useWalletModal } from "@/components/solana/custom-wallet-modal-provider"

import { useTheme } from "next-themes"

export default function Navbar() {
  const [walletConnected, setWalletConnected] = useState(false)
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const sol = useSolanaWallet()
  const { setVisible } = useWalletModal()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gradient-to-br from-purple-500 to-cyan-500">
            <span className="text-white">◈</span>
          </div>
          <span className="gradient-text">SolMarket</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className="text-foreground/70 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link href="/marketplace" className="text-foreground/70 hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <Link href="/web3-news" className="text-foreground/70 hover:text-foreground transition-colors">
            Web3 News
          </Link>
          <Link href="/raffles" className="text-foreground/70 hover:text-foreground transition-colors">
            Raffles
          </Link>
          <Link href="/auctions" className="text-foreground/70 hover:text-foreground transition-colors">
            Auctions
          </Link>
          <Link href="/transactions" className="text-foreground/70 hover:text-foreground transition-colors">
            Transactions
          </Link>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-4">
          <CreateListingModal />
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center justify-center p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
                {sol.connected && sol.label
                  ? sol.label
                  : status === "authenticated"
                    ? (session?.user?.name || session?.user?.email)
                    : "Sign in"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
              {status === "authenticated" ? (
                <>
                  <DropdownMenuItem onClick={() => signOut()}>Sign out (Google)</DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => signIn("google")}>Sign in with Google</DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              {sol.connected ? (
                <DropdownMenuItem onClick={() => sol.disconnect()}>Disconnect Solana Wallet</DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => {
                    setVisible(true)
                  }}
                >
                  Connect Solana Wallet
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

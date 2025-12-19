"use client"

import Link from "next/link"
import { Sun, Moon, Sparkles } from "lucide-react"
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
import { useRouter, usePathname } from "next/navigation"
import { useSolanaWallet } from "@/components/solana/use-wallet"
import { useWalletModal } from "@/components/solana/custom-wallet-modal-provider"

import { useTheme } from "next-themes"

export default function Navbar() {
  const [walletConnected, setWalletConnected] = useState(false)
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const sol = useSolanaWallet()
  const { setVisible } = useWalletModal()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/marketplace", label: "Marketplace" },
    { href: "/web3-news", label: "Web3 News" },
    { href: "/raffles", label: "Raffles" },
    { href: "/auctions", label: "Auctions" },
    { href: "/transactions", label: "Transactions" },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 glass-strong backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo with glow effect */}
        <Link href="/" className="flex items-center gap-3 text-xl font-bold group">
          <div className="relative">
            <img
              src="/makena-logo.jpeg"
              alt="Makena E-commerce"
              className="h-12 w-auto rounded-lg object-contain transition-transform group-hover:scale-110 group-hover:rotate-3"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
          </div>
          <span className="gradient-text-vibrant hidden sm:inline-block">Makena E-commerce</span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                    ? "text-foreground"
                    : "text-foreground/70 hover:text-foreground hover:bg-white/5"
                  }`}
              >
                {link.label}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full animate-pulse-glow" />
                )}
              </Link>
            )
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <CreateListingModal />

          {/* Theme toggle with animation */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center justify-center p-2.5 hover:bg-accent rounded-lg transition-all glass hover:scale-110"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-purple-400" />
            <span className="sr-only">Toggle theme</span>
          </button>

          {/* Connect button with enhanced styling */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="relative overflow-hidden bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 text-white border-0 shadow-lg glow-on-hover font-semibold">
                <span className="relative z-10 flex items-center gap-2">
                  {sol.connected && sol.label ? (
                    <>
                      <Sparkles className="h-4 w-4" />
                      {sol.label}
                    </>
                  ) : status === "authenticated" ? (
                    session?.user?.name || session?.user?.email
                  ) : (
                    "Sign in"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56 glass-strong border-border/50">
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


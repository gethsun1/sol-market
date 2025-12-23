"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Plus, Send } from "lucide-react"
import Link from "next/link"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { useSolanaWallet } from "@/components/solana/use-wallet"

interface WalletBalance {
  sol: number
  tokens: number
  escrow: number
}

export default function WalletPage() {
  const sol = useSolanaWallet()
  const [balance, setBalance] = useState<WalletBalance>({
    sol: 5.25,
    tokens: 125050,
    escrow: 75,
  })

  const [showTransfer, setShowTransfer] = useState(false)
  const [transferAmount, setTransferAmount] = useState("")

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Wallet</h1>
            <p className="text-foreground/70">Manage your SOL and token balances</p>
            <div className="mt-4">
              <WalletMultiButton />
              {sol.connected && sol.address && (
                <p className="mt-2 text-sm text-foreground/70">Connected: {sol.address}</p>
              )}
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* SOL Balance */}
            <Card className="border-border bg-gradient-to-br from-purple-500/10 to-purple-600/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/70">SOL Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-cyan-400">{balance.sol} SOL</div>
                <p className="text-sm text-foreground/60">≈ ${(balance.sol * 140).toFixed(2)} USD</p>
              </CardContent>
            </Card>

            {/* Token Balance */}
            <Card className="border-border bg-gradient-to-br from-cyan-500/10 to-blue-600/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/70">MKN Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-purple-400">{balance.tokens.toLocaleString()} MKN</div>
                <p className="text-sm text-foreground/60">Available for trading</p>
              </CardContent>
            </Card>

            {/* Escrow Balance */}
            <Card className="border-border bg-gradient-to-br from-green-500/10 to-emerald-600/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground/70">In Escrow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2 text-emerald-400">{balance.escrow} MKN</div>
                <p className="text-sm text-foreground/60">Pending transactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/wallet/buy-sol">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 gap-2">
                <Plus className="h-4 w-4" />
                Buy SOL
              </Button>
            </Link>
            <Link href="/wallet/buy-tokens">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 gap-2">
                <Plus className="h-4 w-4" />
                Buy MKN
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full gap-2 bg-transparent"
              onClick={() => setShowTransfer(!showTransfer)}
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
            <Button variant="outline" className="w-full gap-2 bg-transparent">
              <ArrowDownLeft className="h-4 w-4" />
              Receive
            </Button>
          </div>

          {/* Transfer Modal */}
          {showTransfer && (
            <Card className="border-border bg-card mb-8">
              <CardHeader>
                <CardTitle>Send MKN</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Recipient Address</label>
                  <input
                    type="text"
                    placeholder="Solana wallet address"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (MKN)</label>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button onClick={() => setShowTransfer(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Transactions */}
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "1",
                    type: "received",
                    description: "Received MKN from token exchange",
                    amount: "+250 MKN",
                    time: "2 hours ago",
                  },
                  {
                    id: "2",
                    type: "sent",
                    description: "Purchased vintage leather jacket",
                    amount: "-250 MKN",
                    time: "1 day ago",
                  },
                  {
                    id: "3",
                    type: "received",
                    description: "Escrow release - Sold digital art",
                    amount: "+850 MKN",
                    time: "3 days ago",
                  },
                ].map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${tx.type === "received" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                          }`}
                      >
                        {tx.type === "received" ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-foreground/60">{tx.time}</p>
                      </div>
                    </div>
                    <p className={`font-semibold ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                      {tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

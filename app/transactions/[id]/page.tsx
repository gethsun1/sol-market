"use client"

import React from "react"

import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowDownLeft, Copy, ExternalLink, CheckCircle2 } from "lucide-react"
import EscrowStatus from "@/components/escrow-status"

const MOCK_TRANSACTION = {
  id: "1",
  type: "buy",
  title: "Vintage Leather Jacket",
  amount: 2.5,
  fee: 0.025,
  status: "completed",
  escrowStatus: "released",
  date: "2024-01-15",
  counterparty: "fashionista_sol",
  counterpartyWallet: "4LmcC...9xK2",
  transactionHash: "0xabc123...def456",
  description: "Classic brown leather jacket in great condition. Worn only a few times.",
  itemImage: "/vintage-leather-jacket.jpg",
  timeline: [
    { status: "ordered", date: "2024-01-15 10:30", description: "Order placed and payment secured in escrow" },
    { status: "shipped", date: "2024-01-15 14:20", description: "Item shipped by seller" },
    { status: "confirmed", date: "2024-01-16 09:15", description: "Receipt confirmed, payment released to seller" },
  ],
}

export default function TransactionDetailPage() {
  const params = useParams()
  const [copied, setCopied] = React.useState(false)

  const copyHash = () => {
    navigator.clipboard.writeText(MOCK_TRANSACTION.transactionHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Link href="/transactions" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            ← Back to Transactions
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <Card className="border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                        <ArrowDownLeft className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{MOCK_TRANSACTION.title}</h2>
                        <p className="text-foreground/60">Purchase from {MOCK_TRANSACTION.counterparty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-red-400 mb-1">-{MOCK_TRANSACTION.amount} SOL</p>
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                        Completed
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Item Details */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Item Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={MOCK_TRANSACTION.itemImage || "/placeholder.svg"}
                    alt={MOCK_TRANSACTION.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-foreground/60 mb-2">Description</p>
                    <p className="text-foreground">{MOCK_TRANSACTION.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Transaction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Transaction Date</p>
                      <p className="font-medium">{MOCK_TRANSACTION.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-400" />
                        <span className="font-medium">Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-foreground/60 mb-3">Breakdown</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Item Price</span>
                        <span className="font-medium">{MOCK_TRANSACTION.amount} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/70">Platform Fee (1%)</span>
                        <span className="font-medium">{MOCK_TRANSACTION.fee} SOL</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2">
                        <span className="font-bold">Total</span>
                        <span className="font-bold text-cyan-400">
                          {(MOCK_TRANSACTION.amount + MOCK_TRANSACTION.fee).toFixed(3)} SOL
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-foreground/60 mb-2">Transaction Hash</p>
                    <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-lg">
                      <code className="flex-1 font-mono text-xs text-cyan-400 break-all">
                        {MOCK_TRANSACTION.transactionHash}
                      </code>
                      <button onClick={copyHash} className="p-2 hover:bg-white/10 rounded transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      {copied && <span className="text-xs text-green-400">Copied!</span>}
                    </div>
                    <a
                      href={`https://solscan.io/tx/${MOCK_TRANSACTION.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-cyan-400 hover:text-cyan-300 mt-2 inline-flex items-center gap-1"
                    >
                      View on Solscan <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Transaction Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_TRANSACTION.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                          {idx < MOCK_TRANSACTION.timeline.length - 1 && (
                            <div className="w-1 h-12 bg-gradient-to-b from-purple-500 to-transparent mt-2" />
                          )}
                        </div>
                        <div className="pb-4">
                          <p className="font-semibold text-capitalize">{event.status}</p>
                          <p className="text-sm text-foreground/60">{event.date}</p>
                          <p className="text-sm text-foreground/70 mt-1">{event.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Escrow Status */}
              {MOCK_TRANSACTION.status === "completed" && (
                <EscrowStatus status="released" amount={MOCK_TRANSACTION.amount} />
              )}

              {/* Counterparty */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">{MOCK_TRANSACTION.type === "buy" ? "Seller" : "Buyer"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold mb-1">{MOCK_TRANSACTION.counterparty}</p>
                    <p className="text-sm text-foreground/60 font-mono">{MOCK_TRANSACTION.counterpartyWallet}</p>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    View Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full bg-transparent">
                    Request Refund
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Download Invoice
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

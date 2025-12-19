"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, AlertCircle, Filter } from "lucide-react"
import Link from "next/link"

interface Transaction {
  id: string
  type: "buy" | "sell"
  title: string
  amount: number
  status: "completed" | "pending" | "disputed" | "refunded"
  date: string
  counterparty: string
  escrowStatus?: "active" | "released"
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    type: "buy",
    title: "Vintage Leather Jacket",
    amount: 2.5,
    status: "completed",
    date: "2024-01-15",
    counterparty: "fashionista_sol",
    escrowStatus: "released",
  },
  {
    id: "2",
    type: "sell",
    title: "Digital Art NFT Bundle",
    amount: 8.5,
    status: "pending",
    date: "2024-01-14",
    counterparty: "collector_pro",
    escrowStatus: "active",
  },
  {
    id: "3",
    type: "buy",
    title: "Rare Gaming Console",
    amount: 15.0,
    status: "completed",
    date: "2024-01-10",
    counterparty: "gamer_pro",
    escrowStatus: "released",
  },
  {
    id: "4",
    type: "sell",
    title: "Collectible Trading Cards Set",
    amount: 5.2,
    status: "completed",
    date: "2024-01-05",
    counterparty: "trader_sol",
    escrowStatus: "released",
  },
  {
    id: "5",
    type: "buy",
    title: "Retro Gaming Cabinet",
    amount: 12.3,
    status: "disputed",
    date: "2024-01-02",
    counterparty: "arcade_fan",
  },
]

type FilterType = "all" | "buy" | "sell"
type StatusFilterType = "all" | "completed" | "pending" | "disputed"

export default function TransactionsPage() {
  const [typeFilter, setTypeFilter] = useState<FilterType>("all")
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("all")

  const filteredTransactions = MOCK_TRANSACTIONS.filter((tx) => {
    const typeMatch = typeFilter === "all" || tx.type === typeFilter
    const statusMatch = statusFilter === "all" || tx.status === statusFilter
    return typeMatch && statusMatch
  })

  const stats = {
    totalBuys: MOCK_TRANSACTIONS.filter((tx) => tx.type === "buy").length,
    totalSells: MOCK_TRANSACTIONS.filter((tx) => tx.type === "sell").length,
    completedCount: MOCK_TRANSACTIONS.filter((tx) => tx.status === "completed").length,
    totalVolume: MOCK_TRANSACTIONS.reduce((sum, tx) => sum + tx.amount, 0),
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Transactions</h1>
            <p className="text-foreground/70">View all your marketplace activity</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/60 mb-1">Total Purchases</p>
                <p className="text-3xl font-bold">{stats.totalBuys}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/60 mb-1">Total Sales</p>
                <p className="text-3xl font-bold">{stats.totalSells}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/60 mb-1">Completed</p>
                <p className="text-3xl font-bold text-green-400">{stats.completedCount}</p>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <p className="text-sm text-foreground/60 mb-1">Total Volume</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.totalVolume} SOL</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="border-border bg-card mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {/* Type Filter */}
              <div className="flex gap-2">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    typeFilter === "all"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "border border-border hover:border-purple-500/50"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter("buy")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    typeFilter === "buy"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "border border-border hover:border-purple-500/50"
                  }`}
                >
                  Purchases
                </button>
                <button
                  onClick={() => setTypeFilter("sell")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    typeFilter === "sell"
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                      : "border border-border hover:border-purple-500/50"
                  }`}
                >
                  Sales
                </button>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    statusFilter === "all"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                      : "border border-border hover:border-cyan-500/50"
                  }`}
                >
                  All Status
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    statusFilter === "completed"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                      : "border border-border hover:border-cyan-500/50"
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    statusFilter === "pending"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                      : "border border-border hover:border-cyan-500/50"
                  }`}
                >
                  Pending
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <Link key={tx.id} href={`/transactions/${tx.id}`}>
                  <Card className="border-border bg-card hover:border-purple-500/50 transition-all cursor-pointer">
                    <CardContent className="p-6 flex items-center justify-between">
                      {/* Left - Type and Icon */}
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg ${
                            tx.type === "buy" ? "bg-blue-500/10 text-blue-400" : "bg-green-500/10 text-green-400"
                          }`}
                        >
                          {tx.type === "buy" ? (
                            <ArrowDownLeft className="h-6 w-6" />
                          ) : (
                            <ArrowUpRight className="h-6 w-6" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{tx.title}</h3>
                            {tx.status === "completed" && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                            {tx.status === "pending" && <Clock className="h-4 w-4 text-yellow-400" />}
                            {tx.status === "disputed" && <AlertCircle className="h-4 w-4 text-red-400" />}
                          </div>
                          <p className="text-sm text-foreground/60">
                            {tx.type === "buy" ? "Bought from" : "Sold to"} {tx.counterparty}
                          </p>
                          <p className="text-xs text-foreground/40 mt-1">{tx.date}</p>
                        </div>
                      </div>

                      {/* Right - Amount and Status */}
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold mb-1 ${tx.type === "buy" ? "text-red-400" : "text-green-400"}`}
                        >
                          {tx.type === "buy" ? "-" : "+"}
                          {tx.amount} SOL
                        </p>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            tx.status === "completed"
                              ? "bg-green-500/10 text-green-400"
                              : tx.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-400"
                                : tx.status === "disputed"
                                  ? "bg-red-500/10 text-red-400"
                                  : "bg-blue-500/10 text-blue-400"
                          }`}
                        >
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="py-12 text-center">
                  <p className="text-foreground/60 mb-4">No transactions found</p>
                  <Link href="/marketplace">
                    <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">
                      Browse Marketplace
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

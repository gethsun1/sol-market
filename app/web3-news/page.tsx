"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { TrendingUp, Globe, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NewsArticle {
  id: string
  title: string
  summary: string
  image: string
  category: string
  date: string
  views: number
}

interface CurrencyRate {
  code: string
  name: string
  symbol: string
  rateToSol: number
  change24h: number
}

const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Solana Ecosystem Reaches All-Time High in DeFi Transactions",
    summary:
      "The Solana blockchain records unprecedented transaction volumes in decentralized finance protocols this quarter.",
    image: "/solana-defi.jpg",
    category: "DeFi",
    date: "2 hours ago",
    views: 12500,
  },
  {
    id: "2",
    title: "International Trade Regulations Embrace Blockchain Technology",
    summary:
      "Major economies announce new policies supporting blockchain-based trade settlements and cross-border payments.",
    image: "/international-trade-blockchain.jpg",
    category: "Trade",
    date: "4 hours ago",
    views: 8900,
  },
  {
    id: "3",
    title: "Web3 Marketplace Integration Reaches 500K Active Users",
    summary:
      "Decentralized commerce platforms surpass half a million monthly active users, signaling mainstream adoption.",
    image: "/web3-marketplace.jpg",
    category: "Marketplace",
    date: "6 hours ago",
    views: 15200,
  },
  {
    id: "4",
    title: "Central Banks Explore CBDC Integration with Solana",
    summary:
      "Multiple central banks announce research partnerships to explore digital currency integration on Solana network.",
    image: "/cbdc-integration.jpg",
    category: "Finance",
    date: "8 hours ago",
    views: 20100,
  },
  {
    id: "5",
    title: "Cross-Border Payment Settlement Time Reduced to Seconds",
    summary:
      "New protocol enables instant international payments with minimal fees, disrupting traditional remittance markets.",
    image: "/cross-border-payments.jpg",
    category: "Trade",
    date: "10 hours ago",
    views: 11300,
  },
  {
    id: "6",
    title: "Smart Contract Escrow Adoption Grows in E-commerce",
    summary: "Merchants report 40% increase in customer confidence with automated escrow-based dispute resolution.",
    image: "/smart-contract.jpg",
    category: "Technology",
    date: "12 hours ago",
    views: 9800,
  },
]

const currencyRates: CurrencyRate[] = [
  { code: "USD", name: "US Dollar", symbol: "$", rateToSol: 0.034, change24h: 2.5 },
  { code: "EUR", name: "Euro", symbol: "€", rateToSol: 0.031, change24h: 1.8 },
  { code: "GBP", name: "British Pound", symbol: "£", rateToSol: 0.027, change24h: 2.1 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", rateToSol: 4.82, change24h: -0.5 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", rateToSol: 0.052, change24h: 3.2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", rateToSol: 0.047, change24h: 2.8 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", rateToSol: 0.03, change24h: 1.2 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", rateToSol: 0.24, change24h: 1.5 },
  { code: "INR", name: "Indian Rupee", symbol: "₹", rateToSol: 2.85, change24h: 0.8 },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", rateToSol: 0.046, change24h: 2.3 },
]

export default function Web3NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const categories = ["All", "DeFi", "Trade", "Marketplace", "Finance", "Technology"]

  const filteredNews =
    selectedCategory === "All" ? mockNews : mockNews.filter((article) => article.category === selectedCategory)

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2">
                <Globe className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Web3 Trade Intelligence</span>
              </div>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-balance">
              <span className="gradient-text">International Web3 Trade News</span>
            </h1>
            <p className="text-xl text-foreground/60">
              Stay informed with the latest developments in decentralized commerce and blockchain trade
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-12 lg:grid-cols-3">
            {/* News Section - 2 columns */}
            <div className="lg:col-span-2">
              {/* Category Filter */}
              <div className="mb-8 flex flex-wrap gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === cat
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                        : "border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* News Grid */}
              <div className="space-y-6">
                {filteredNews.map((article) => (
                  <div
                    key={article.id}
                    className="group flex gap-4 rounded-lg border border-foreground/10 bg-foreground/5 p-4 transition-all hover:border-purple-500/50 hover:bg-purple-500/10 cursor-pointer"
                  >
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-24 w-32 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-3">
                        <span className="text-xs font-semibold text-purple-400">{article.category}</span>
                        <span className="text-xs text-foreground/50">{article.date}</span>
                      </div>
                      <h3 className="mb-2 text-lg font-semibold group-hover:text-purple-400 transition-colors">
                        {article.title}
                      </h3>
                      <p className="mb-2 text-sm text-foreground/70">{article.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-foreground/50">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          {article.views.toLocaleString()} views
                        </span>
                        <Button variant="ghost" size="sm" className="ml-auto text-cyan-400 hover:text-cyan-300">
                          Read More →
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Currency Exchange Rates - Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-lg border border-cyan-500/30 bg-gradient-to-b from-cyan-500/10 to-purple-500/10 p-6">
                <div className="mb-6 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-xl font-bold">Top 10 Currency Rates</h2>
                </div>
                <div className="text-sm text-foreground/60 mb-4">Exchange rates to SOL</div>

                <div className="space-y-4">
                  {currencyRates.map((currency) => (
                    <div
                      key={currency.code}
                      className="flex items-center justify-between rounded-lg border border-foreground/10 bg-foreground/5 p-3 hover:bg-foreground/10 transition-all"
                    >
                      <div>
                        <div className="font-semibold text-sm">{currency.code}</div>
                        <div className="text-xs text-foreground/50">{currency.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{currency.rateToSol.toFixed(4)} SOL</div>
                        <div className={`text-xs ${currency.change24h >= 0 ? "text-green-400" : "text-red-400"}`}>
                          {currency.change24h >= 0 ? "+" : ""}
                          {currency.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Course Section */}
                <div className="mt-6 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-400" />
                    <h3 className="font-semibold">International Trade Course</h3>
                  </div>
                  <p className="mb-4 text-sm text-foreground/70">
                    Master Web3 commerce and decentralized trading across borders
                  </p>
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                      <span>5 modules · 20 hours</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                      <span>Expert-led instruction</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400"></span>
                      <span>Certification included</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    Enroll Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

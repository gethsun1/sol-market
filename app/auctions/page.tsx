"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Gavel, Heart, Share2, MessageCircle, Clock, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Auction {
  id: string
  title: string
  sellerName: string
  sellerHandle: string
  currentPrice: number
  startingPrice: number
  image: string
  timeLeft: string
  bidsCount: number
  likes: number
  liked?: boolean
  goodwillMessage: string
  highestBidder?: string
  endDate: string
}

const mockAuctions: Auction[] = [
  {
    id: "1",
    title: "Exclusive NFT Art Collection - Digital Store",
    sellerName: "ArtisticVentures Inc",
    sellerHandle: "@art_ventures",
    currentPrice: 250.5,
    startingPrice: 100,
    image: "/placeholder.svg?key=nft_collection",
    timeLeft: "2 days 14 hours",
    bidsCount: 32,
    likes: 234,
    liked: false,
    goodwillMessage: "Thank you for supporting digital art! Join our community of creators and investors.",
    highestBidder: "cryptowhale.sol",
    endDate: "2024-12-15 20:00",
  },
  {
    id: "2",
    title: "Premium E-Commerce Store Setup Package",
    sellerName: "Digital Commerce Hub",
    sellerHandle: "@ecommerce_hub",
    currentPrice: 180.75,
    startingPrice: 80,
    image: "/placeholder.svg?key=ecommerce_setup",
    timeLeft: "5 days 6 hours",
    bidsCount: 18,
    likes: 156,
    liked: false,
    goodwillMessage: "Build your Web3 empire with us! Complete setup, training, and 6 months support included.",
    highestBidder: "merchant_pro.sol",
    endDate: "2024-12-18 15:00",
  },
  {
    id: "3",
    title: "Blockchain Development Expertise - Company Services",
    sellerName: "DevChain Solutions",
    sellerHandle: "@devchain_pro",
    currentPrice: 420.0,
    startingPrice: 200,
    image: "/placeholder.svg?key=dev_services",
    timeLeft: "3 days 10 hours",
    bidsCount: 45,
    likes: 512,
    liked: true,
    goodwillMessage: "Invest in innovation! Get full blockchain development services with ongoing consultation.",
    highestBidder: "tech_investor.sol",
    endDate: "2024-12-16 18:00",
  },
  {
    id: "4",
    title: "Luxury Fashion Brand - Online Retail Business",
    sellerName: "Fashion Empire Co",
    sellerHandle: "@fashion_empire",
    currentPrice: 850.25,
    startingPrice: 500,
    image: "/placeholder.svg?key=fashion_brand",
    timeLeft: "7 days 2 hours",
    bidsCount: 67,
    likes: 889,
    liked: false,
    goodwillMessage: "Join the fashion revolution! Exclusive designs, established brand, and loyal customer base.",
    highestBidder: "investor_luxury.sol",
    endDate: "2024-12-20 12:00",
  },
  {
    id: "5",
    title: "SaaS Platform License - Annual Access",
    sellerName: "Enterprise Solutions Ltd",
    sellerHandle: "@enterprise_sol",
    currentPrice: 520.5,
    startingPrice: 300,
    image: "/placeholder.svg?key=saas_platform",
    timeLeft: "4 days 8 hours",
    bidsCount: 28,
    likes: 345,
    liked: false,
    goodwillMessage: "Scale your business! Enterprise-grade SaaS with API access, analytics, and priority support.",
    highestBidder: "business_dev.sol",
    endDate: "2024-12-17 14:00",
  },
  {
    id: "6",
    title: "Metaverse Real Estate - Virtual Store Location",
    sellerName: "Virtual Properties Corp",
    sellerHandle: "@metaverse_real",
    currentPrice: 1250.0,
    startingPrice: 800,
    image: "/placeholder.svg?key=metaverse_land",
    timeLeft: "6 days 16 hours",
    bidsCount: 52,
    likes: 678,
    liked: false,
    goodwillMessage: "Own premium virtual real estate in the hottest metaverse district! Perfect for Web3 businesses.",
    highestBidder: "metaverse_investor.sol",
    endDate: "2024-12-19 10:00",
  },
]

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState(mockAuctions)
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
  const [sortBy, setSortBy] = useState("newest")

  const toggleLike = (id: string) => {
    setAuctions(
      auctions.map((auction) =>
        auction.id === id
          ? { ...auction, liked: !auction.liked, likes: auction.liked ? auction.likes - 1 : auction.likes + 1 }
          : auction,
      ),
    )
  }

  const sortedAuctions = [...auctions].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.currentPrice - a.currentPrice
      case "lowest":
        return a.currentPrice - b.currentPrice
      case "bids":
        return b.bidsCount - a.bidsCount
      default:
        return 0
    }
  })

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-cyan-500/50 bg-cyan-500/10 px-4 py-2">
                <Gavel className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">Investment Marketplace</span>
              </div>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-balance">
              <span className="gradient-text">Web3 Auction Mart</span>
            </h1>
            <p className="text-xl text-foreground/60">
              Bid on exclusive stores, services, and digital assets. Invest in Web3 businesses with smart contract
              security.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-purple-500/30 bg-purple-500/10 p-6">
            <div>
              <div className="text-sm text-foreground/60 mb-1">Active Auctions</div>
              <div className="text-2xl font-bold text-purple-400">{auctions.length}</div>
            </div>
            <div>
              <div className="text-sm text-foreground/60 mb-1">Total Value</div>
              <div className="text-2xl font-bold text-cyan-400">
                {auctions.reduce((sum, a) => sum + a.currentPrice, 0).toFixed(2)} SOL
              </div>
            </div>
            <div>
              <div className="text-sm text-foreground/60 mb-1">Total Bids</div>
              <div className="text-2xl font-bold text-pink-400">
                {auctions.reduce((sum, a) => sum + a.bidsCount, 0)}
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="mb-8 flex items-center gap-4">
            <span className="text-sm font-semibold text-foreground/70">Sort by:</span>
            {["newest", "highest", "lowest", "bids"].map((option) => (
              <button
                key={option}
                onClick={() => setSortBy(option)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  sortBy === option
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                    : "border border-foreground/20 text-foreground/70 hover:border-foreground/40"
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)} {option === "highest" ? "Price" : ""}
              </button>
            ))}
          </div>

          {/* Auctions Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedAuctions.map((auction) => (
              <div
                key={auction.id}
                className="group cursor-pointer rounded-xl border border-foreground/10 bg-gradient-to-b from-foreground/10 to-transparent overflow-hidden hover:border-cyan-500/50 transition-all"
                onClick={() => setSelectedAuction(auction)}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-b from-foreground/20 to-foreground/5">
                  <img
                    src={auction.image || "/placeholder.svg"}
                    alt={auction.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-cyan-400">
                    LIVE AUCTION
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Seller Info */}
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"></div>
                    <div>
                      <div className="text-sm font-semibold">{auction.sellerName}</div>
                      <div className="text-xs text-foreground/60">{auction.sellerHandle}</div>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-lg font-bold line-clamp-2">{auction.title}</h3>

                  {/* Goodwill Message Preview */}
                  <p className="mb-4 text-sm text-foreground/60 line-clamp-2 italic">"{auction.goodwillMessage}"</p>

                  {/* Pricing */}
                  <div className="mb-4 pb-4 border-b border-foreground/10">
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <div className="text-xs text-foreground/60 mb-1">Current Bid</div>
                        <div className="text-2xl font-bold text-cyan-400">{auction.currentPrice.toFixed(2)} SOL</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-foreground/60 mb-1">Starting</div>
                        <div className="text-sm text-foreground/70">{auction.startingPrice} SOL</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <TrendingUp className="h-3 w-3" />+
                      {((auction.currentPrice / auction.startingPrice - 1) * 100).toFixed(0)}% increase
                    </div>
                  </div>

                  {/* Stats and Engagement */}
                  <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
                    <div className="rounded-lg bg-foreground/5 p-2">
                      <div className="font-semibold text-cyan-400">{auction.bidsCount}</div>
                      <div className="text-xs text-foreground/60">Bids</div>
                    </div>
                    <div className="rounded-lg bg-foreground/5 p-2">
                      <div className="font-semibold text-purple-400">{auction.timeLeft}</div>
                      <div className="text-xs text-foreground/60">Time Left</div>
                    </div>
                    <div className="rounded-lg bg-foreground/5 p-2">
                      <div className="font-semibold text-pink-400">{auction.likes}</div>
                      <div className="text-xs text-foreground/60">Likes</div>
                    </div>
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(auction.id)
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        auction.liked
                          ? "bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                          : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20"
                      }`}
                    >
                      <Heart className="h-4 w-4" fill={auction.liked ? "currentColor" : "none"} />
                      <span className="text-sm font-medium">Like</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-foreground/10 text-foreground/70 hover:bg-foreground/20 transition-all">
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Bid Button */}
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                    <Gavel className="h-4 w-4 mr-2" />
                    Place Bid
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Seller Create Auction CTA */}
          <div className="mt-16 rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 p-8">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="mb-2 text-3xl font-bold">Are you a Business Owner?</h2>
                <p className="mb-6 text-foreground/70">
                  Put your store, services, or digital assets up for auction and connect with Web3 investors. Include a
                  personalized goodwill message to build trust with potential buyers!
                </p>
                <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                  Create Auction
                </Button>
              </div>
              <div className="h-48 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"></div>
            </div>
          </div>
        </div>

        {/* Auction Detail Modal */}
        {selectedAuction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setSelectedAuction(null)}
          >
            <div
              className="max-w-2xl w-full rounded-xl border border-foreground/20 bg-black p-8 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-bold">{selectedAuction.title}</h2>
                <button
                  onClick={() => setSelectedAuction(null)}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <img
                  src={selectedAuction.image || "/placeholder.svg"}
                  alt={selectedAuction.title}
                  className="rounded-lg h-64 object-cover"
                />

                <div className="space-y-4">
                  <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-4">
                    <div className="text-sm text-foreground/60 mb-1">Current Bid</div>
                    <div className="text-3xl font-bold text-cyan-400 mb-2">
                      {selectedAuction.currentPrice.toFixed(2)} SOL
                    </div>
                    <div className="text-sm text-foreground/70 mb-4">{selectedAuction.bidsCount} bids placed</div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                      Place Your Bid
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <Clock className="h-4 w-4 text-foreground/60" />
                    <div>
                      <div className="text-foreground/60">Time Remaining</div>
                      <div className="font-semibold">{selectedAuction.timeLeft}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                <h3 className="mb-2 font-semibold flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Seller's Goodwill Message
                </h3>
                <p className="text-foreground/70 italic">"{selectedAuction.goodwillMessage}"</p>
              </div>

              <div className="mt-6 rounded-lg border border-foreground/10 bg-foreground/5 p-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500"></div>
                  <div>
                    <div className="font-semibold">{selectedAuction.sellerName}</div>
                    <div className="text-sm text-foreground/60">{selectedAuction.sellerHandle}</div>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Follow Seller
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

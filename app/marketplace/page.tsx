"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Search, Plus, Sparkles } from "lucide-react"
import Link from "next/link"
import ListingCard from "@/components/listing-card"
import { ShoppingCartSVG } from "@/components/svg-illustrations"
import { SwapWidget } from "@/components/SwapWidget"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Coins } from "lucide-react"
import { useTokenBalance } from "@/hooks/useTokenBalance"

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    description: "Classic brown leather jacket in great condition",
    price: 250,
    image_url: "/vintage-leather-jacket.jpg",
    category: "Fashion",
    seller: { username: "fashionista_mkn", avatar: "👗" },
    rating: 4.8,
  },
  {
    id: "2",
    title: "Rare Gaming Console",
    description: "Limited edition gaming console, sealed in box",
    price: 1500,
    image_url: "/gaming-console.jpg",
    category: "Electronics",
    seller: { username: "gamer_pro", avatar: "🎮" },
    rating: 5.0,
  },
  {
    id: "3",
    title: "Digital Art NFT Bundle",
    description: "Collection of 5 exclusive digital artworks",
    price: 850,
    image_url: "/digital-art.jpg",
    category: "Digital",
    seller: { username: "artist_chain", avatar: "🎨" },
    rating: 4.6,
  },
  {
    id: "4",
    title: "Collectible Trading Cards Set",
    description: "Complete set of mint condition trading cards",
    price: 520,
    image_url: "/trading-cards.jpg",
    category: "Collectibles",
    seller: { username: "collector_mkn", avatar: "🃏" },
    rating: 4.9,
  },
]

const CATEGORIES = ["All", "Fashion", "Electronics", "Digital", "Collectibles"]

export default function MarketplacePage() {
  const [listings, setListings] = useState(MOCK_LISTINGS)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const { balance: mknBalance } = useTokenBalance();

  const filteredListings = listings.filter((listing) => {
    const matchesCategory = selectedCategory === "All" || listing.category === selectedCategory
    const matchesSearch =
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background px-4 py-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 opacity-5 pointer-events-none">
          <ShoppingCartSVG className="w-full h-full" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          {/* Header with animation */}
          <div className="mb-8 animate-fade-in-up">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="h-8 w-8 text-purple-400 animate-pulse-glow" />
              <h1 className="text-5xl font-bold gradient-text-vibrant">Marketplace</h1>
            </div>
            <p className="text-foreground/70 text-lg">Discover unique merchandise from trusted sellers</p>
          </div>

          {/* Controls */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex items-center justify-between gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            {/* Search with glow effect */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl glass-strong border-2 border-border text-foreground placeholder-foreground/40 focus:outline-none focus:border-purple-500/50 transition-all focus:glow-purple"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4">
              {/* MKN Balance and Swap */}
              <div className="flex items-center gap-3 px-4 py-2 glass-strong rounded-xl border border-white/10 shadow-lg glow-purple/20">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase tracking-wider text-purple-400 font-bold">MKN Balance</span>
                  <span className="text-lg font-bold text-white leading-none whitespace-nowrap">{mknBalance?.toFixed(2) || "0.00"}</span>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-400 transition-all hover:scale-110">
                      <Coins className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-transparent border-0 p-0 max-w-sm shadow-none">
                    <SwapWidget />
                  </DialogContent>
                </Dialog>
              </div>

              {/* Add Listing Button */}
              <Link href="/marketplace/create">
                <Button className="w-full md:w-auto bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-600 hover:via-purple-700 hover:to-purple-800 gap-2 h-12 px-6 shadow-lg glow-on-hover font-semibold">
                  <Plus className="h-5 w-5" />
                  Add Listing
                </Button>
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-10 flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${selectedCategory === category
                  ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white shadow-lg glow-purple"
                  : "glass border-2 border-border text-foreground/70 hover:border-purple-500/50 hover:text-foreground"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing, index) => (
                <div
                  key={listing.id}
                  className="animate-fade-in-scale"
                  style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                >
                  <ListingCard listing={listing} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 glass-tint-purple rounded-2xl">
                <Search className="h-16 w-16 mx-auto mb-4 text-foreground/30" />
                <p className="text-xl font-semibold text-foreground/60">No listings found</p>
                <p className="text-sm text-foreground/40 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


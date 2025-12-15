"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Search, Plus } from "lucide-react"
import Link from "next/link"
import ListingCard from "@/components/listing-card"

const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Vintage Leather Jacket",
    description: "Classic brown leather jacket in great condition",
    price: 2.5,
    image_url: "/vintage-leather-jacket.jpg",
    category: "Fashion",
    seller: { username: "fashionista_sol", avatar: "👗" },
    rating: 4.8,
  },
  {
    id: "2",
    title: "Rare Gaming Console",
    description: "Limited edition gaming console, sealed in box",
    price: 15.0,
    image_url: "/gaming-console.jpg",
    category: "Electronics",
    seller: { username: "gamer_pro", avatar: "🎮" },
    rating: 5.0,
  },
  {
    id: "3",
    title: "Digital Art NFT Bundle",
    description: "Collection of 5 exclusive digital artworks",
    price: 8.5,
    image_url: "/digital-art.jpg",
    category: "Digital",
    seller: { username: "artist_chain", avatar: "🎨" },
    rating: 4.6,
  },
  {
    id: "4",
    title: "Collectible Trading Cards Set",
    description: "Complete set of mint condition trading cards",
    price: 5.2,
    image_url: "/trading-cards.jpg",
    category: "Collectibles",
    seller: { username: "collector_sol", avatar: "🃏" },
    rating: 4.9,
  },
]

const CATEGORIES = ["All", "Fashion", "Electronics", "Digital", "Collectibles"]

export default function MarketplacePage() {
  const [listings, setListings] = useState(MOCK_LISTINGS)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

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
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Marketplace</h1>
            <p className="text-foreground/70">Browse and buy unique merchandise</p>
          </div>

          {/* Controls */}
          <div className="mb-8 space-y-4 md:space-y-0 md:flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
              <input
                type="text"
                placeholder="Search listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Add Listing Button */}
            <Link href="/marketplace/create">
              <Button className="w-full md:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 gap-2">
                <Plus className="h-5 w-5" />
                Add Listing
              </Button>
            </Link>
          </div>

          {/* Categories */}
          <div className="mb-8 flex flex-wrap gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white"
                    : "border border-border text-foreground/70 hover:border-purple-500/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-foreground/60">No listings found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

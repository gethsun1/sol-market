"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Star, Share2, ShoppingCart, Heart } from "lucide-react"
import { useParams } from "next/navigation"
import Link from "next/link"

const MOCK_LISTING = {
  id: "1",
  title: "Vintage Leather Jacket",
  description:
    "Classic brown leather jacket in great condition. Worn only a few times. Perfect for collectors and vintage enthusiasts.",
  price: 2.5,
  image_url: "/vintage-leather-jacket.jpg",
  category: "Fashion",
  seller: { username: "fashionista_sol", avatar: "👗" },
  rating: 4.8,
  reviews: 24,
  condition: "Excellent",
  quantity: 1,
}

export default function ListingDetailPage() {
  const params = useParams()
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(false)

  const totalPrice = MOCK_LISTING.price * quantity

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-6xl">
          <Link href="/marketplace" className="text-cyan-400 hover:text-cyan-300 mb-6 inline-block">
            ← Back to Marketplace
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image */}
            <div className="flex items-center justify-center bg-card rounded-lg border border-border p-4">
              <img
                src={MOCK_LISTING.image_url || "/placeholder.svg"}
                alt={MOCK_LISTING.title}
                className="w-full h-auto max-h-96 object-cover rounded"
              />
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{MOCK_LISTING.title}</h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{MOCK_LISTING.rating}</span>
                        <span className="text-foreground/60">({MOCK_LISTING.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setWishlist(!wishlist)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Heart className={`h-6 w-6 ${wishlist ? "fill-red-500 text-red-500" : "text-foreground/60"}`} />
                  </button>
                </div>
              </div>

              {/* Price Card */}
              <Card className="border-border bg-card">
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <p className="text-foreground/60 text-sm mb-1">Price per item</p>
                    <p className="text-4xl font-bold text-cyan-400">{MOCK_LISTING.price} SOL</p>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">Quantity</label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-3 py-1 border border-border rounded hover:bg-white/10"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 border border-border rounded hover:bg-white/10"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-3 border-t border-border">
                      <span className="font-medium">Total</span>
                      <span className="text-2xl font-bold text-cyan-400">{totalPrice} SOL</span>
                    </div>
                  </div>

                  <Link href={`/checkout/${MOCK_LISTING.id}`}>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12 gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <Button variant="outline" className="w-full gap-2 bg-transparent">
                    <Share2 className="h-4 w-4" />
                    Share Listing
                  </Button>
                </CardContent>
              </Card>

              {/* Seller Info */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <h3 className="font-semibold">Seller Information</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{MOCK_LISTING.seller.avatar}</span>
                    <div>
                      <p className="font-medium">{MOCK_LISTING.seller.username}</p>
                      <p className="text-sm text-foreground/60">Trusted seller</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    Contact Seller
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Description */}
          <Card className="border-border bg-card mt-8">
            <CardHeader>
              <h2 className="text-2xl font-bold">Description</h2>
            </CardHeader>
            <CardContent>
              <p className="text-foreground/80 leading-relaxed">{MOCK_LISTING.description}</p>
              <div className="mt-6 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Condition</p>
                  <p className="font-medium">{MOCK_LISTING.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Category</p>
                  <p className="font-medium">{MOCK_LISTING.category}</p>
                </div>
                <div>
                  <p className="text-sm text-foreground/60 mb-1">In Stock</p>
                  <p className="font-medium">{MOCK_LISTING.quantity} Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

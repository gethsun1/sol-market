"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface ListingCardProps {
  listing: {
    id: string
    title: string
    description: string
    price: number
    image_url: string
    category: string
    seller: { username: string; avatar: string }
    rating: number
  }
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Card className="border-border bg-card overflow-hidden hover:border-purple-500/50 transition-all group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={listing.image_url || "/placeholder.svg"}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-medium">
          {listing.category}
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold line-clamp-2">{listing.title}</h3>
        <p className="text-sm text-foreground/60 line-clamp-1">{listing.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{listing.rating}</span>
        </div>

        {/* Seller */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{listing.seller.avatar}</span>
          <span className="text-sm text-foreground/70">{listing.seller.username}</span>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <p className="text-xs text-foreground/60">Price</p>
            <p className="text-xl font-bold text-cyan-400">{listing.price} SOL</p>
          </div>
          <Link href={`/marketplace/${listing.id}`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

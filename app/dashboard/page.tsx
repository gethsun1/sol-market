"use client"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, ShoppingCart, Package, Wallet } from "lucide-react"
import Link from "next/link"
import ProfileCard from "@/components/profile-card"

const USER = {
  id: "1",
  username: "fashionista_sol",
  email: "user@example.com",
  wallet_address: "4LmcC6p3v2hhK5nF9bX8qY2zW3eD7tR4M5jU9pS1vK8",
  bio: "Collector and curator of unique marketplace items",
  profile_image_url: "",
}

export default function DashboardPage() {
  const stats = {
    totalSpent: 2075,
    totalEarned: 2200,
    activeListings: 3,
    pendingTransactions: 2,
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-background px-4 py-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Dashboard</h1>
            <p className="text-foreground/70">Welcome back to your Makena E-commerce account</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Total Spent</p>
                    <p className="text-3xl font-bold text-red-400">{stats.totalSpent} MKN</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-red-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Total Earned</p>
                    <p className="text-3xl font-bold text-green-400">{stats.totalEarned} MKN</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Active Listings</p>
                    <p className="text-3xl font-bold text-cyan-400">{stats.activeListings}</p>
                  </div>
                  <Package className="h-8 w-8 text-cyan-400/30" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-border bg-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-400">{stats.pendingTransactions}</p>
                  </div>
                  <Wallet className="h-8 w-8 text-yellow-400/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <ProfileCard user={USER} onEdit={() => { }} />

              {/* Quick Actions */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Link href="/wallet">
                    <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
                      <Wallet className="h-6 w-6" />
                      <span className="text-xs">Wallet</span>
                    </Button>
                  </Link>
                  <Link href="/marketplace">
                    <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
                      <ShoppingCart className="h-6 w-6" />
                      <span className="text-xs">Shop</span>
                    </Button>
                  </Link>
                  <Link href="/marketplace/create">
                    <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
                      <Package className="h-6 w-6" />
                      <span className="text-xs">Sell</span>
                    </Button>
                  </Link>
                  <Link href="/transactions">
                    <Button variant="outline" className="w-full h-24 flex-col gap-2 bg-transparent">
                      <TrendingUp className="h-6 w-6" />
                      <span className="text-xs">History</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Activity</CardTitle>
                    <Link href="/transactions">
                      <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "Purchased", item: "Vintage Leather Jacket", amount: "-250 MKN", time: "2h ago" },
                      { action: "Sold", item: "Digital Art NFT Bundle", amount: "+850 MKN", time: "1d ago" },
                      { action: "Listed", item: "Gaming Console", amount: "Pending", time: "3d ago" },
                    ].map((activity, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {activity.action}: {activity.item}
                          </p>
                          <p className="text-xs text-foreground/60">{activity.time}</p>
                        </div>
                        <p
                          className={`font-semibold ${activity.amount.startsWith("+") ? "text-green-400" : "text-red-400"
                            }`}
                        >
                          {activity.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* My Listings */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>My Listings</CardTitle>
                    <Link href="/marketplace/create">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      >
                        Add
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { title: "Rare Gaming Console", status: "active", price: "1500" },
                    { title: "Collectible Cards", status: "sold", price: "520" },
                    { title: "Digital Artwork", status: "active", price: "850" },
                  ].map((listing, idx) => (
                    <div key={idx} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm line-clamp-1">{listing.title}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${listing.status === "active"
                            ? "bg-green-500/10 text-green-400"
                            : "bg-gray-500/10 text-gray-400"
                            }`}
                        >
                          {listing.status}
                        </span>
                      </div>
                      <p className="text-sm text-cyan-400 font-semibold">{listing.price} MKN</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Account Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-foreground/60 mb-1">Member Since</p>
                    <p className="font-medium">Jan 2024</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 mb-1">Reputation</p>
                    <p className="font-medium">4.8/5.0 ⭐</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 mb-1">Transactions</p>
                    <p className="font-medium">47 Total</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

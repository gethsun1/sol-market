"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Gift, Ticket, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Raffle {
  id: string
  title: string
  sector: string
  prizeProduct: string
  prizeImage: string
  merchantName: string
  ticketPrice: number
  totalTickets: number
  solPrice: number
  endDate: string
  timeLeft: string
  participantsCount: number
  ticketsSold: number
  yourTickets?: number
}

const sectorColors: Record<string, string> = {
  IT: "from-blue-500 to-cyan-500",
  TRANSPORT: "from-orange-500 to-red-500",
  APPAREL: "from-pink-500 to-purple-500",
  EDUCATION: "from-green-500 to-emerald-500",
}

const mockRaffles: Raffle[] = [
  {
    id: "1",
    title: "Premium Gaming Laptop Raffle",
    sector: "IT",
    prizeProduct: "ASUS ROG Gaming Laptop",
    prizeImage: "/placeholder.svg?key=gaming_laptop",
    merchantName: "TechHub Store",
    ticketPrice: 0.5,
    totalTickets: 1000,
    solPrice: 0.5,
    endDate: "2024-12-15 18:00",
    timeLeft: "2 days 6 hours",
    participantsCount: 340,
    ticketsSold: 580,
    yourTickets: 5,
  },
  {
    id: "2",
    title: "Limited Edition Designer Shoes",
    sector: "APPAREL",
    prizeProduct: "Nike Jordan Limited Edition",
    prizeImage: "/placeholder.svg?key=shoes",
    merchantName: "Fashion Elite",
    ticketPrice: 0.3,
    totalTickets: 800,
    solPrice: 0.3,
    endDate: "2024-12-18 20:00",
    timeLeft: "5 days 8 hours",
    participantsCount: 215,
    ticketsSold: 420,
  },
  {
    id: "3",
    title: "Electric Vehicle Accessory Bundle",
    sector: "TRANSPORT",
    prizeProduct: "Premium EV Charging Bundle",
    prizeImage: "/placeholder.svg?key=ev_charging",
    merchantName: "AutoPro Motors",
    ticketPrice: 1.2,
    totalTickets: 500,
    solPrice: 1.2,
    endDate: "2024-12-20 14:00",
    timeLeft: "7 days 2 hours",
    participantsCount: 180,
    ticketsSold: 320,
  },
  {
    id: "4",
    title: "Online Certification Program",
    sector: "EDUCATION",
    prizeProduct: "Advanced Web Development Course",
    prizeImage: "/placeholder.svg?key=course",
    merchantName: "EduTech Academy",
    ticketPrice: 0.25,
    totalTickets: 2000,
    solPrice: 0.25,
    endDate: "2024-12-22 12:00",
    timeLeft: "9 days",
    participantsCount: 890,
    ticketsSold: 1450,
  },
  {
    id: "5",
    title: "Smartphone Latest Model",
    sector: "IT",
    prizeProduct: "Samsung Galaxy S24 Ultra",
    prizeImage: "/placeholder.svg?key=phone",
    merchantName: "Digital Gadgets Pro",
    ticketPrice: 0.8,
    totalTickets: 1200,
    solPrice: 0.8,
    endDate: "2024-12-25 16:00",
    timeLeft: "12 days 4 hours",
    participantsCount: 520,
    ticketsSold: 890,
  },
  {
    id: "6",
    title: "Luxury Business Travel Package",
    sector: "TRANSPORT",
    prizeProduct: "First Class Asia Tour Package",
    prizeImage: "/placeholder.svg?key=travel",
    merchantName: "Premium Travel Co",
    ticketPrice: 2.5,
    totalTickets: 300,
    solPrice: 2.5,
    endDate: "2024-12-28 10:00",
    timeLeft: "15 days 18 hours",
    participantsCount: 85,
    ticketsSold: 156,
  },
]

export default function RafflesPage() {
  const [selectedSector, setSelectedSector] = useState<string>("All")
  const sectors = ["All", "IT", "TRANSPORT", "APPAREL", "EDUCATION"]
  const [userTickets, setUserTickets] = useState<Record<string, number>>({})

  const filteredRaffles =
    selectedSector === "All" ? mockRaffles : mockRaffles.filter((raffle) => raffle.sector === selectedSector)

  const handleBuyTickets = (raffleId: string, price: number) => {
    alert(`Proceeding to buy raffle tickets for ${price} MKN...`)
  }

  const activeMerchantRaffles = Array.from(new Set(mockRaffles.map((r) => r.merchantName))).length

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <div className="mb-4 flex justify-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-purple-500/50 bg-purple-500/10 px-4 py-2">
                <Gift className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-semibold text-purple-400">Gamification</span>
              </div>
            </div>
            <h1 className="mb-4 text-5xl font-bold text-balance">
              <span className="gradient-text">Raffle Marketplace</span>
            </h1>
            <p className="text-xl text-foreground/60">
              Buy raffle tickets to win amazing prizes. Merchants can run up to 3 raffles simultaneously!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-12 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-6">
              <div className="text-sm text-foreground/60 mb-2">Total Raffles</div>
              <div className="text-3xl font-bold text-purple-400">{mockRaffles.length}</div>
            </div>
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-6">
              <div className="text-sm text-foreground/60 mb-2">Active Merchants</div>
              <div className="text-3xl font-bold text-cyan-400">{activeMerchantRaffles}</div>
            </div>
            <div className="rounded-lg border border-pink-500/30 bg-pink-500/10 p-6">
              <div className="text-sm text-foreground/60 mb-2">Total Tickets Sold</div>
              <div className="text-3xl font-bold text-pink-400">
                {mockRaffles.reduce((sum, r) => sum + r.ticketsSold, 0).toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6">
              <div className="text-sm text-foreground/60 mb-2">Total Participants</div>
              <div className="text-3xl font-bold text-green-400">
                {mockRaffles.reduce((sum, r) => sum + r.participantsCount, 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Sector Filter */}
          <div className="mb-8 flex flex-wrap gap-3">
            {sectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedSector === sector
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                  : "border border-foreground/20 text-foreground/70 hover:border-foreground/40 hover:text-foreground"
                  }`}
              >
                {sector}
              </button>
            ))}
          </div>

          {/* Raffles Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRaffles.map((raffle) => {
              const progress = (raffle.ticketsSold / raffle.totalTickets) * 100
              const sectorGradient = sectorColors[raffle.sector] || "from-purple-500 to-cyan-500"

              return (
                <div
                  key={raffle.id}
                  className="group rounded-xl border border-foreground/10 bg-gradient-to-b from-foreground/10 to-transparent overflow-hidden hover:border-purple-500/50 transition-all"
                >
                  {/* Prize Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-b from-foreground/20 to-foreground/5">
                    <img
                      src={raffle.prizeImage || "/placeholder.svg"}
                      alt={raffle.prizeProduct}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {/* Sector Badge */}
                    <div
                      className={`absolute top-3 right-3 rounded-full bg-gradient-to-r ${sectorGradient} px-3 py-1 text-xs font-bold text-white`}
                    >
                      {raffle.sector}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="mb-2 text-lg font-bold line-clamp-2">{raffle.title}</h3>
                    <p className="mb-4 text-sm text-foreground/60">{raffle.prizeProduct}</p>

                    <div className="mb-4 text-sm">
                      <div className="mb-2 flex items-center justify-between text-foreground/70">
                        <span className="flex items-center gap-1">
                          <span className="inline-block h-2 w-2 rounded-full bg-cyan-400"></span>
                          By {raffle.merchantName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-foreground/70 mb-2">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {raffle.participantsCount} participants
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-foreground/70">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {raffle.timeLeft}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-foreground/60">
                          {raffle.ticketsSold}/{raffle.totalTickets} tickets
                        </span>
                        <span className="text-purple-400 font-semibold">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-foreground/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Price and Button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-foreground/60 mb-1">Per Ticket</div>
                        <div className="text-xl font-bold text-purple-400">{raffle.ticketPrice} MKN</div>
                      </div>
                      <Button
                        onClick={() => handleBuyTickets(raffle.id, raffle.ticketPrice)}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Buy Ticket
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Merchant Create Raffle CTA */}
          <div className="mt-16 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-8 text-center">
            <Gift className="mx-auto mb-4 h-12 w-12 text-purple-400" />
            <h2 className="mb-2 text-2xl font-bold">Are you a Merchant?</h2>
            <p className="mb-6 text-foreground/70">
              Create up to 3 raffles simultaneously across different sectors to promote your products and engage
              customers!
            </p>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
              Create Your Raffle
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

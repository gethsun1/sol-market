"use client"

import type React from "react"
import { useState } from "react"
import Navbar from "@/components/navbar"
import { Gift, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRaffle } from "@/hooks/useRaffle"

const sectors = ["IT", "TRANSPORT", "APPAREL", "EDUCATION"]

export default function CreateRafflePage() {
  const { initializeRaffle, loading } = useRaffle()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    sector: "IT",
    prizeProduct: "",
    ticketPrice: 0.5,
    totalTickets: 1000,
    endDate: "",
    endTime: "18:00",
  })

  const [raffleCount, setRaffleCount] = useState(1)
  const maxRaffles = 3

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "ticketPrice" || name === "totalTickets" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleCreateRaffle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (raffleCount >= maxRaffles) {
      alert("You have reached the maximum of 3 raffles")
      return
    }

    // Parse Date Time
    const startUnix = Math.floor(Date.now() / 1000)
    const endDateTimeStr = `${formData.endDate}T${formData.endTime}:00`
    const endUnix = Math.floor(new Date(endDateTimeStr).getTime() / 1000)

    if (endUnix <= startUnix) {
      alert("End time must be in the future")
      return
    }

    const ticketPriceLamports = formData.ticketPrice * 1e9

    await initializeRaffle(
      0, // Category (TODO: map sector string to u8)
      endUnix,
      ticketPriceLamports
    )

    // On success
    setRaffleCount(raffleCount + 1)
    setFormData({
      title: "",
      description: "",
      sector: "IT",
      prizeProduct: "",
      ticketPrice: 0.5,
      totalTickets: 1000,
      endDate: "",
      endTime: "18:00",
    })
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Gift className="h-6 w-6 text-purple-400" />
              <h1 className="text-4xl font-bold">
                <span className="gradient-text">Create a Raffle</span>
              </h1>
            </div>
            <p className="text-foreground/60">
              Promote your products with engaging raffles. You can run {maxRaffles - raffleCount} more raffle(s)
              simultaneously.
            </p>
          </div>

          {/* Active Raffles Info */}
          {raffleCount > 1 && (
            <div className="mb-6 rounded-lg border border-cyan-500/50 bg-cyan-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-cyan-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-cyan-400">
                    Active Raffles: {raffleCount - 1}/{maxRaffles}
                  </div>
                  <div className="text-sm text-foreground/70">
                    You have {maxRaffles - raffleCount} slot(s) remaining
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleCreateRaffle}
            className="space-y-6 rounded-xl border border-foreground/10 bg-foreground/5 p-8"
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">Raffle Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Premium Gaming Laptop Giveaway"
                className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what your raffle is about..."
                rows={4}
                className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Sector Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">Sector</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-purple-500 focus:outline-none"
                >
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Prize Product</label>
                <input
                  type="text"
                  name="prizeProduct"
                  value={formData.prizeProduct}
                  onChange={handleInputChange}
                  placeholder="e.g., ASUS ROG Gaming Laptop"
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">Ticket Price (SOL)</label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  step="0.1"
                  min="0.1"
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Total Tickets</label>
                <input
                  type="number"
                  name="totalTickets"
                  value={formData.totalTickets}
                  onChange={handleInputChange}
                  step="100"
                  min="100"
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* End Date and Time */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-purple-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Revenue Preview */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
              <div className="text-sm text-foreground/70 mb-2">Estimated Revenue</div>
              <div className="text-2xl font-bold text-purple-400">
                {(formData.ticketPrice * formData.totalTickets).toFixed(2)} SOL
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={raffleCount >= maxRaffles || loading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating on Chain...
                  </>
                ) : (raffleCount >= maxRaffles ? "Maximum Raffles Reached" : "Create Raffle")}
              </Button>
              <Button type="button" variant="outline" className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Gavel, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CreateAuctionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    productType: "store",
    startingPrice: 100,
    endDate: "",
    endTime: "18:00",
    goodwillMessage: "",
    socialHandle: "",
  })

  const productTypes = [
    { value: "store", label: "E-Commerce Store" },
    { value: "service", label: "Business Service" },
    { value: "digital", label: "Digital Asset" },
    { value: "saas", label: "SaaS Platform" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "startingPrice" ? Number.parseFloat(value) || 0 : value,
    }))
  }

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Your auction has been created successfully!")
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black">
        <div className="mx-auto max-w-4xl px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <Gavel className="h-6 w-6 text-cyan-400" />
              <h1 className="text-4xl font-bold">
                <span className="gradient-text">Create an Auction</span>
              </h1>
            </div>
            <p className="text-foreground/60">
              Put your business or digital asset up for auction and connect with Web3 investors.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleCreateAuction}
            className="space-y-6 rounded-xl border border-foreground/10 bg-foreground/5 p-8"
          >
            {/* Basic Info */}
            <div>
              <label className="block text-sm font-semibold mb-2">Auction Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Premium E-Commerce Store - Beauty & Skincare"
                className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe what you're auctioning - business details, assets, performance metrics..."
                rows={4}
                className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-cyan-500 focus:outline-none"
                required
              />
            </div>

            {/* Product Type and Starting Price */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">What are you auctioning?</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-cyan-500 focus:outline-none"
                >
                  {productTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Starting Price (SOL)</label>
                <input
                  type="number"
                  name="startingPrice"
                  value={formData.startingPrice}
                  onChange={handleInputChange}
                  step="10"
                  min="10"
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Auction Duration */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-cyan-500 focus:outline-none"
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
                  className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Goodwill Message */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
              <label className="flex items-center gap-2 font-semibold mb-3">
                <MessageCircle className="h-4 w-4 text-purple-400" />
                Goodwill Message to Investors
              </label>
              <textarea
                name="goodwillMessage"
                value={formData.goodwillMessage}
                onChange={handleInputChange}
                placeholder="Write a personal message to build trust with potential buyers. Highlight what makes your business/asset special..."
                rows={4}
                className="w-full rounded-lg border border-purple-500/50 bg-purple-500/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-purple-400 focus:outline-none"
                required
              />
              <p className="mt-2 text-xs text-purple-300/70">
                This message will be displayed to all bidders to help them understand your vision
              </p>
            </div>

            {/* Social Handle */}
            <div>
              <label className="block text-sm font-semibold mb-2">Social Media Handle (Optional)</label>
              <input
                type="text"
                name="socialHandle"
                value={formData.socialHandle}
                onChange={handleInputChange}
                placeholder="@yourhandle"
                className="w-full rounded-lg border border-foreground/20 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/40 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Fee Info */}
            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
              <div className="text-sm text-foreground/70 mb-2">Auction Details</div>
              <div className="flex justify-between mb-2">
                <span>Platform Fee (5%)</span>
                <span className="font-semibold">{(formData.startingPrice * 0.05).toFixed(2)} SOL</span>
              </div>
              <div className="border-t border-cyan-500/30 pt-2 flex justify-between">
                <span className="font-semibold">You will receive (min)</span>
                <span className="font-semibold text-cyan-400">{(formData.startingPrice * 0.95).toFixed(2)} SOL</span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
              >
                Create Auction
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

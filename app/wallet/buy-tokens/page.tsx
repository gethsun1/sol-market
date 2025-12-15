"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const TOKEN_PACKAGES = [
  { tokens: 100, sol: 0.5, bonus: "0%" },
  { tokens: 500, sol: 2.3, bonus: "5%" },
  { tokens: 1000, sol: 4.4, bonus: "10%" },
  { tokens: 5000, sol: 20.0, bonus: "15%" },
]

export default function BuyTokensPage() {
  const [selectedPackage, setSelectedPackage] = useState(0)
  const [customAmount, setCustomAmount] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    // Simulate purchase
    setTimeout(() => {
      setLoading(false)
      alert("Token purchase initiated!")
    }, 1500)
  }

  const selected = TOKEN_PACKAGES[selectedPackage]

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Buy Tokens</h1>
            <p className="text-foreground/70">Exchange SOL for platform tokens</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Packages */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold mb-4">Choose a Package</h2>
              {TOKEN_PACKAGES.map((pkg, idx) => (
                <Card
                  key={idx}
                  className={`border-2 cursor-pointer transition-all ${
                    selectedPackage === idx
                      ? "border-purple-500 bg-purple-500/5"
                      : "border-border hover:border-purple-500/50"
                  }`}
                  onClick={() => setSelectedPackage(idx)}
                >
                  <CardContent className="p-6 flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold mb-1">{pkg.tokens} TOKENS</p>
                      <p className="text-sm text-foreground/60">{pkg.sol} SOL</p>
                    </div>
                    <div className="text-right">
                      <div className="inline-block px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-2">
                        +{pkg.bonus} Bonus
                      </div>
                      <p className="text-xs text-foreground/60">Best value</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Custom Amount */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base">Custom Amount</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount of SOL</label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <p className="text-sm text-foreground/60">
                    ≈ {customAmount ? (Number.parseFloat(customAmount) * 222).toFixed(0) : "0"} TOKENS
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div>
              <Card className="border-border bg-card sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Tokens will be credited immediately upon payment confirmation
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3 py-4 border-t border-b border-border">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Tokens</span>
                      <span className="font-semibold">{selected.tokens}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Bonus ({selected.bonus})</span>
                      <span className="font-semibold text-green-400">
                        +{((selected.tokens * Number.parseFloat(selected.bonus)) / 100).toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Total Tokens</span>
                      <span className="font-semibold text-cyan-400">
                        {(selected.tokens + (selected.tokens * Number.parseFloat(selected.bonus)) / 100).toFixed(0)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-cyan-400">{selected.sol} SOL</span>
                    </div>
                    <p className="text-xs text-foreground/60">≈ ${(selected.sol * 140).toFixed(2)} USD</p>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12 gap-2"
                  >
                    {loading ? "Processing..." : "Confirm Purchase"} <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-xs text-foreground/60 text-center">Transaction fee included</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

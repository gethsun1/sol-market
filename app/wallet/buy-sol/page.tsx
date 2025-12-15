"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function BuySolPage() {
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      alert("SOL purchase initiated!")
    }, 1500)
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Buy SOL</h1>
            <p className="text-foreground/70">Add funds to your wallet using multiple payment methods</p>
          </div>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>Select Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick amounts */}
              <div>
                <p className="text-sm font-medium mb-3">Quick amounts</p>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 50].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setAmount(amt.toString())}
                      className={`py-2 px-3 rounded-lg border transition-all ${
                        amount === amt.toString()
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 border-purple-500 text-white"
                          : "border-border hover:border-purple-500/50"
                      }`}
                    >
                      {amt} SOL
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Custom Amount (SOL)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Payment methods */}
              <div>
                <p className="text-sm font-medium mb-3">Payment Method</p>
                <div className="space-y-2">
                  {["card", "bank", "paypal"].map((method) => (
                    <label
                      key={method}
                      className="flex items-center p-3 border border-border rounded-lg cursor-pointer hover:bg-white/5"
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3"
                      />
                      <span className="capitalize font-medium">
                        {method === "card" && "Credit/Debit Card"}
                        {method === "bank" && "Bank Transfer"}
                        {method === "paypal" && "PayPal"}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  SOL will be deposited to your wallet within 5 minutes
                </AlertDescription>
              </Alert>

              {/* CTA */}
              <Button
                onClick={handlePurchase}
                disabled={!amount || loading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12"
              >
                {loading ? "Processing..." : `Buy ${amount || "0"} SOL`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

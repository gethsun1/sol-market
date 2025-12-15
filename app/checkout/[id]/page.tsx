"use client"

import { useState } from "react"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, CheckCircle2, Clock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter, useParams } from "next/navigation"

export const dynamic = 'force-dynamic'

type CheckoutStep = "review" | "confirm" | "processing" | "success"

const MOCK_LISTING = {
  id: "1",
  title: "Vintage Leather Jacket",
  price: 2.5,
  image_url: "/vintage-leather-jacket.jpg",
  seller: { username: "fashionista_sol", wallet: "4LmcC...9xK2" },
}

export default function CheckoutPage() {
  const router = useRouter()
  const params = useParams()
  const [step, setStep] = useState<CheckoutStep>("review")
  const [loading, setLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [txHash, setTxHash] = useState("")

  const handleContinue = async () => {
    setStep("confirm")
  }

  const handlePayment = async () => {
    setLoading(true)
    setStep("processing")

    try {
      // Simulate smart contract call and escrow setup
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const response = await fetch("/api/transactions/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listing_id: params.id,
          amount: MOCK_LISTING.price,
          buyer_shipping: shippingAddress,
          seller_id: "mock-seller-id",
        }),
      })

      if (!response.ok) throw new Error("Transaction failed")

      const data = await response.json()
      setTxHash(data.transaction_hash)
      setStep("success")

      setTimeout(() => {
        router.push("/transactions")
      }, 3000)
    } catch (err) {
      console.error("Payment error:", err)
      setStep("review")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 gradient-text">Checkout</h1>
            <p className="text-foreground/70">Secure payment with smart contract escrow</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Step 1: Review */}
              {step === "review" && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Review Order</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Item */}
                    <div className="flex gap-4 pb-6 border-b border-border">
                      <img
                        src={MOCK_LISTING.image_url || "/placeholder.svg"}
                        alt={MOCK_LISTING.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{MOCK_LISTING.title}</h3>
                        <p className="text-sm text-foreground/60">Seller: {MOCK_LISTING.seller.username}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-cyan-400">{MOCK_LISTING.price} SOL</p>
                      </div>
                    </div>

                    {/* Shipping Info */}
                    <div>
                      <h3 className="font-semibold mb-4">Shipping Information</h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={shippingAddress.fullName}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          value={shippingAddress.email}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="Street Address"
                          value={shippingAddress.address}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            placeholder="City"
                            value={shippingAddress.city}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                            className="col-span-2 px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                          <input
                            type="text"
                            placeholder="State"
                            value={shippingAddress.state}
                            onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                            className="px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="ZIP Code"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                          className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={handleContinue}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12"
                    >
                      Continue to Payment
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Confirm Payment */}
              {step === "confirm" && (
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle>Confirm Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Lock className="h-4 w-4" />
                      <AlertDescription>
                        Your payment will be secured in a smart contract escrow. Funds are only released to the seller
                        after you confirm receipt.
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Item Price</span>
                        <span className="font-semibold">{MOCK_LISTING.price} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-foreground/60">Transaction Fee (1%)</span>
                        <span className="font-semibold">{(MOCK_LISTING.price * 0.01).toFixed(3)} SOL</span>
                      </div>
                      <div className="border-t border-border pt-3 mt-3 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-cyan-400">{(MOCK_LISTING.price * 1.01).toFixed(3)} SOL</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-foreground/60">Escrow Protection:</p>
                      <ul className="text-sm space-y-2 text-foreground/70">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Funds held securely in smart contract
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          You can dispute within 30 days
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          Seller only receives funds after confirmation
                        </li>
                      </ul>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={() => setStep("review")} variant="outline" className="flex-1">
                        Back
                      </Button>
                      <Button
                        onClick={handlePayment}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 h-12"
                      >
                        {loading ? "Processing..." : "Complete Payment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Processing */}
              {step === "processing" && (
                <Card className="border-border bg-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Clock className="h-16 w-16 text-cyan-400 mb-4 animate-spin" />
                    <h3 className="text-2xl font-bold mb-2">Processing Payment</h3>
                    <p className="text-foreground/60 text-center mb-6">
                      Setting up smart contract escrow and confirming transaction...
                    </p>
                    <p className="text-sm text-cyan-400 font-mono">Please don't close this window</p>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Success */}
              {step === "success" && (
                <Card className="border-border bg-card border-green-500/30">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <CheckCircle2 className="h-16 w-16 text-green-400 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                    <p className="text-foreground/60 text-center mb-6">
                      Your order is secured in escrow. You'll receive updates on shipping soon.
                    </p>
                    {txHash && (
                      <div className="w-full mb-6 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-foreground/60 mb-1">Transaction Hash:</p>
                        <p className="font-mono text-xs text-cyan-400 break-all">{txHash}</p>
                      </div>
                    )}
                    <p className="text-sm text-foreground/60">Redirecting to your transactions...</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="border-border bg-card sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <img
                    src={MOCK_LISTING.image_url || "/placeholder.svg"}
                    alt={MOCK_LISTING.title}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Item</p>
                    <p className="font-semibold">{MOCK_LISTING.title}</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-foreground/60 mb-1">Seller</p>
                    <p className="font-mono text-sm">{MOCK_LISTING.seller.wallet}</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex justify-between mb-3">
                      <span className="text-foreground/60">Price</span>
                      <span className="font-semibold">{MOCK_LISTING.price} SOL</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-3">
                      <span className="font-bold">Total</span>
                      <span className="text-xl font-bold text-cyan-400">{MOCK_LISTING.price} SOL</span>
                    </div>
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

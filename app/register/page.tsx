"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<"wallet" | "details" | "complete">("wallet")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  })

  const handleConnectWallet = async () => {
    setLoading(true)
    setError("")
    try {
      // Simulate wallet connection
      const mockWallet = "4" + Math.random().toString(36).substring(2, 42)
      setWalletAddress(mockWallet)
      setStep("details")
    } catch (err) {
      setError("Failed to connect wallet")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wallet_address: walletAddress,
          username: formData.username,
          email: formData.email,
          bio: formData.bio,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Registration failed")
      }

      setStep("complete")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-4 py-12">
        <div className="mx-auto max-w-md">
          {step === "wallet" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="gradient-text">Create Your Account</CardTitle>
                <CardDescription>Connect your Solana wallet to get started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <Button
                  onClick={handleConnectWallet}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12"
                >
                  {loading ? "Connecting..." : "Connect Phantom Wallet"}
                </Button>
                <p className="text-sm text-foreground/60 text-center">We support Phantom and other Solana wallets</p>
              </CardContent>
            </Card>
          )}

          {step === "details" && (
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription className="font-mono text-xs text-cyan-400">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="your_username"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Bio (Optional)</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      className="w-full px-4 py-2 rounded-lg bg-input border border-border text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none h-24"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 h-12"
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {step === "complete" && (
            <Card className="border-border bg-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold text-center mb-2">Welcome to SolMarket!</h2>
                <p className="text-foreground/60 text-center mb-6">Your account has been created successfully</p>
                <p className="text-sm text-cyan-400 text-center">Redirecting to dashboard...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

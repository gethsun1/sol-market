"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { useSolanaWallet } from "@/components/solana/use-wallet"

type Product = {
  id: number
  merchant_id: number
  name: string
  description: string | null
  category: string | null
  price_lamports: number
  discount_percent: number
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const { address } = useSolanaWallet()
  const wallet = useMemo(() => address, [address])
  const [cartId, setCartId] = useState<number | null>(null)

  useEffect(() => {
    ;(async () => {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data.products ?? [])
    })()
  }, [])

  useEffect(() => {
    if (!wallet) return
    ;(async () => {
      const res = await fetch(`/api/carts?wallet=${wallet}`)
      const data = await res.json()
      if (data.cart?.id) setCartId(data.cart.id)
    })()
  }, [wallet])

  async function addToCart(productId: number) {
    if (!wallet) {
      alert("Connect Solana wallet first.")
      return
    }
    if (!cartId) {
      alert("Cart not ready yet, please retry.")
      return
    }
    setLoading(true)
    try {
      await fetch("/api/cart-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, productId, quantity: 1 }),
      })
      alert("Added to cart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => {
          const discounted = Math.floor(p.price_lamports * (1 - (p.discount_percent ?? 0) / 100))
          return (
            <Card key={p.id}>
              <CardContent className="p-4 space-y-2">
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-foreground/70">{p.description}</div>
                <div className="text-sm">
                  Price: {discounted} lamports{" "}
                  {p.discount_percent ? (
                    <span className="text-foreground/60 line-through ml-2">{p.price_lamports}</span>
                  ) : null}
                </div>
                <Button onClick={() => addToCart(p.id)} disabled={loading}>
                  Add to cart
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}





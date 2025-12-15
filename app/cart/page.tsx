"use client"

import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/navbar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useSolanaWallet } from "@/components/solana/use-wallet"

type Cart = { id: number; client_wallet: string; status: string }
type Item = { id: number; product_id: number; quantity: number; name: string; price_lamports: number }

export default function CartPage() {
  const { address } = useSolanaWallet()
  const wallet = useMemo(() => address, [address])
  const [cart, setCart] = useState<Cart | null>(null)
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    if (!wallet) return
    ;(async () => {
      const cartRes = await fetch(`/api/carts?wallet=${wallet}`)
      const cartData = await cartRes.json()
      setCart(cartData.cart ?? null)
      if (cartData.cart?.id) {
        const itemsRes = await fetch(`/api/cart-items?cartId=${cartData.cart.id}`)
        const itemsData = await itemsRes.json()
        setItems(itemsData.items ?? [])
      }
    })()
  }, [wallet])

  const total = items.reduce((sum, i) => sum + i.price_lamports * i.quantity, 0)

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-xl font-semibold">Your Cart</h1>
        {!wallet && <div>Connect wallet to view your cart.</div>}
        {wallet && !cart && <div>Loading cart...</div>}
        {cart && (
          <Card>
            <CardContent className="p-4 space-y-3">
              {items.length ? (
                <>
                  {items.map((i) => (
                    <div key={i.id} className="flex items-center justify-between border-b border-border pb-2">
                      <div>
                        <div className="font-medium">{i.name}</div>
                        <div className="text-sm text-foreground/70">
                          {i.quantity} × {i.price_lamports} lamports
                        </div>
                      </div>
                      <div className="font-semibold">{i.price_lamports * i.quantity} lamports</div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-foreground/70">Total</div>
                    <div className="font-semibold">{total} lamports</div>
                  </div>
                  <Link href="/checkout">
                    <Button>Checkout</Button>
                  </Link>
                </>
              ) : (
                <div>Your cart is empty.</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}





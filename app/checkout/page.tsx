"use client"

import { useEffect, useMemo, useState } from "react"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSolanaWallet } from "@/components/solana/use-wallet"
import { useRouter } from "next/navigation"
import { useConnection } from "@solana/wallet-adapter-react"
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js"

export const dynamic = 'force-dynamic'

type Cart = { id: number; client_wallet: string; status: string }

export default function CheckoutPage() {
  const { address } = useSolanaWallet()
  const wallet = useMemo(() => address, [address])
  const [cart, setCart] = useState<Cart | null>(null)
  const [creating, setCreating] = useState(false)
  const [result, setResult] = useState<{
    orderId: number
    totalLamports: number
    merchantId: number
    escrowAccount?: string
    paymentTx?: string
    paid?: boolean
  } | null>(null)
  const router = useRouter()
  const { connection } = useConnection()
  const { publicKey, signTransaction, sendTransaction } = require("@solana/wallet-adapter-react").useWallet()

  const ESCROW_PROGRAM_ID = new PublicKey("8jR5GeNzeweq35Uo84kGP3v1NcBaZWH5u62k7PxN4T2y")

  function u64le(n: bigint) {
    const buf = Buffer.alloc(8)
    buf.writeBigUInt64LE(n)
    return buf
  }
  function i64le(n: bigint) {
    const buf = Buffer.alloc(8)
    buf.writeBigInt64LE(n)
    return buf
  }
  const INIT_DISCRIMINATOR = Buffer.from([243, 160, 77, 153, 11, 92, 48, 209])
  const FUND_DISCRIMINATOR = Buffer.from([155, 18, 218, 141, 182, 213, 69, 201])

  useEffect(() => {
    if (!wallet) return
      ; (async () => {
        const cartRes = await fetch(`/api/carts?wallet=${wallet}`)
        const cartData = await cartRes.json()
        if (cartData.cart) setCart(cartData.cart)
      })()
  }, [wallet])

  async function createOrder() {
    if (!wallet || !cart) return
    setCreating(true)
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId: cart.id, clientWallet: wallet }),
      })
      const data = await res.json()
      if (data.order) {
        setResult({
          orderId: data.order.id,
          totalLamports: Number(data.order.total_lamports),
          merchantId: Number(data.order.merchant_id),
        })
        // Initialize on-chain escrow right away
        await initializeEscrow(data.order.id, Number(data.order.total_lamports), Number(data.order.merchant_id))
      } else {
        alert(data.error ?? "Failed to create order")
      }
    } finally {
      setCreating(false)
    }
  }

  async function initializeEscrow(orderId: number, totalLamports: number, merchantId: number) {
    try {
      if (!publicKey) {
        alert("Connect wallet first")
        return
      }
      const merchantRes = await fetch(`/api/merchants/${merchantId}`)
      const merchantData = await merchantRes.json()
      const merchantWallet = new PublicKey(merchantData.merchant.wallet_address)

      // PDAs
      const [configPda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("config")],
        ESCROW_PROGRAM_ID,
      )
      const orderIdLe = u64le(BigInt(orderId))
      const [escrowPda] = await PublicKey.findProgramAddressSync(
        [Buffer.from("sol-escrow"), publicKey.toBuffer(), orderIdLe],
        ESCROW_PROGRAM_ID,
      )
      const expiresSecs = Number(process.env.NEXT_PUBLIC_ESCROW_EXPIRY_SECS ?? "259200") | 0
      const expiresAt = Math.floor(Date.now() / 1000) + expiresSecs

      const data = Buffer.concat([
        INIT_DISCRIMINATOR,
        u64le(BigInt(orderId)),
        u64le(BigInt(totalLamports)),
        i64le(BigInt(expiresAt)),
      ])
      const ix = new TransactionInstruction({
        programId: ESCROW_PROGRAM_ID,
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true }, // payer
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: configPda, isSigner: false, isWritable: false },
          { pubkey: publicKey, isSigner: false, isWritable: false }, // buyer
          { pubkey: merchantWallet, isSigner: false, isWritable: false }, // merchant
          { pubkey: escrowPda, isSigner: false, isWritable: true },
        ],
        data,
      })
      const tx = new Transaction().add(ix)
      tx.feePayer = publicKey
      const { blockhash } = await connection.getLatestBlockhash("confirmed")
      tx.recentBlockhash = blockhash
      const sig = await sendTransaction(tx, connection, { skipPreflight: false })
      await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ escrowAccount: escrowPda.toBase58() }),
      })
      setResult((r) => (r ? { ...r, escrowAccount: escrowPda.toBase58() } : r))
      console.log("initialize_escrow tx", sig)
    } catch (e: any) {
      console.error(e)
      alert(e.message ?? "Failed to initialize escrow")
    }
  }

  async function fundEscrow() {
    try {
      if (!publicKey || !result?.orderId || !result.escrowAccount) return
      const escrowPk = new PublicKey(result.escrowAccount)
      const data = Buffer.from(FUND_DISCRIMINATOR)
      const ix = new TransactionInstruction({
        programId: ESCROW_PROGRAM_ID,
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true }, // buyer
          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: escrowPk, isSigner: false, isWritable: true },
        ],
        data,
      })
      const tx = new Transaction().add(ix)
      tx.feePayer = publicKey
      const { blockhash } = await connection.getLatestBlockhash("confirmed")
      tx.recentBlockhash = blockhash
      const sig = await sendTransaction(tx, connection, { skipPreflight: false })
      await fetch(`/api/orders/${result.orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "funded", paymentTx: sig }),
      })
      setResult((r) => (r ? { ...r, paymentTx: sig, paid: true } : r))
    } catch (e: any) {
      console.error(e)
      alert(e.message ?? "Failed to fund escrow")
    }
  }

  if (!wallet) {
    return (
      <div>
        <Navbar />
        <div className="p-6">Connect your wallet to checkout.</div>
      </div>
    )
  }

  if (!cart) {
    return (
      <div>
        <Navbar />
        <div className="p-6">No open cart found.</div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto p-6">
        <Card className="p-6 space-y-4">
          <div className="text-lg font-semibold">Confirm Order</div>
          <div className="text-sm text-muted-foreground">Cart #{cart.id}</div>
          {result ? (
            <div className="space-y-2">
              <div>Order created: #{result.orderId}</div>
              <div>Total: {result.totalLamports / 1e3} MKN</div>
              {result.paid ? (
                <>
                  <div className="text-sm">Payment submitted: {result.paymentTx}</div>
                  <Button onClick={() => router.push("/account")}>Go to Account</Button>
                </>
              ) : (
                <Button onClick={fundEscrow} disabled={!publicKey || !result.escrowAccount}>
                  Pay in MKN
                </Button>
              )}
            </div>
          ) : (
            <Button onClick={createOrder} disabled={creating}>
              Create Order
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}



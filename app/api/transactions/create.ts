import { type NextRequest, NextResponse } from "next/server"
import { createEscrow } from "@/lib/escrow"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listing_id, amount, buyer_wallet, seller_id } = body

    if (!listing_id || !amount || !buyer_wallet || !seller_id) {
      return NextResponse.json(
        { error: "listing_id, amount, buyer_wallet, and seller_id are required" }, 
        { status: 400 }
      )
    }

    // Create or get buyer record
    const buyerResult = await sql`
      INSERT INTO users (wallet_address, username, email)
      VALUES (${buyer_wallet}, ${buyer_wallet}, ${buyer_wallet + "@demo.local"})
      ON CONFLICT (wallet_address) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `
    const buyerId = buyerResult[0].id

    // Create transaction with escrow
    const transaction = await createEscrow(
      buyerId,
      seller_id,
      listing_id,
      amount,
      buyer_wallet
    )

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        escrow_address: transaction.escrow_address,
        status: transaction.status,
        transaction_hash: transaction.transaction_hash,
        amount: transaction.amount,
        created_at: transaction.created_at
      },
      explorer_url: `https://explorer.solana.com/account/${transaction.escrow_address}?cluster=devnet`
    })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Transaction failed" }, 
      { status: 500 }
    )
  }
}

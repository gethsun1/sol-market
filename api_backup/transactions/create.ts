import { type NextRequest, NextResponse } from "next/server"
import { createEscrow } from "@/lib/escrow"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { listing_id, amount, buyer_shipping, seller_id } = body

    // Create transaction in escrow
    const transaction = await createEscrow("mock-buyer-id", seller_id, listing_id, amount)

    // Simulate smart contract transaction
    const transactionHash = "0x" + Math.random().toString(16).slice(2)

    // Update transaction with hash
    const result = await sql`
      UPDATE transactions
      SET transaction_hash = ${transactionHash}
      WHERE id = ${transaction.id}
      RETURNING *
    `

    return NextResponse.json({
      ...result[0],
      transaction_hash: transactionHash,
    })
  } catch (error) {
    console.error("Transaction creation error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Transaction failed" }, { status: 500 })
  }
}

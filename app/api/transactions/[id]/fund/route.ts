import { type NextRequest, NextResponse } from "next/server"
import { fundEscrow } from "@/lib/escrow"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id
    const body = await request.json()
    const { amount_lamports } = body

    if (!amount_lamports || typeof amount_lamports !== "number") {
      return NextResponse.json(
        { error: "amount_lamports is required and must be a number" }, 
        { status: 400 }
      )
    }

    // Fund the escrow
    const transaction = await fundEscrow(transactionId, amount_lamports)

    return NextResponse.json({
      success: true,
      transaction: {
        id: transaction.id,
        status: transaction.status,
        escrow_address: transaction.escrow_address,
        transaction_hash: transaction.transaction_hash,
        amount: transaction.amount
      },
      explorer_url: `https://explorer.solana.com/tx/${transaction.transaction_hash}?cluster=devnet`
    })
  } catch (error) {
    console.error("Fund escrow error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fund escrow" }, 
      { status: 500 }
    )
  }
}

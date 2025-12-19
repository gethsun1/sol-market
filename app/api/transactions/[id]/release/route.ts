import { type NextRequest, NextResponse } from "next/server"
import { releaseEscrow } from "@/lib/escrow"

export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const transactionId = params.id

    // Release funds from escrow
    const transaction = await releaseEscrow(transactionId)

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
    console.error("Release escrow error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to release escrow" }, 
      { status: 500 }
    )
  }
}

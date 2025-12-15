import { sql } from "./db"

export interface EscrowData {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  amount: number
  escrow_address: string
  status: "active" | "released" | "refunded" | "disputed"
  created_at: string
}

export async function createEscrow(buyerId: string, sellerId: string, listingId: string, amount: number) {
  try {
    // Generate mock escrow address
    const escrowAddress = "4" + Math.random().toString(36).substring(2, 42)

    const result = await sql`
      INSERT INTO transactions (buyer_id, seller_id, listing_id, amount, escrow_address, status)
      VALUES (${buyerId}, ${sellerId}, ${listingId}, ${amount}, ${escrowAddress}, 'pending')
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Create escrow error:", error)
    throw error
  }
}

export async function releaseEscrow(transactionId: string) {
  try {
    const result = await sql`
      UPDATE transactions
      SET status = 'released', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${transactionId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Release escrow error:", error)
    throw error
  }
}

export async function refundEscrow(transactionId: string) {
  try {
    const result = await sql`
      UPDATE transactions
      SET status = 'refunded', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${transactionId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Refund escrow error:", error)
    throw error
  }
}

export async function getTransaction(transactionId: string) {
  try {
    const result = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId}
    `
    return result[0] || null
  } catch (error) {
    console.error("Get transaction error:", error)
    throw error
  }
}

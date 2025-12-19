import { sql } from "./db"
import { SolanaEscrowService } from "./solana-escrow"

export interface EscrowData {
  id: string
  buyer_id: string
  seller_id: string
  listing_id: string
  amount: number
  escrow_address: string
  status: "active" | "released" | "refunded" | "disputed"
  transaction_hash?: string
  created_at: string
}

export async function createEscrow(
  buyerId: string, 
  sellerId: string, 
  listingId: string, 
  amount: number,
  buyerWallet?: string
) {
  try {
    // For demo: create escrow using mock service
    // In production, this would use actual buyer wallet
    const escrowService = new SolanaEscrowService({ publicKey: null } as any)
    
    // Generate unique order ID from database
    const orderId = Date.now() + Math.floor(Math.random() * 1000)
    
    const { escrowAddress, transactionHash } = await escrowService.createEscrow(
      orderId,
      amount,
      sellerId, // Using sellerId as mock seller pubkey for demo
      259200 // 3 days expiry
    )

    const result = await sql`
      INSERT INTO transactions (buyer_id, seller_id, listing_id, amount, escrow_address, status, transaction_hash)
      VALUES (${buyerId}, ${sellerId}, ${listingId}, ${amount}, ${escrowAddress}, 'pending', ${transactionHash})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Create escrow error:", error)
    throw error
  }
}

export async function fundEscrow(transactionId: string, amountLamports: number) {
  try {
    // Get transaction details
    const transaction = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId}
    `
    
    if (!transaction.length) {
      throw new Error("Transaction not found")
    }

    const escrowService = new SolanaEscrowService({ publicKey: null } as any)
    const fundHash = await escrowService.fundEscrow(transaction[0].escrow_address, amountLamports)

    const result = await sql`
      UPDATE transactions
      SET status = 'funded', transaction_hash = COALESCE(transaction_hash, '') || ', ' || ${fundHash}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${transactionId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Fund escrow error:", error)
    throw error
  }
}

export async function releaseEscrow(transactionId: string) {
  try {
    // Get transaction details
    const transaction = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId}
    `
    
    if (!transaction.length) {
      throw new Error("Transaction not found")
    }

    const escrowService = new SolanaEscrowService({ publicKey: null } as any)
    const releaseHash = await escrowService.releaseEscrow(transaction[0].escrow_address)

    const result = await sql`
      UPDATE transactions
      SET status = 'released', transaction_hash = COALESCE(transaction_hash, '') || ', ' || ${releaseHash}, updated_at = CURRENT_TIMESTAMP
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
    // Get transaction details
    const transaction = await sql`
      SELECT * FROM transactions WHERE id = ${transactionId}
    `
    
    if (!transaction.length) {
      throw new Error("Transaction not found")
    }

    const escrowService = new SolanaEscrowService({ publicKey: null } as any)
    const refundHash = await escrowService.refundEscrow(transaction[0].escrow_address)

    const result = await sql`
      UPDATE transactions
      SET status = 'refunded', transaction_hash = COALESCE(transaction_hash, '') || ', ' || ${refundHash}, updated_at = CURRENT_TIMESTAMP
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

export async function getTransactionsByBuyer(buyerId: string) {
  try {
    const result = await sql`
      SELECT * FROM transactions 
      WHERE buyer_id = ${buyerId} 
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error("Get buyer transactions error:", error)
    throw error
  }
}

export async function getTransactionsBySeller(sellerId: string) {
  try {
    const result = await sql`
      SELECT * FROM transactions 
      WHERE seller_id = ${sellerId} 
      ORDER BY created_at DESC
    `
    return result
  } catch (error) {
    console.error("Get seller transactions error:", error)
    throw error
  }
}

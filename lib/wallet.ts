import { sql } from "./db"

export interface WalletData {
  id: string
  user_id: string
  wallet_address: string
  sol_balance: number
  token_balance: number
  escrow_balance: number
}

export async function getWalletBalance(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_wallets WHERE user_id = ${userId}
    `
    return result[0] || null
  } catch (error) {
    console.error("Get wallet balance error:", error)
    throw error
  }
}

export async function updateWalletBalance(userId: string, solChange = 0, tokenChange = 0, escrowChange = 0) {
  try {
    const result = await sql`
      UPDATE user_wallets
      SET
        sol_balance = sol_balance + ${solChange},
        token_balance = token_balance + ${tokenChange},
        escrow_balance = escrow_balance + ${escrowChange},
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Update wallet balance error:", error)
    throw error
  }
}

export async function recordTokenExchange(
  userId: string,
  solAmount: number,
  tokenAmount: number,
  exchangeRate: number,
) {
  try {
    const result = await sql`
      INSERT INTO token_exchanges (user_id, sol_amount, token_amount, exchange_rate)
      VALUES (${userId}, ${solAmount}, ${tokenAmount}, ${exchangeRate})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Record token exchange error:", error)
    throw error
  }
}

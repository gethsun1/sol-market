import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        ;(session.user as any).id = token.sub
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

import { sql } from "./db"

export interface User {
  id: string
  wallet_address: string
  username: string
  email: string
  profile_image_url?: string
  bio?: string
  created_at: string
}

export async function registerUser(data: {
  wallet_address: string
  username: string
  email: string
}) {
  try {
    const result = await sql`
      INSERT INTO users (wallet_address, username, email)
      VALUES (${data.wallet_address}, ${data.username}, ${data.email})
      ON CONFLICT (wallet_address) DO UPDATE SET updated_at = CURRENT_TIMESTAMP
      RETURNING id, wallet_address, username, email, created_at
    `
    return result[0]
  } catch (error) {
    console.error("Registration error:", error)
    throw error
  }
}

export async function getUserByWallet(walletAddress: string) {
  try {
    const result = await sql`
      SELECT * FROM users WHERE wallet_address = ${walletAddress}
    `
    return result[0] || null
  } catch (error) {
    console.error("Get user error:", error)
    throw error
  }
}

export async function createUserWallet(userId: string, walletAddress: string) {
  try {
    const result = await sql`
      INSERT INTO user_wallets (user_id, wallet_address, sol_balance)
      VALUES (${userId}, ${walletAddress}, 0)
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Create wallet error:", error)
    throw error
  }
}

export async function getUserWallet(userId: string) {
  try {
    const result = await sql`
      SELECT * FROM user_wallets WHERE user_id = ${userId}
    `
    return result[0] || null
  } catch (error) {
    console.error("Get wallet error:", error)
    throw error
  }
}

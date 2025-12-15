import { type NextRequest, NextResponse } from "next/server"
import { registerUser, createUserWallet } from "@/lib/auth"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { wallet_address, username, email, bio } = body

    if (!wallet_address || !username || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Register user
    const user = await registerUser({
      wallet_address,
      username,
      email,
    })

    // Create user wallet
    await createUserWallet(user.id, wallet_address)

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 500 })
  }
}

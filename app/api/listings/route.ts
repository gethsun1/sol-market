import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    try {
        // Fetch all active listings from database
        const listings = await sql`
      SELECT 
        l.*,
        u.username as seller_username,
        u.wallet_address as seller_wallet
      FROM listings l
      LEFT JOIN users u ON l.seller_id = u.id
      WHERE l.status = 'active'
      ORDER BY l.created_at DESC
      LIMIT 50
    `

        return NextResponse.json(listings, { status: 200 })
    } catch (error) {
        console.error("Listing fetch error:", error)
        // Return empty array on error so UI doesn't break
        return NextResponse.json([], { status: 200 })
    }
}

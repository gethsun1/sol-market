import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, category, image_url } = body

    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create listing (using mock seller_id for now)
    const listing = await sql`
      INSERT INTO listings (seller_id, title, description, price, image_url, category)
      VALUES (
        '550e8400-e29b-41d4-a716-446655440000',
        ${title},
        ${description},
        ${Number.parseFloat(price)},
        ${image_url || ""},
        ${category}
      )
      RETURNING *
    `

    return NextResponse.json(listing[0], { status: 201 })
  } catch (error) {
    console.error("Listing creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create listing" },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, price, category, image_url } = body

    if (!title || !description || !price || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // For now, return a mock success response for testing
    // This allows testing the MKN listing flow without database setup
    const mockListing = {
      id: crypto.randomUUID(),
      seller_id: '550e8400-e29b-41d4-a716-446655440000',
      title,
      description,
      price: Number.parseFloat(price),
      image_url: image_url || "",
      category,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log("Mock listing created:", mockListing)

    return NextResponse.json(mockListing, { status: 201 })
  } catch (error) {
    console.error("Listing creation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create listing" },
      { status: 500 },
    )
  }
}

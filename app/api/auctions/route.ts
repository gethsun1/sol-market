import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

// Get all auctions or create new auction
export async function GET(request: Request) {
  await initializeDatabase()
  try {
    const { searchParams } = new URL(request.url)
    const sellerId = searchParams.get("sellerId")
    const status = searchParams.get("status")
    
    let query = `
      SELECT a.*, 
             u.username as seller_username,
             u.wallet_address as seller_wallet,
             COALESCE(
               (SELECT MAX(bid_amount) FROM auction_bids WHERE auction_id = a.id), 
               a.starting_price
             ) as current_price,
             (SELECT COUNT(*) FROM auction_bids WHERE auction_id = a.id) as bid_count
      FROM auctions a
      JOIN users u ON a.seller_id = u.id
    `
    
    const conditions = []
    if (sellerId) conditions.push(`a.seller_id = ${sellerId}`)
    if (status) conditions.push(`a.status = ${status}`)
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }
    
    query += " ORDER BY a.created_at DESC"
    
    const auctions = await sql(query)
    
    return Response.json({ auctions })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to fetch auctions" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  await initializeDatabase()
  try {
    const { 
      sellerId, 
      productId, 
      title, 
      description, 
      startingPrice, 
      endDate,
      goodwillMessage,
      socialMediaHandle 
    } = await request.json()
    
    if (!sellerId || !title || !startingPrice || !endDate) {
      return new Response(
        JSON.stringify({ error: "sellerId, title, startingPrice, and endDate required" }), 
        { status: 400 }
      )
    }
    
    // Create auction with demo-safe implementation
    const result = await sql`
      INSERT INTO auctions (
        seller_id, 
        product_id, 
        title, 
        description, 
        starting_price, 
        current_price,
        end_date,
        goodwill_message,
        social_media_handle
      )
      VALUES (
        ${sellerId}, 
        ${productId || null}, 
        ${title}, 
        ${description || null}, 
        ${startingPrice}, 
        ${startingPrice},
        ${endDate},
        ${goodwillMessage || null},
        ${socialMediaHandle || null}
      )
      RETURNING *
    `
    
    return Response.json({ 
      success: true,
      auction: result[0],
      message: "Demo auction created successfully (devnet mode)"
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to create auction" }), { status: 500 })
  }
}

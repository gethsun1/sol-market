import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

// Get all raffles or create new raffle
export async function GET(request: Request) {
  await initializeDatabase()
  try {
    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get("merchantId")
    const status = searchParams.get("status")
    
    let query = `
      SELECT r.*, 
             u.username as merchant_username,
             u.wallet_address as merchant_wallet,
             COALESCE(
               (SELECT SUM(ticket_count) FROM raffle_entries WHERE raffle_id = r.id), 
               0
             ) as total_tickets_sold,
             (SELECT COUNT(DISTINCT buyer_id) FROM raffle_entries WHERE raffle_id = r.id) as unique_participants
      FROM raffles r
      JOIN users u ON r.merchant_id = u.id
    `
    
    const conditions = []
    if (merchantId) conditions.push(`r.merchant_id = ${merchantId}`)
    if (status) conditions.push(`r.status = ${status}`)
    
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ")
    }
    
    query += " ORDER BY r.created_at DESC"
    
    const raffles = await sql(query)
    
    return Response.json({ raffles })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to fetch raffles" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  await initializeDatabase()
  try {
    const { 
      merchantId, 
      title, 
      description, 
      sector, 
      prizeProductId, 
      ticketPrice, 
      maxRaffleSlots,
      endDate 
    } = await request.json()
    
    if (!merchantId || !title || !sector || !ticketPrice || !endDate) {
      return new Response(
        JSON.stringify({ 
          error: "merchantId, title, sector, ticketPrice, and endDate required" 
        }), 
        { status: 400 }
      )
    }
    
    // Create raffle with demo-safe implementation
    const result = await sql`
      INSERT INTO raffles (
        merchant_id, 
        title, 
        description, 
        sector, 
        prize_product_id, 
        ticket_price, 
        max_raffle_slots,
        end_date
      )
      VALUES (
        ${merchantId}, 
        ${title}, 
        ${description || null}, 
        ${sector}, 
        ${prizeProductId || null}, 
        ${ticketPrice}, 
        ${maxRaffleSlots || 1000},
        ${endDate}
      )
      RETURNING *
    `
    
    return Response.json({ 
      success: true,
      raffle: result[0],
      message: "Demo raffle created successfully (devnet mode)"
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to create raffle" }), { status: 500 })
  }
}

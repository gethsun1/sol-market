import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await initializeDatabase()
  try {
    const raffleId = params.id
    const { buyerId, ticketCount, walletAddress } = await request.json()
    
    if (!buyerId || !ticketCount || !walletAddress) {
      return new Response(
        JSON.stringify({ error: "buyerId, ticketCount, and walletAddress required" }), 
        { status: 400 }
      )
    }
    
    // Get raffle details
    const raffle = await sql`
      SELECT * FROM raffles WHERE id = ${raffleId}
    `
    
    if (!raffle.length) {
      return new Response(JSON.stringify({ error: "Raffle not found" }), { status: 404 })
    }
    
    const raffleData = raffle[0]
    
    // Check if raffle is still active
    if (raffleData.status !== 'active') {
      return new Response(JSON.stringify({ error: "Raffle is not active" }), { status: 400 })
    }
    
    // Check if raffle has ended
    if (new Date(raffleData.end_date) < new Date()) {
      return new Response(JSON.stringify({ error: "Raffle has ended" }), { status: 400 })
    }
    
    // Check if raffle is full
    const currentTickets = await sql`
      SELECT COALESCE(SUM(ticket_count), 0) as total_sold
      FROM raffle_entries 
      WHERE raffle_id = ${raffleId}
    `
    
    const totalSold = Number(currentTickets[0].total_sold)
    const availableSlots = raffleData.max_raffle_slots - totalSold
    
    if (ticketCount > availableSlots) {
      return new Response(
        JSON.stringify({ 
          error: `Only ${availableSlots} tickets available. You requested ${ticketCount}.` 
        }), 
        { status: 400 }
      )
    }
    
    // Calculate total cost
    const totalCost = ticketCount * Number(raffleData.ticket_price)
    const mockTransactionHash = "raffle_" + Math.random().toString(36).substring(2, 15)
    
    // Create raffle entry with demo-safe implementation
    await sql.transaction(async (tx) => {
      // Insert raffle entry
      await tx`
        INSERT INTO raffle_entries (raffle_id, buyer_id, ticket_count, amount_paid, transaction_hash)
        VALUES (${raffleId}, ${buyerId}, ${ticketCount}, ${totalCost}, ${mockTransactionHash})
      `
      
      // Update total tickets in raffle
      await tx`
        UPDATE raffles 
        SET total_tickets = total_tickets + ${ticketCount},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${raffleId}
      `
    })
    
    // Get updated raffle stats
    const updatedRaffle = await sql`
      SELECT r.*, 
             (SELECT SUM(ticket_count) FROM raffle_entries WHERE raffle_id = r.id) as total_tickets_sold,
             (SELECT COUNT(DISTINCT buyer_id) FROM raffle_entries WHERE raffle_id = r.id) as unique_participants
      FROM raffles r
      WHERE r.id = ${raffleId}
    `
    
    return Response.json({ 
      success: true,
      entry: {
        raffle_id: raffleId,
        buyer_id: buyerId,
        ticket_count: ticketCount,
        amount_paid: totalCost,
        transaction_hash: mockTransactionHash
      },
      raffle: updatedRaffle[0],
      explorer_url: `https://explorer.solana.com/tx/${mockTransactionHash}?cluster=devnet`,
      message: "Demo raffle entry successful (devnet mode)"
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to enter raffle" }), { status: 500 })
  }
}

import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  await initializeDatabase()
  try {
    const auctionId = params.id
    const { bidderId, bidAmount, walletAddress } = await request.json()
    
    if (!bidderId || !bidAmount || !walletAddress) {
      return new Response(
        JSON.stringify({ error: "bidderId, bidAmount, and walletAddress required" }), 
        { status: 400 }
      )
    }
    
    // Get current auction details
    const auction = await sql`
      SELECT * FROM auctions WHERE id = ${auctionId}
    `
    
    if (!auction.length) {
      return new Response(JSON.stringify({ error: "Auction not found" }), { status: 404 })
    }
    
    const auctionData = auction[0]
    
    // Check if auction is still active
    if (auctionData.status !== 'active') {
      return new Response(JSON.stringify({ error: "Auction is not active" }), { status: 400 })
    }
    
    // Check if auction has ended
    if (new Date(auctionData.end_date) < new Date()) {
      return new Response(JSON.stringify({ error: "Auction has ended" }), { status: 400 })
    }
    
    // Check if bid amount is higher than current price
    if (bidAmount <= auctionData.current_price) {
      return new Response(
        JSON.stringify({ 
          error: `Bid must be higher than current price of ${auctionData.current_price} SOL` 
        }), 
        { status: 400 }
      )
    }
    
    // Create bid record with demo-safe implementation
    const mockTransactionHash = "bid_" + Math.random().toString(36).substring(2, 15)
    
    await sql.transaction(async (tx) => {
      // Insert bid
      await tx`
        INSERT INTO auction_bids (auction_id, bidder_id, bid_amount, transaction_hash)
        VALUES (${auctionId}, ${bidderId}, ${bidAmount}, ${mockTransactionHash})
      `
      
      // Update auction current price and current bidder
      await tx`
        UPDATE auctions 
        SET current_price = ${bidAmount}, 
            current_bidder_id = ${bidderId},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${auctionId}
      `
    })
    
    // Get updated auction with bid count
    const updatedAuction = await sql`
      SELECT a.*, 
             u.username as current_bidder_username,
             (SELECT COUNT(*) FROM auction_bids WHERE auction_id = a.id) as bid_count
      FROM auctions a
      LEFT JOIN users u ON a.current_bidder_id = u.id
      WHERE a.id = ${auctionId}
    `
    
    return Response.json({ 
      success: true,
      bid: {
        auction_id: auctionId,
        bidder_id: bidderId,
        bid_amount: bidAmount,
        transaction_hash: mockTransactionHash
      },
      auction: updatedAuction[0],
      explorer_url: `https://explorer.solana.com/tx/${mockTransactionHash}?cluster=devnet`,
      message: "Demo bid placed successfully (devnet mode)"
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to place bid" }), { status: 500 })
  }
}

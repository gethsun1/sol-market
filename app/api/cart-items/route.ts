import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  await initializeDatabase()
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get("cartId")
    if (!cartId) {
      return new Response(JSON.stringify({ error: "cartId required" }), { status: 400 })
    }
    const rows = await sql`
      SELECT ci.*, p.name, p.price_lamports FROM cart_item ci
      JOIN product p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cartId}
      ORDER BY ci.id DESC
    `
    return Response.json({ items: rows })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to list cart items" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  await initializeDatabase()
  try {
    const { cartId, productId, quantity } = await request.json()
    if (!cartId || !productId || !quantity || quantity <= 0) {
      return new Response(JSON.stringify({ error: "cartId, productId, quantity required" }), { status: 400 })
    }
    const existing = await sql`
      SELECT * FROM cart_item WHERE cart_id = ${cartId} AND product_id = ${productId}
    `
    if (existing.length) {
      const rows = await sql`
        UPDATE cart_item SET quantity = ${quantity}
        WHERE id = ${existing[0].id}
        RETURNING *
      `
      return Response.json({ item: rows[0] })
    }
    const rows = await sql`
      INSERT INTO cart_item (cart_id, product_id, quantity)
      VALUES (${cartId}, ${productId}, ${quantity})
      RETURNING *
    `
    return Response.json({ item: rows[0] })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to add/update cart item" }), { status: 500 })
  }
}





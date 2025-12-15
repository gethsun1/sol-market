import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  await initializeDatabase()
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get("wallet")
    const rows = wallet
      ? await sql`SELECT * FROM orders WHERE client_wallet = ${wallet} ORDER BY id DESC`
      : await sql`SELECT * FROM orders ORDER BY id DESC`
    return Response.json({ orders: rows })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to list orders" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  await initializeDatabase()
  try {
    const { cartId, clientWallet } = await request.json()
    if (!cartId || !clientWallet) {
      return new Response(JSON.stringify({ error: "cartId, clientWallet required" }), { status: 400 })
    }
    // Gather cart items with product + current discount
    const items = await sql`
      SELECT ci.product_id, ci.quantity, p.merchant_id, p.price_lamports,
        COALESCE((
          SELECT percent FROM discount d
          WHERE d.product_id = p.id
            AND (d.starts_at IS NULL OR d.starts_at <= NOW())
            AND (d.ends_at IS NULL OR d.ends_at >= NOW())
          ORDER BY percent DESC LIMIT 1
        ), 0) AS discount_percent
      FROM cart_item ci
      JOIN product p ON p.id = ci.product_id
      WHERE ci.cart_id = ${cartId}
    `
    if (!items.length) {
      return new Response(JSON.stringify({ error: "Cart is empty" }), { status: 400 })
    }
    // Ensure single merchant per order (simplification)
    const mIds = Array.from(new Set(items.map((i: any) => Number(i.merchant_id))))
    if (mIds.length !== 1) {
      return new Response(JSON.stringify({ error: "Cart contains multiple merchants; split cart first" }), {
        status: 400,
      })
    }
    const merchantId = mIds[0]
    const total = items.reduce((sum: number, i: any) => {
      const price = Number(i.price_lamports)
      const q = Number(i.quantity)
      const disc = Number(i.discount_percent) / 100
      return sum + Math.floor(price * (1 - disc)) * q
    }, 0)
    const orderRows = await sql`
      INSERT INTO orders (cart_id, merchant_id, client_wallet, total_lamports)
      VALUES (${cartId}, ${merchantId}, ${clientWallet}, ${total})
      RETURNING *
    `
    const order = orderRows[0]
    // Store order item snapshots
    for (const i of items) {
      await sql`
        INSERT INTO order_item (order_id, product_id, quantity, price_lamports)
        VALUES (${order.id}, ${i.product_id}, ${i.quantity}, ${i.price_lamports})
      `
    }
    // Mark cart as closed
    await sql`UPDATE cart SET status = 'closed' WHERE id = ${cartId}`
    return Response.json({ order })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to create order" }), { status: 500 })
  }
}





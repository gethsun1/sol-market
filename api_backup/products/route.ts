import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  await initializeDatabase()
  try {
    const { searchParams } = new URL(request.url)
    const merchantId = searchParams.get("merchantId")
    const rows = merchantId
      ? await sql(`
          SELECT p.*,
            COALESCE((
              SELECT percent FROM discount d
              WHERE d.product_id = p.id
                AND (d.starts_at IS NULL OR d.starts_at <= NOW())
                AND (d.ends_at IS NULL OR d.ends_at >= NOW())
              ORDER BY percent DESC LIMIT 1
            ), 0) AS discount_percent
          FROM product p
          WHERE p.merchant_id = ${merchantId}
          ORDER BY p.id DESC
        `)
      : await sql(`
          SELECT p.*,
            COALESCE((
              SELECT percent FROM discount d
              WHERE d.product_id = p.id
                AND (d.starts_at IS NULL OR d.starts_at <= NOW())
                AND (d.ends_at IS NULL OR d.ends_at >= NOW())
              ORDER BY percent DESC LIMIT 1
            ), 0) AS discount_percent
          FROM product p
          ORDER BY p.id DESC
        `)
    return Response.json({ products: rows })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to list products" }), { status: 500 })
  }
}

export async function POST(request: Request) {
  await initializeDatabase()
  try {
    const { merchantId, name, description, category, priceLamports } = await request.json()
    if (!merchantId || !name || typeof priceLamports !== "number") {
      return new Response(JSON.stringify({ error: "merchantId, name, priceLamports required" }), { status: 400 })
    }
    const rows = await sql`
      INSERT INTO product (merchant_id, name, description, category, price_lamports)
      VALUES (${merchantId}, ${name}, ${description ?? null}, ${category ?? null}, ${priceLamports})
      RETURNING *
    `
    return Response.json({ product: rows[0] })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to create product" }), { status: 500 })
  }
}





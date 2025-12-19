import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  await initializeDatabase()
  try {
    const { searchParams } = new URL(request.url)
    const wallet = searchParams.get("wallet")
    if (!wallet) {
      return new Response(JSON.stringify({ error: "wallet required" }), { status: 400 })
    }
    const open = await sql`SELECT * FROM cart WHERE client_wallet = ${wallet} AND status = 'open' ORDER BY id DESC LIMIT 1`
    if (open.length) {
      return Response.json({ cart: open[0] })
    }
    const created = await sql`INSERT INTO cart (client_wallet) VALUES (${wallet}) RETURNING *`
    return Response.json({ cart: created[0] })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to get/create cart" }), { status: 500 })
  }
}





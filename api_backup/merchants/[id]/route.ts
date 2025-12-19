import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  await initializeDatabase()
  try {
    const id = Number(params.id)
    const rows = await sql`SELECT * FROM merchant WHERE id = ${id}`
    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Merchant not found" }), { status: 404 })
    }
    return Response.json({ merchant: rows[0] })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to get merchant" }), { status: 500 })
  }
}





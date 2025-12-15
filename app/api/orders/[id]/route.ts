import { initializeDatabase, sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  await initializeDatabase()
  try {
    const id = Number(params.id)
    const body = await request.json()
    const { status, escrowAccount, paymentTx } = body as {
      status?: string
      escrowAccount?: string
      paymentTx?: string
    }
    const rows = await sql`
      UPDATE orders
      SET
        status = COALESCE(${status}, status),
        escrow_account = COALESCE(${escrowAccount}, escrow_account),
        payment_tx = COALESCE(${paymentTx}, payment_tx)
      WHERE id = ${id}
      RETURNING *
    `
    if (!rows.length) {
      return new Response(JSON.stringify({ error: "Order not found" }), { status: 404 })
    }
    return Response.json({ order: rows[0] })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message ?? "Failed to update order" }), { status: 500 })
  }
}





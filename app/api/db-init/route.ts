import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase } from "@/lib/db"
import { sql } from "@/lib/db"

export const dynamic = 'force-dynamic'

// This endpoint initializes the database - CALL IT ONCE THEN DELETE IT FOR SECURITY
export async function GET(request: NextRequest) {
    try {
        console.log('Initializing database...')

        // Step 1: Initialize schema
        await initializeDatabase()

        // Step 2: Create default user
        const defaultUserId = '550e8400-e29b-41d4-a716-446655440000'

        const existing = await sql`
      SELECT id FROM users WHERE id = ${defaultUserId}
    `

        if (existing.length === 0) {
            await sql`
        INSERT INTO users (id, wallet_address, username, email, bio)
        VALUES (
          ${defaultUserId},
          'BGYQyZsXwJeUgBfduGSmMJ3ouVaeii47wuw88qN8tgsE',
          'platform_admin',
          'admin@solmarket.dev',
          'Platform default user for marketplace listings'
        )
      `
        }

        return NextResponse.json({
            success: true,
            message: 'Database initialized successfully!',
            note: 'You should delete this API endpoint for security'
        }, { status: 200 })

    } catch (error: any) {
        console.error('Database initialization error:', error)
        return NextResponse.json(
            {
                error: error.message,
                details: error.toString()
            },
            { status: 500 }
        )
    }
}

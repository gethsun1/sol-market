#!/bin/bash

###############################################################################
# API Health Check Endpoint
# Add this to your backend to enable health monitoring
###############################################################################

# Create this file: app/api/health/route.ts

cat > app/api/health/route.ts << 'TYPESCRIPT_CODE'
import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'

/**
 * Health check endpoint
 * Returns system status and connectivity checks
 */
export async function GET() {
  const checks: Record<string, any> = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  }

  // Check database connectivity
  try {
    await sql`SELECT 1`
    checks.database = 'connected'
  } catch (error) {
    checks.database = 'disconnected'
    checks.status = 'unhealthy'
    checks.error = error instanceof Error ? error.message : 'Unknown database error'
  }

  // Check if running in cluster mode
  checks.pid = process.pid

  // Memory usage
  const memUsage = process.memoryUsage()
  checks.memory = {
    rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
    heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
  }

  // Uptime
  checks.uptime = `${Math.round(process.uptime())} seconds`

  const statusCode = checks.status === 'healthy' ? 200 : 503

  return NextResponse.json(checks, { status: statusCode })
}
TYPESCRIPT_CODE

echo "✓ Health check endpoint created at: app/api/health/route.ts"
echo ""
echo "Test it with:"
echo "  curl http://localhost:3000/api/health"
echo "  curl https://api.makenadao.com/api/health"



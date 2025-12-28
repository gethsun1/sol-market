/**
 * CORS Configuration for API Routes
 * 
 * Add this to all API routes on the VPS to allow requests from cPanel frontend
 */

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://makenadao.com',
  'https://www.makenadao.com',
  'http://localhost:3000', // For local development
  'http://localhost:3001',
]

/**
 * CORS headers to be added to all API responses
 */
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Will be overridden by withCors
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400', // 24 hours
  'Access-Control-Allow-Credentials': 'true',
}

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false
  return ALLOWED_ORIGINS.includes(origin)
}

/**
 * Get appropriate CORS origin header value
 */
function getCorsOrigin(origin: string | null): string {
  if (origin && isOriginAllowed(origin)) {
    return origin
  }
  // Default to first allowed origin
  return ALLOWED_ORIGINS[0]
}

/**
 * Add CORS headers to a Response
 * 
 * Usage in API routes:
 * ```typescript
 * import { withCors } from '@/lib/cors'
 * 
 * export async function GET(request: Request) {
 *   const data = { message: 'Hello' }
 *   return withCors(request, Response.json(data))
 * }
 * ```
 */
export function withCors(request: Request, response: Response): Response {
  const origin = request.headers.get('origin')
  const corsOrigin = getCorsOrigin(origin)

  // Clone response to add headers
  const newResponse = new Response(response.body, response)
  
  newResponse.headers.set('Access-Control-Allow-Origin', corsOrigin)
  newResponse.headers.set('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods'])
  newResponse.headers.set('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers'])
  newResponse.headers.set('Access-Control-Max-Age', corsHeaders['Access-Control-Max-Age'])
  newResponse.headers.set('Access-Control-Allow-Credentials', corsHeaders['Access-Control-Allow-Credentials'])

  return newResponse
}

/**
 * Handle OPTIONS preflight request
 * 
 * Usage in API routes:
 * ```typescript
 * import { handleCorsOptions } from '@/lib/cors'
 * 
 * export async function OPTIONS(request: Request) {
 *   return handleCorsOptions(request)
 * }
 * ```
 */
export function handleCorsOptions(request: Request): Response {
  const origin = request.headers.get('origin')
  const corsOrigin = getCorsOrigin(origin)

  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': corsHeaders['Access-Control-Allow-Methods'],
      'Access-Control-Allow-Headers': corsHeaders['Access-Control-Allow-Headers'],
      'Access-Control-Max-Age': corsHeaders['Access-Control-Max-Age'],
      'Access-Control-Allow-Credentials': corsHeaders['Access-Control-Allow-Credentials'],
    },
  })
}

/**
 * Middleware-style CORS wrapper for API route handlers
 * 
 * Usage:
 * ```typescript
 * import { corsMiddleware } from '@/lib/cors'
 * 
 * async function handler(request: Request) {
 *   return Response.json({ data: 'example' })
 * }
 * 
 * export const GET = corsMiddleware(handler)
 * ```
 */
export function corsMiddleware(
  handler: (request: Request, context?: any) => Promise<Response>
) {
  return async (request: Request, context?: any): Promise<Response> => {
    // Handle preflight
    if (request.method === 'OPTIONS') {
      return handleCorsOptions(request)
    }

    // Execute handler and add CORS headers
    const response = await handler(request, context)
    return withCors(request, response)
  }
}

/**
 * Add to environment configuration
 */
export function getAllowedOrigins(): string[] {
  return ALLOWED_ORIGINS
}

/**
 * For debugging - log CORS configuration
 */
export function logCorsConfig() {
  console.log('CORS Configuration:')
  console.log('Allowed Origins:', ALLOWED_ORIGINS)
  console.log('Headers:', corsHeaders)
}



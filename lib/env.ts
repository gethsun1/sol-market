// Environment variable validation for Vercel serverless deployment
interface EnvVars {
  // Database
  DATABASE_URL: string

  // NextAuth
  NEXTAUTH_SECRET: string
  NEXTAUTH_URL: string

  // Google OAuth
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string

  // Solana
  NEXT_PUBLIC_SOLANA_CLUSTER: string
  NEXT_PUBLIC_RPC_URL: string
  NEXT_PUBLIC_ESCROW_EXPIRY_SECS: string

  // Optional
  NEXT_PUBLIC_APP_URL?: string
}

// Validate required environment variables at boot
export function validateEnv(): EnvVars {
  const required = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_SOLANA_CLUSTER',
    'NEXT_PUBLIC_RPC_URL',
    'NEXT_PUBLIC_ESCROW_EXPIRY_SECS'
  ]

  const missing = required.filter(key => !process.env[key])
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n\n` +
      `Please configure these in your Vercel dashboard under Settings > Environment Variables.\n` +
      `For local development, create a .env.local file with these values.`
    )
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
    NEXT_PUBLIC_SOLANA_CLUSTER: process.env.NEXT_PUBLIC_SOLANA_CLUSTER!,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL!,
    NEXT_PUBLIC_ESCROW_EXPIRY_SECS: process.env.NEXT_PUBLIC_ESCROW_EXPIRY_SECS!,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL
  }
}

// Export validated environment variables
export const env = validateEnv()

// Helper to get app URL with fallback
export function getAppUrl(): string {
  return env.NEXT_PUBLIC_APP_URL || env.NEXTAUTH_URL || 'http://localhost:3000'
}

import path from 'path'
import { fileURLToPath } from 'url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Enable serverless functions for Vercel
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  webpack: (config) => {
    // __dirname is not defined in ESM, compute it here
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Stub optional dependency required by @wagmi/connectors in some environments.
      'porto/internal': path.resolve(__dirname, 'shims/porto-internal.js'),
      'porto': path.resolve(__dirname, 'shims/porto.js'),
    }
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
}

export default nextConfig



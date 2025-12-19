"use client"

import { ReactNode } from "react"
import { createAppKit } from "@reown/appkit"

// AppKit social login only (no EVM connectors). Solana escrow remains separate.
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ""

const metadata = {
  name: "Makena E-commerce",
  description: "Solana marketplace with social login",
  url: typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  icons: ["/icon.svg"],
}

// Ensure AppKit is initialized before any hook usage.
declare global {
  // eslint-disable-next-line no-var
  var __appkit_inited: boolean | undefined
}
if (typeof window !== "undefined" && !globalThis.__appkit_inited) {
  createAppKit({
    projectId,
    metadata,
    features: {
      email: true,
      social: ["google"],
    },
  })
  globalThis.__appkit_inited = true
}

export function AppKitProviders({ children }: { children: ReactNode }) {
  return <>{children}</>
}



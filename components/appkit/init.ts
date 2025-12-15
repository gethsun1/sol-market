"use client"

import { createAppKit } from "@reown/appkit"

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ""

const metadata = {
  name: "SolMarket",
  description: "Solana marketplace with social login",
  url: typeof window !== "undefined" 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000",
  icons: ["/icon.svg"],
}

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





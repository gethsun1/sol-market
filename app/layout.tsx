import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { AuthProviders } from "@/components/auth/providers"
import { SolanaProvider } from "@/components/solana/solana-provider"
import { ThemeProvider } from "@/components/theme-provider"
// Validate environment variables at startup
import "@/lib/env"

export const metadata: Metadata = {
  title: "Makena E-commerce - Decentralized Marketplace",
  description: "Buy and sell merchandise securely using Solana tokens on Makena E-commerce",
  generator: "v0.app",
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`bg-background text-foreground ${GeistSans.variable} ${GeistMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProviders>
            <SolanaProvider>{children}</SolanaProvider>
          </AuthProviders>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

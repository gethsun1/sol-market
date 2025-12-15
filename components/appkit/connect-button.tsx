"use client"

import "@/components/appkit/init"
import { useAppKit } from "@reown/appkit/react"
import { Button } from "@/components/ui/button"

export function AppKitConnectButton() {
  const { open } = useAppKit()
  return (
    <Button onClick={() => open()} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0">
      Connect / Sign in with Google
    </Button>
  )
}



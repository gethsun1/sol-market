"use client"

import { useCallback, useMemo } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "./custom-wallet-modal-provider"
import type { Wallet } from "@solana/wallet-adapter-base"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Valid Solana wallet names - only show these
const VALID_SOLANA_WALLETS = ["Phantom", "Solflare", "Backpack", "Glow", "Sollet"]

export function CustomWalletModal() {
  const { wallets, select, connect, connecting, connected, disconnect } = useWallet()
  const { visible, setVisible } = useWalletModal()

  // Filter wallets to only show valid Solana wallets and ensure unique keys
  const filteredWallets = useMemo(() => {
    const seen = new Set<string>()
    const filtered = wallets.filter((wallet: Wallet) => {
      const name = wallet.adapter.name
      // Only include valid Solana wallets
      if (!VALID_SOLANA_WALLETS.includes(name)) {
        return false
      }
      // Ensure unique names (no duplicates)
      if (seen.has(name)) {
        return false
      }
      seen.add(name)
      return true
    })
    // Debug: log available wallets
    if (filtered.length > 0) {
      console.log("Available Solana wallets:", filtered.map((w) => w.adapter.name))
    }
    return filtered
  }, [wallets])

  const handleWalletClick = useCallback(
    async (walletName: string) => {
      try {
        // Select the wallet first
        select(walletName)
        // Small delay to ensure wallet is selected
        await new Promise((resolve) => setTimeout(resolve, 50))
        // Connect to the selected wallet
        await connect()
        // Close modal after successful connection
        setVisible(false)
      } catch (error: any) {
        console.error("Error connecting wallet:", error)
        // Show error to user (you could add a toast here)
        alert(error?.message || "Failed to connect wallet. Please try again.")
        // Keep modal open on error so user can try again
      }
    },
    [select, connect, setVisible]
  )

  const handleDisconnect = useCallback(() => {
    disconnect()
    setVisible(false)
  }, [disconnect, setVisible])

  return (
    <Dialog open={visible} onOpenChange={setVisible}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Select a Solana wallet to connect to your account
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {filteredWallets.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No Solana wallets detected. Please install Phantom or Solflare.
            </p>
          ) : (
            filteredWallets.map((wallet: Wallet) => {
              const name = wallet.adapter.name
              const icon = wallet.adapter.icon
              const ready = wallet.readyState === "Installed" || wallet.readyState === "Loadable"

              return (
                <Button
                  key={name}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleWalletClick(name)}
                  disabled={!ready || connecting}
                >
                  <div className="flex items-center gap-3 w-full">
                    {icon && (
                      <img
                        src={icon}
                        alt={`${name} icon`}
                        className="w-6 h-6"
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                        }}
                      />
                    )}
                    <div className="flex-1 text-left">
                      <div className="font-medium">{name}</div>
                      {!ready && (
                        <div className="text-xs text-muted-foreground">
                          Not installed
                        </div>
                      )}
                    </div>
                    {connecting && wallet.adapter.name === name && (
                      <div className="text-xs text-muted-foreground">Connecting...</div>
                    )}
                  </div>
                </Button>
              )
            })
          )}
          {connected && (
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}


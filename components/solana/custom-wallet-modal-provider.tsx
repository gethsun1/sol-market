"use client"

import { ReactNode, createContext, useContext, useState, useCallback } from "react"
import { CustomWalletModal } from "./custom-wallet-modal"

interface WalletModalContextState {
  visible: boolean
  setVisible: (open: boolean) => void
}

const WalletModalContext = createContext<WalletModalContextState>({
  visible: false,
  setVisible: () => {},
})

export function useWalletModal(): WalletModalContextState {
  return useContext(WalletModalContext)
}

export function CustomWalletModalProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false)

  return (
    <WalletModalContext.Provider value={{ visible, setVisible }}>
      <CustomWalletModal />
      {children}
    </WalletModalContext.Provider>
  )
}





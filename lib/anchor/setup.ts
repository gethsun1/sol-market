import { Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import type { Solmarket } from "./types/solmarket";
import type { Escrow } from "./types/escrow";
import SolmarketIDL from "./idl/solmarket.json";
import EscrowIDL from "./idl/escrow.json";

// Re-export types
export type { Solmarket, Escrow };

// Program IDs (These should match what's in your Anchor.toml or deployed IDs)
// Using the ones found in the IDL or defaulting to a known placeholder if missing
export const SOLMARKET_PROGRAM_ID = new PublicKey(SolmarketIDL.address);
export const ESCROW_PROGRAM_ID = new PublicKey(EscrowIDL.address);

// Mock Wallet for read-only view
export const mockWallet = {
  publicKey: PublicKey.default,
  signTransaction: () => Promise.reject(new Error("Mock wallet cannot sign")),
  signAllTransactions: () => Promise.reject(new Error("Mock wallet cannot sign")),
};

export const getSolmarketProgram = (connection: Connection, wallet: any = mockWallet) => {
  const provider = { connection, wallet };
  return new Program<Solmarket>(SolmarketIDL as Solmarket, provider);
};

export const getEscrowProgram = (connection: Connection, wallet: any = mockWallet) => {
  const provider = { connection, wallet };
  return new Program<Escrow>(EscrowIDL as Escrow, provider);
};

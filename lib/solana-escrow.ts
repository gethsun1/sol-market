import { Connection, PublicKey, Keypair, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { 
  Program, 
  AnchorProvider, 
  Wallet, 
  BN 
} from "@coral-xyz/anchor"
import { clusterApiUrl } from "@solana/web3.js"

// Escrow program ID for devnet (will be updated after deployment)
const ESCROW_PROGRAM_ID = new PublicKey("8jR5GeNzeweq35Uo84kGP3v1NcBaZWH5u62k7PxN4T2y")

// Mock IDL for demo - in production this would be generated from the deployed program
const ESCROW_IDL = {
  version: "0.1.0",
  name: "escrow",
  address: ESCROW_PROGRAM_ID.toString(),
  instructions: [
    {
      name: "initializeEscrow",
      accounts: [
        { name: "escrow", isMut: true, isSigner: true },
        { name: "buyer", isMut: true, isSigner: true },
        { name: "seller", isMut: false, isSigner: false },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: [
        { name: "orderId", type: "u64" },
        { name: "amountLamports", type: "u64" },
        { name: "expiresAt", type: "i64" }
      ]
    },
    {
      name: "fundEscrow",
      accounts: [
        { name: "escrow", isMut: true, isSigner: false },
        { name: "buyer", isMut: true, isSigner: true },
        { name: "systemProgram", isMut: false, isSigner: false }
      ],
      args: []
    },
    {
      name: "releaseEscrow",
      accounts: [
        { name: "escrow", isMut: true, isSigner: false },
        { name: "seller", isMut: true, isSigner: true },
        { name: "buyer", isMut: true, isSigner: false }
      ],
      args: []
    },
    {
      name: "refundEscrow",
      accounts: [
        { name: "escrow", isMut: true, isSigner: false },
        { name: "buyer", isMut: true, isSigner: true },
        { name: "seller", isMut: true, isSigner: false }
      ],
      args: []
    }
  ]
}

export interface EscrowAccount {
  orderId: BN
  buyer: PublicKey
  seller: PublicKey
  amountLamports: BN
  fundedAt: BN
  expiresAt: BN
  status: "pending" | "funded" | "released" | "refunded" | "expired"
}

export class SolanaEscrowService {
  private connection: Connection
  private program: Program<any>

  constructor(wallet: Wallet) {
    this.connection = new Connection(clusterApiUrl("devnet"), "confirmed")
    const provider = new AnchorProvider(this.connection, wallet, {
      commitment: "confirmed"
    })
    this.program = new Program(ESCROW_IDL as any, ESCROW_PROGRAM_ID, provider)
  }

  /**
   * Create a new escrow account for demo purposes
   * In production, this would call the actual smart contract
   */
  async createEscrow(
    orderId: number,
    amountLamports: number,
    sellerPubkey: string,
    expiresInSeconds: number = 259200 // 3 days default
  ): Promise<{ escrowAddress: string; transactionHash: string }> {
    try {
      const seller = new PublicKey(sellerPubkey)
      const expiresAt = new BN(Date.now() / 1000 + expiresInSeconds)
      
      // Generate escrow account keypair
      const escrowKeypair = Keypair.generate()
      
      // For demo: simulate the transaction without actual blockchain interaction
      // In production, this would be:
      // const tx = await this.program.methods
      //   .initializeEscrow(new BN(orderId), new BN(amountLamports), expiresAt)
      //   .accounts({
      //     escrow: escrowKeypair.publicKey,
      //     buyer: this.program.provider.publicKey,
      //     seller: seller,
      //     systemProgram: SystemProgram.programId
      //   })
      //   .signers([escrowKeypair])
      //   .rpc()

      // Mock transaction hash for demo
      const mockTransactionHash = "demo_" + Math.random().toString(36).substring(2, 15)
      
      console.log(`Demo: Created escrow account ${escrowKeypair.publicKey.toString()} for order ${orderId}`)
      
      return {
        escrowAddress: escrowKeypair.publicKey.toString(),
        transactionHash: mockTransactionHash
      }
    } catch (error) {
      console.error("Create escrow error:", error)
      throw new Error(`Failed to create escrow: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Fund an existing escrow account
   */
  async fundEscrow(escrowAddress: string, amountLamports: number): Promise<string> {
    try {
      const escrowPubkey = new PublicKey(escrowAddress)
      
      // For demo: simulate funding
      // In production:
      // const tx = await this.program.methods
      //   .fundEscrow()
      //   .accounts({
      //     escrow: escrowPubkey,
      //     buyer: this.program.provider.publicKey,
      //     systemProgram: SystemProgram.programId
      //   })
      //   .rpc()

      const mockTransactionHash = "fund_" + Math.random().toString(36).substring(2, 15)
      
      console.log(`Demo: Funded escrow ${escrowAddress} with ${amountLamports / LAMPORTS_PER_SOL} SOL`)
      
      return mockTransactionHash
    } catch (error) {
      console.error("Fund escrow error:", error)
      throw new Error(`Failed to fund escrow: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Release funds from escrow to seller
   */
  async releaseEscrow(escrowAddress: string): Promise<string> {
    try {
      const escrowPubkey = new PublicKey(escrowAddress)
      
      // For demo: simulate release
      // In production:
      // const tx = await this.program.methods
      //   .releaseEscrow()
      //   .accounts({
      //     escrow: escrowPubkey,
      //     seller: this.program.provider.publicKey,
      //     buyer: buyerPubkey // Need to fetch from escrow account
      //   })
      //   .rpc()

      const mockTransactionHash = "release_" + Math.random().toString(36).substring(2, 15)
      
      console.log(`Demo: Released funds from escrow ${escrowAddress}`)
      
      return mockTransactionHash
    } catch (error) {
      console.error("Release escrow error:", error)
      throw new Error(`Failed to release escrow: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Refund funds from escrow to buyer
   */
  async refundEscrow(escrowAddress: string): Promise<string> {
    try {
      const escrowPubkey = new PublicKey(escrowAddress)
      
      // For demo: simulate refund
      const mockTransactionHash = "refund_" + Math.random().toString(36).substring(2, 15)
      
      console.log(`Demo: Refunded escrow ${escrowAddress}`)
      
      return mockTransactionHash
    } catch (error) {
      console.error("Refund escrow error:", error)
      throw new Error(`Failed to refund escrow: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  /**
   * Get transaction URL on Solana explorer
   */
  getExplorerUrl(transactionHash: string): string {
    return `https://explorer.solana.com/tx/${transactionHash}?cluster=devnet`
  }

  /**
   * Get account URL on Solana explorer
   */
  getAccountUrl(accountAddress: string): string {
    return `https://explorer.solana.com/account/${accountAddress}?cluster=devnet`
  }
}

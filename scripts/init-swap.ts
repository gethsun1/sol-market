
import * as anchor from "@coral-xyz/anchor";
import {
    PublicKey,
    Keypair,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
    Transaction,
    TransactionInstruction
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    createInitializeAccountInstruction
} from "@solana/spl-token";
import { readFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';
import { createHash } from 'crypto';

async function main() {
    const RPC_URL = "https://api.devnet.solana.com";
    const connection = new anchor.web3.Connection(RPC_URL, "confirmed");

    const walletPath = path.join(homedir(), '.config/solana/id.json');
    const walletFile = JSON.parse(readFileSync(walletPath, 'utf-8'));
    const secretKey = new Uint8Array(walletFile);
    const keypair = Keypair.fromSecretKey(secretKey);

    console.log("Using Wallet:", keypair.publicKey.toBase58());

    const programId = new PublicKey("BLyc8iNGvz1mYRWGZdRku1fAQdhKLpMatX4DKf2FREPt");
    const mknMint = new PublicKey("9CMv5nbwi48J9haJywdgpUhf8HRN7p4FRkrhzRc9Sfuw");

    // 1. Derive Vault PDA
    const [vaultPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("mkn_vault")],
        programId
    );
    console.log("Vault PDA:", vaultPda.toBase58());

    // 2. Derive Vault Token Account PDA
    const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
        [Buffer.from("mkn_vault_token")],
        programId
    );
    console.log("Vault Token Account:", vaultTokenAccount.toBase58());

    // 3. Instruction Discriminator for "initialize_vault"
    // Anchor discriminator = first 8 bytes of sha256("global:initialize_vault")
    const discriminator = createHash("sha256").update("global:initialize_vault").digest().slice(0, 8);

    const ix = new TransactionInstruction({
        programId,
        keys: [
            { pubkey: keypair.publicKey, isSigner: true, isWritable: true },
            { pubkey: vaultPda, isSigner: false, isWritable: true },
            { pubkey: mknMint, isSigner: false, isWritable: false },
            { pubkey: vaultTokenAccount, isSigner: false, isWritable: true },
            { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
            { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
            { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        ],
        data: discriminator
    });

    const tx = new Transaction().add(ix);
    tx.feePayer = keypair.publicKey;

    const signature = await connection.sendTransaction(tx, [keypair]);
    console.log("🚀 Sending transaction...");

    await connection.confirmTransaction(signature, "confirmed");
    console.log("✅ Swap Vault initialized successfully!");
    console.log("Signature:", signature);
}

main().catch(console.error);

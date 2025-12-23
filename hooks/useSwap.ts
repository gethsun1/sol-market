
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import { Program, Idl, AnchorProvider, BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { SWAP_PROGRAM_ID, MKN_TOKEN_MINT } from "@/lib/constants";
import { toast } from "sonner";
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction
} from "@solana/spl-token";

const IDL: Idl = {
    "version": "0.1.0",
    "name": "swap",
    "instructions": [
        {
            "name": "swapSolToMkn",
            "accounts": [
                { "name": "user", "writable": true, "signer": true },
                { "name": "vaultPda", "writable": true, "signer": false },
                { "name": "vaultTokenAccount", "writable": true, "signer": false },
                { "name": "userTokenAccount", "writable": true, "signer": false },
                { "name": "mknMint", "writable": false, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false },
                { "name": "systemProgram", "writable": false, "signer": false }
            ],
            "args": [
                { "name": "solAmountLamports", "type": "u64" }
            ]
        },
        {
            "name": "swapMknToSol",
            "accounts": [
                { "name": "user", "writable": true, "signer": true },
                { "name": "vaultPda", "writable": true, "signer": false },
                { "name": "vaultTokenAccount", "writable": true, "signer": false },
                { "name": "userTokenAccount", "writable": true, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false },
                { "name": "systemProgram", "writable": false, "signer": false }
            ],
            "args": [
                { "name": "mknAmountUnits", "type": "u64" }
            ]
        }
    ],
    "accounts": [
        {
            "name": "VaultState",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "bump", "type": "u8" }
                ]
            }
        }
    ]
};

export function useSwap() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(false);

    const getProgram = useCallback(() => {
        if (!wallet) return null;
        const provider = new AnchorProvider(connection, wallet, {});
        return new Program(IDL as any, SWAP_PROGRAM_ID, provider);
    }, [connection, wallet]);

    const swapSolToMkn = async (solAmount: number) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);

            // Validate input amount
            if (!solAmount || isNaN(solAmount) || solAmount <= 0) {
                toast.error("Invalid swap amount");
                return;
            }

            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("mkn_vault")],
                program.programId
            );

            const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from("mkn_vault_token")],
                program.programId
            );

            const userTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, wallet.publicKey);

            // Check if user token account exists, if not create it
            const info = await connection.getAccountInfo(userTokenAccount);
            const preInstructions = [];
            if (!info) {
                preInstructions.push(
                    createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        userTokenAccount,
                        wallet.publicKey,
                        MKN_TOKEN_MINT
                    )
                );
            }

            // Convert to lamports and ensure it's an integer
            const lamports = Math.floor(solAmount * 1e9);

            const tx = await program.methods
                .swapSolToMkn(new BN(lamports))
                .accounts({
                    user: wallet.publicKey,
                    vaultPda: vaultPda,
                    vaultTokenAccount: vaultTokenAccount,
                    userTokenAccount: userTokenAccount,
                    mknMint: MKN_TOKEN_MINT,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .preInstructions(preInstructions)
                .rpc();

            toast.success("Swap successful! You received MKN tokens.");
            return tx;
        } catch (e: any) {
            console.error(e);
            toast.error(`Swap failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    const swapMknToSol = async (mknAmount: number) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);

            // Validate input amount
            if (!mknAmount || isNaN(mknAmount) || mknAmount <= 0) {
                toast.error("Invalid swap amount");
                return;
            }

            const [vaultPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("mkn_vault")],
                program.programId
            );

            const [vaultTokenAccount] = PublicKey.findProgramAddressSync(
                [Buffer.from("mkn_vault_token")],
                program.programId
            );

            const userTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, wallet.publicKey);

            // Convert to smallest unit and ensure it's an integer (MKN has 6 decimals)
            const mknUnits = Math.floor(mknAmount * 1e6);

            const tx = await program.methods
                .swapMknToSol(new BN(mknUnits))
                .accounts({
                    user: wallet.publicKey,
                    vaultPda: vaultPda,
                    vaultTokenAccount: vaultTokenAccount,
                    userTokenAccount: userTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            toast.success("Swap successful! You received SOL.");
            return tx;
        } catch (e: any) {
            console.error(e);
            toast.error(`Swap failed: ${e.message}`);
        } finally {
            setLoading(false);
        }
    };

    return { swapSolToMkn, swapMknToSol, loading };
}

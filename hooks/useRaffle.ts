
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import { Program, Idl, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { RAFFLE_PROGRAM_ID, MKN_TOKEN_MINT } from "@/lib/constants";
import { toast } from "sonner";
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress
} from "@solana/spl-token";

const IDL: Idl = {
    "version": "0.1.0",
    "name": "raffle",
    "instructions": [
        {
            "name": "initializeRaffle",
            "accounts": [
                { "name": "payer", "writable": true, "signer": true },
                { "name": "mknMint", "writable": false, "signer": false },
                { "name": "raffle", "writable": true, "signer": false },
                { "name": "raffleVault", "writable": true, "signer": false },
                { "name": "merchant", "writable": false, "signer": false },
                { "name": "systemProgram", "writable": false, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false },
                { "name": "rent", "writable": false, "signer": false }
            ],
            "args": [
                { "name": "category", "type": "u8" },
                { "name": "endTimeUnix", "type": "i64" },
                { "name": "ticketPriceMkn", "type": "u64" }
            ]
        },
        {
            "name": "buyTicket",
            "accounts": [
                { "name": "buyer", "writable": true, "signer": true },
                { "name": "raffle", "writable": true, "signer": false },
                { "name": "raffleVault", "writable": true, "signer": false },
                { "name": "buyerTokenAccount", "writable": true, "signer": false },
                { "name": "ticket", "writable": true, "signer": false },
                { "name": "systemProgram", "writable": false, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false }
            ],
            "args": []
        },
        {
            "name": "pickWinner",
            "accounts": [
                { "name": "authority", "writable": true, "signer": true },
                { "name": "raffle", "writable": true, "signer": false }
            ],
            "args": []
        },
        {
            "name": "claimPrize",
            "accounts": [
                { "name": "winner", "writable": true, "signer": true },
                { "name": "raffle", "writable": true, "signer": false },
                { "name": "raffleVault", "writable": true, "signer": false },
                { "name": "merchantTokenAccount", "writable": true, "signer": false },
                { "name": "ticket", "writable": true, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "Raffle",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "merchant", "type": "pubkey" },
                    { "name": "mknMint", "type": "pubkey" },
                    { "name": "category", "type": "u8" },
                    { "name": "endTimeUnix", "type": "i64" },
                    { "name": "ticketPriceMkn", "type": "u64" },
                    { "name": "ticketsSold", "type": "u64" },
                    { "name": "winningTicketIndex", "type": { "option": "u64" } },
                    { "name": "bump", "type": "u8" }
                ]
            }
        },
        {
            "name": "Ticket",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "raffle", "type": "pubkey" },
                    { "name": "owner", "type": "pubkey" },
                    { "name": "index", "type": "u64" },
                    { "name": "bump", "type": "u8" }
                ]
            }
        }
    ]
};

export function useRaffle() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(false);

    const getProgram = useCallback(() => {
        if (!wallet) return null;
        const provider = new AnchorProvider(connection, wallet, {});
        return new Program(IDL, RAFFLE_PROGRAM_ID, provider);
    }, [connection, wallet]);

    const initializeRaffle = async (merchant: PublicKey, category: number, endTimeUnix: number, ticketPriceMkn: number) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            const [rafflePda] = PublicKey.findProgramAddressSync(
                [Buffer.from("raffle"), merchant.toBuffer()],
                program.programId
            );

            const [raffleVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("raffle_vault"), rafflePda.toBuffer()],
                program.programId
            );

            await program.methods
                .initializeRaffle(category, new BN(endTimeUnix), new BN(ticketPriceMkn))
                .accounts({
                    payer: wallet.publicKey,
                    mknMint: MKN_TOKEN_MINT,
                    raffle: rafflePda,
                    raffleVault: raffleVault,
                    merchant: merchant,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY
                })
                .rpc();

            toast.success("Raffle created!");
            return rafflePda;
        } catch (e) {
            console.error(e);
            toast.error("Failed to create raffle");
        } finally {
            setLoading(false);
        }
    }

    const buyTicket = async (rafflePubkey: PublicKey) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            const raffleAccount = await program.account.raffle.fetch(rafflePubkey) as any;
            const ticketsSold = raffleAccount.ticketsSold as BN;

            const [raffleVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("raffle_vault"), rafflePubkey.toBuffer()],
                program.programId
            );

            const [ticketPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("ticket"),
                    rafflePubkey.toBuffer(),
                    ticketsSold.toArrayLike(Buffer, 'le', 8)
                ],
                program.programId
            );

            const buyerTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, wallet.publicKey);

            await program.methods
                .buyTicket()
                .accounts({
                    buyer: wallet.publicKey,
                    raffle: rafflePubkey,
                    raffleVault: raffleVault,
                    buyerTokenAccount: buyerTokenAccount,
                    ticket: ticketPda,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID
                })
                .rpc();

            toast.success("Ticket bought!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to buy ticket");
        } finally {
            setLoading(false);
        }
    }

    const pickWinner = async (rafflePubkey: PublicKey) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            await program.methods.pickWinner()
                .accounts({
                    authority: wallet.publicKey,
                    raffle: rafflePubkey
                })
                .rpc();
            toast.success("Winner picked!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to pick winner");
        } finally {
            setLoading(false);
        }
    }

    const claimPrize = async (rafflePubkey: PublicKey, ticketPda: PublicKey, merchant: PublicKey) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            const [raffleVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("raffle_vault"), rafflePubkey.toBuffer()],
                program.programId
            );

            const merchantTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, merchant);

            await program.methods.claimPrize()
                .accounts({
                    winner: wallet.publicKey,
                    raffle: rafflePubkey,
                    raffleVault: raffleVault,
                    merchantTokenAccount: merchantTokenAccount,
                    ticket: ticketPda,
                    tokenProgram: TOKEN_PROGRAM_ID
                })
                .rpc();
            toast.success("Prize claimed!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to claim prize");
        } finally {
            setLoading(false);
        }
    }

    return {
        initializeRaffle,
        buyTicket,
        pickWinner,
        claimPrize,
        loading
    }
}

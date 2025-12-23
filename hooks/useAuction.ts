
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import { Program, Idl, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from "@solana/web3.js";
import { AUCTION_PROGRAM_ID } from "@/lib/constants";
import { toast } from "sonner";
import {
    TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    getAccount,
    createAssociatedTokenAccountInstruction
} from "@solana/spl-token";
import { MKN_TOKEN_MINT } from "@/lib/constants";

// Minimal IDL definition for interaction
const IDL: Idl = {
    "version": "0.1.0",
    "name": "auction",
    "instructions": [
        {
            "name": "createAuction",
            "accounts": [
                { "name": "payer", "writable": true, "signer": true },
                { "name": "mknMint", "writable": false, "signer": false },
                { "name": "auction", "writable": true, "signer": false },
                { "name": "auctionVault", "writable": true, "signer": false },
                { "name": "merchant", "writable": false, "signer": false },
                { "name": "systemProgram", "writable": false, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false },
                { "name": "rent", "writable": false, "signer": false }
            ],
            "args": [
                { "name": "startTimeUnix", "type": "i64" },
                { "name": "endTimeUnix", "type": "i64" },
                { "name": "reservePriceMkn", "type": "u64" },
                { "name": "minIncrementMkn", "type": "u64" },
                { "name": "antiSnipeWindowSecs", "type": "i64" }
            ]
        },
        {
            "name": "placeBid",
            "accounts": [
                { "name": "bidder", "writable": true, "signer": true },
                { "name": "auction", "writable": true, "signer": false },
                { "name": "auctionVault", "writable": true, "signer": false },
                { "name": "bidderTokenAccount", "writable": true, "signer": false },
                { "name": "previousBidderTokenAccount", "writable": true, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false }
            ],
            "args": [
                { "name": "amountMkn", "type": "u64" }
            ]
        },
        {
            "name": "settle",
            "accounts": [
                { "name": "authority", "writable": true, "signer": true },
                { "name": "auction", "writable": true, "signer": false },
                { "name": "auctionVault", "writable": true, "signer": false },
                { "name": "merchantTokenAccount", "writable": true, "signer": false },
                { "name": "merchantRecipient", "writable": true, "signer": false },
                { "name": "tokenProgram", "writable": false, "signer": false }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "Auction",
            "type": {
                "kind": "struct",
                "fields": [
                    { "name": "merchant", "type": "pubkey" },
                    { "name": "mknMint", "type": "pubkey" },
                    { "name": "startTimeUnix", "type": "i64" },
                    { "name": "endTimeUnix", "type": "i64" },
                    { "name": "reservePriceMkn", "type": "u64" },
                    { "name": "minIncrementMkn", "type": "u64" },
                    { "name": "antiSnipeWindowSecs", "type": "i64" },
                    { "name": "highestBidder", "type": { "option": "pubkey" } },
                    { "name": "highestBidMkn", "type": "u64" },
                    { "name": "bump", "type": "u8" }
                ]
            }
        }
    ]
};

export interface AuctionData {
    publicKey: PublicKey;
    merchant: PublicKey;
    startTime: Date;
    endTime: Date;
    reservePrice: number;
    highestBid: number;
    highestBidder: PublicKey | null;
}

export function useAuction() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(false);

    const getProgram = useCallback(() => {
        if (!wallet) return null;
        const provider = new AnchorProvider(connection, wallet, {});
        return new Program(IDL, AUCTION_PROGRAM_ID, provider);
    }, [connection, wallet]);

    const createAuction = async (
        merchant: PublicKey,
        startTimeUnix: number,
        endTimeUnix: number,
        reservePriceMkn: number,
        minIncrementMkn: number,
        antiSnipeWindowSecs: number
    ) => {
        const program = getProgram();
        if (!program || !wallet) {
            toast.error("Wallet not connected");
            return;
        }

        try {
            setLoading(true);
            const [auctionPda] = PublicKey.findProgramAddressSync(
                [Buffer.from("auction"), merchant.toBuffer()],
                program.programId
            );

            const [auctionVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("auction_vault"), auctionPda.toBuffer()],
                program.programId
            );

            const tx = await program.methods
                .createAuction(
                    new BN(startTimeUnix),
                    new BN(endTimeUnix),
                    new BN(reservePriceMkn),
                    new BN(minIncrementMkn),
                    new BN(antiSnipeWindowSecs)
                )
                .accounts({
                    payer: wallet.publicKey,
                    mknMint: MKN_TOKEN_MINT,
                    auction: auctionPda,
                    auctionVault: auctionVault,
                    merchant: merchant,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    rent: SYSVAR_RENT_PUBKEY,
                })
                .rpc();

            toast.success("Auction created successfully!");
            return auctionPda;
        } catch (error) {
            console.error("Create Auction Error:", error);
            toast.error("Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    const placeBid = async (auctionPubkey: PublicKey, amountMkn: number) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            const auctionAccount = await program.account.auction.fetch(auctionPubkey) as any;
            const currentHighestBidder = auctionAccount.highestBidder;

            const [auctionVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("auction_vault"), auctionPubkey.toBuffer()],
                program.programId
            );

            const bidderTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, wallet.publicKey);

            let previousBidderTokenAccount = bidderTokenAccount; // Dummy
            if (currentHighestBidder) {
                previousBidderTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, currentHighestBidder);
            }

            const tx = await program.methods
                .placeBid(new BN(amountMkn))
                .accounts({
                    bidder: wallet.publicKey,
                    auction: auctionPubkey,
                    auctionVault: auctionVault,
                    bidderTokenAccount: bidderTokenAccount,
                    previousBidderTokenAccount: previousBidderTokenAccount,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .rpc();

            toast.success("Bid placed successfully!");
            return tx;
        } catch (error) {
            console.error("Place Bid Error:", error);
            toast.error("Failed to place bid");
        } finally {
            setLoading(false);
        }
    };

    const settleAuction = async (auctionPubkey: PublicKey, merchant: PublicKey) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            const [auctionVault] = PublicKey.findProgramAddressSync(
                [Buffer.from("auction_vault"), auctionPubkey.toBuffer()],
                program.programId
            );

            const merchantTokenAccount = await getAssociatedTokenAddress(MKN_TOKEN_MINT, merchant);

            const tx = await program.methods
                .settle()
                .accounts({
                    authority: wallet.publicKey,
                    auction: auctionPubkey,
                    auctionVault: auctionVault,
                    merchantTokenAccount: merchantTokenAccount,
                    merchantRecipient: merchant,
                    tokenProgram: TOKEN_PROGRAM_ID
                })
                .rpc();

            toast.success("Auction settled!");
            return tx;
        } catch (e) {
            console.error(e);
            toast.error("Failed to settle");
        } finally {
            setLoading(false);
        }
    }

    return {
        createAuction,
        placeBid,
        settleAuction,
        loading
    };
}

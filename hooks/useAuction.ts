
import { useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState, useCallback } from "react";
import { Program, Idl, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { AUCTION_PROGRAM_ID } from "@/lib/constants";
import { toast } from "sonner";

// Minimal IDL definition for interaction (we could import the JSON, but inline is faster for now)
const IDL: Idl = {
    "version": "0.1.0",
    "name": "auction",
    "instructions": [
        {
            "name": "createAuction",
            "accounts": [
                { "name": "payer", "isMut": true, "isSigner": true },
                { "name": "systemProgram", "isMut": false, "isSigner": false },
                { "name": "auction", "isMut": true, "isSigner": true },
                { "name": "merchant", "isMut": false, "isSigner": false }
            ],
            "args": [
                { "name": "startTimeUnix", "type": "i64" },
                { "name": "endTimeUnix", "type": "i64" },
                { "name": "reservePriceLamports", "type": "u64" },
                { "name": "minIncrementLamports", "type": "u64" },
                { "name": "antiSnipeWindowSecs", "type": "i64" }
            ]
        },
        {
            "name": "placeBid",
            "accounts": [
                { "name": "bidder", "isMut": true, "isSigner": true },
                { "name": "systemProgram", "isMut": false, "isSigner": false },
                { "name": "auction", "isMut": true, "isSigner": false },
                { "name": "previousBidder", "isMut": true, "isSigner": false }
            ],
            "args": [
                { "name": "amountLamports", "type": "u64" }
            ]
        },
        {
            "name": "settle",
            "accounts": [
                { "name": "authority", "isMut": true, "isSigner": true },
                { "name": "systemProgram", "isMut": false, "isSigner": false },
                { "name": "auction", "isMut": true, "isSigner": false },
                { "name": "merchantRecipient", "isMut": true, "isSigner": false }
            ],
            "args": []
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
        startTimeUnix: number,
        endTimeUnix: number,
        reservePriceLamports: number,
        minIncrementLamports: number,
        antiSnipeWindowSecs: number
    ) => {
        const program = getProgram();
        if (!program || !wallet) {
            toast.error("Wallet not connected");
            return;
        }

        try {
            setLoading(true);
            const auctionKeypair = web3.Keypair.generate();

            const tx = await program.methods
                .createAuction(
                    new BN(startTimeUnix),
                    new BN(endTimeUnix),
                    new BN(reservePriceLamports),
                    new BN(minIncrementLamports),
                    new BN(antiSnipeWindowSecs)
                )
                .accounts({
                    payer: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId,
                    auction: auctionKeypair.publicKey,
                    merchant: wallet.publicKey,
                })
                .signers([auctionKeypair])
                .rpc();

            toast.success("Auction created successfully!");
            return auctionKeypair.publicKey;
        } catch (error) {
            console.error("Create Auction Error:", error);
            toast.error("Failed to create auction");
        } finally {
            setLoading(false);
        }
    };

    const placeBid = async (auctionPubkey: PublicKey, amountLamports: number, previousBidder: PublicKey | null) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            // If no IDL method, we might need a fetch to confirm accounts but let's assume UI passes correctly
            // previousBidder is actually stored in account, but if null we pass same auction address or system program as dummy?
            // In Anchor, if an account is optional (Option<Account>), we pass null. 
            // But my PlaceBid struct defined `previous_bidder` as `UncheckedAccount`. 
            // It MUST be the correct account or a dummy if none?
            // Wait, in my contract logic:
            // if let Some(prev) = auction.highest_bidder { transfer to prev }
            // The `previous_bidder` account passed in ctx must match.
            // If `highest_bidder` is None, this account is likely ignored, BUT Anchor checks `to_account_info`.
            // I should fetch the auction account first to see who current bidder is.

            // Let's rely on helper to fetch state
            const auctionAccount = await program.account.auction.fetch(auctionPubkey);
            // @ts-ignore
            const currentHighest = auctionAccount.highestBidder as PublicKey;

            // If currentHighest is null (all zeros or null), we pass a placeholder (e.g. system program or self)
            // Actually, if it's None, the logic inside checking for Some(prev) won't run.
            // But we still need to pass A valid account for the instruction context.
            // Usually passing SystemProgram is safe for "None".
            const prevBidderKey = currentHighest || web3.SystemProgram.programId;

            const tx = await program.methods
                .placeBid(new BN(amountLamports))
                .accounts({
                    bidder: wallet.publicKey,
                    auction: auctionPubkey,
                    previousBidder: prevBidderKey, // Critical: Must match on-chain state if exists
                    systemProgram: web3.SystemProgram.programId,
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
            const tx = await program.methods
                .settle()
                .accounts({
                    authority: wallet.publicKey,
                    auction: auctionPubkey,
                    merchantRecipient: merchant,
                    systemProgram: web3.SystemProgram.programId
                })
                .rpc();

            toast.success("Auction settled!");
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

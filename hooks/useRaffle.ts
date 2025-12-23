
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { useState, useCallback } from "react";
import { Program, Idl, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { RAFFLE_PROGRAM_ID } from "@/lib/constants";
import { toast } from "sonner";

const IDL: Idl = {
    "version": "0.1.0",
    "name": "raffle",
    "instructions": [
        {
            "name": "initializeRaffle",
            "accounts": [
                { "name": "payer", "isMut": true, "isSigner": true },
                { "name": "systemProgram", "isMut": false, "isSigner": false },
                { "name": "raffle", "isMut": true, "isSigner": true },
                { "name": "merchant", "isMut": false, "isSigner": false }
            ],
            "args": [
                { "name": "category", "type": "u8" },
                { "name": "endTimeUnix", "type": "i64" },
                { "name": "ticketPriceLamports", "type": "u64" }
            ]
        },
        {
            "name": "buyTicket",
            "accounts": [
                { "name": "buyer", "isMut": true, "isSigner": true },
                { "name": "systemProgram", "isMut": false, "isSigner": false },
                { "name": "raffle", "isMut": true, "isSigner": false },
                { "name": "ticket", "isMut": true, "isSigner": true }
            ],
            "args": []
        },
        {
            "name": "pickWinner",
            "accounts": [
                { "name": "authority", "isMut": true, "isSigner": true },
                { "name": "raffle", "isMut": true, "isSigner": false }
            ],
            "args": []
        },
        {
            "name": "claimPrize",
            "accounts": [
                { "name": "winner", "isMut": true, "isSigner": true },
                { "name": "systemProgram", "isMut": false, "isSigner": false },
                { "name": "raffle", "isMut": true, "isSigner": false },
                { "name": "ticket", "isMut": true, "isSigner": false },
                { "name": "merchant", "isMut": true, "isSigner": false }
            ],
            "args": []
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

    const initializeRaffle = async (category: number, endTimeUnix: number, ticketPrice: number) => {
        const program = getProgram();
        if (!program || !wallet) return;

        try {
            setLoading(true);
            const raffleKeypair = web3.Keypair.generate();

            await program.methods
                .initializeRaffle(category, new BN(endTimeUnix), new BN(ticketPrice))
                .accounts({
                    payer: wallet.publicKey,
                    raffle: raffleKeypair.publicKey,
                    merchant: wallet.publicKey,
                    systemProgram: web3.SystemProgram.programId
                })
                .signers([raffleKeypair])
                .rpc();

            toast.success("Raffle created!");
            return raffleKeypair.publicKey;
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
            // We need to fetch raffle state to get tickets_sold for ticket PDA seeds
            const raffleAccount = await program.account.raffle.fetch(rafflePubkey);
            // @ts-ignore
            const ticketsSold = raffleAccount.ticketsSold as BN;

            // Derive Ticket PDA: [b"ticket", raffle, tickets_sold]
            const [ticketPda] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("ticket"),
                    rafflePubkey.toBuffer(),
                    ticketsSold.toArrayLike(Buffer, 'le', 8)
                ],
                program.programId
            );

            // Wait, my instruction expects "init" which often requires SystemProgram. 
            // But if I use findProgramAddress, it is NOT a Keypair signer, it is a PDA.
            // My struct used: seeds = [...], bump, init, payer = buyer.
            // So I pass the PDA address as 'ticket'. I DO NOT sign with it.
            // BUT my IDL definition and logic in previous step for `buyTicket` says:
            // `pub ticket: Account<'info, Ticket>` -> implies it's just an account.
            // Ah, looking at `raffle/lib.rs` (Step 164 output):
            // `pub ticket: Account<'info, Ticket>` with `blocks` like `init`, `seeds`.
            // This means it IS a PDA. It does not need to be a signer (bump is used).

            // Correction in IDL in this file: 
            // { "name": "ticket", "isMut": true, "isSigner": true } -> should be false for PDA initialization via seeds.
            // However, if I made a mistake in IDL here, generic constraint might fail.
            // Let's assume isSigner: false for PDA.

            // Wait, did I define it as signer in `lib.rs`? 
            // `init` with `seeds` means PDA. PDA cannot sign (except via invoke_signed).
            // The *client* does not sign for the PDA.

            await program.methods
                .buyTicket()
                .accounts({
                    buyer: wallet.publicKey,
                    raffle: rafflePubkey,
                    ticket: ticketPda,
                    systemProgram: web3.SystemProgram.programId
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

    return {
        initializeRaffle,
        buyTicket,
        pickWinner,
        loading
    }
}

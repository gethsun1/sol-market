import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProgram } from "./use-program";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { toast } from "sonner";
import { useWallet } from "@solana/wallet-adapter-react";

export function useEscrow() {
    const { escrowProgram } = useProgram();
    const { publicKey } = useWallet();
    const queryClient = useQueryClient();

    const createEscrow = useMutation({
        mutationFn: async ({
            orderId,
            amount,
            expiresAt,
            merchant,
        }: {
            orderId: string;
            amount: number;
            expiresAt: number;
            merchant: string;
        }) => {
            // Generate a random seed or ID for the escrow if needed, 
            // but the contract takes an order_id (u64).
            // We'll treat orderId as a string representation of u64 for input, convert to BN.
            const orderIdBn = new BN(orderId);
            const amountBn = new BN(amount * 1e9); // Convert SOL to Lamports
            const expiresAtBn = new BN(expiresAt);
            const merchantPubkey = new PublicKey(merchant);

            // Derive Config PDA
            const [config] = PublicKey.findProgramAddressSync(
                [Buffer.from("config")],
                escrowProgram.programId
            );

            // Derive Escrow PDA
            // seeds = [b"sol-escrow", buyer.key().as_ref(), order_id.to_le_bytes().as_ref()]
            const [escrow] = PublicKey.findProgramAddressSync(
                [
                    Buffer.from("sol-escrow"),
                    publicKey!.toBuffer(),
                    orderIdBn.toArrayLike(Buffer, "le", 8),
                ],
                escrowProgram.programId
            );

            return escrowProgram.methods
                .initializeEscrow(orderIdBn, amountBn, expiresAtBn)
                .accountsPartial({
                    payer: publicKey!,
                    buyer: publicKey!,
                    merchant: merchantPubkey,
                    config,
                    escrow,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();
        },
        onSuccess: (signature) => {
            toast.success("Escrow Initialized!");
            console.log("Tx Signature:", signature);
            queryClient.invalidateQueries({ queryKey: ["escrows"] });
        },
        onError: (error) => {
            toast.error("Failed to initialize escrow");
            console.error(error);
        },
    });

    return {
        createEscrow,
    };
}

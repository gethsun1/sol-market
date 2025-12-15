import { useConnection, useAnchorWallet } from "@solana/wallet-adapter-react";
import { getEscrowProgram, getSolmarketProgram } from "@/lib/anchor/setup";
import { useMemo } from "react";

export function useProgram() {
    const { connection } = useConnection();
    const wallet = useAnchorWallet();

    const escrowProgram = useMemo(() => {
        return getEscrowProgram(connection, wallet);
    }, [connection, wallet]);

    const solmarketProgram = useMemo(() => {
        return getSolmarketProgram(connection, wallet);
    }, [connection, wallet]);

    return {
        escrowProgram,
        solmarketProgram,
    };
}

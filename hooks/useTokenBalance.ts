
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddress, getAccount } from "@solana/spl-token";
import { MKN_TOKEN_MINT } from "@/lib/constants";

export function useTokenBalance() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchBalance = async () => {
        if (!publicKey) {
            setBalance(null);
            return;
        }

        try {
            setLoading(true);
            const ata = await getAssociatedTokenAddress(MKN_TOKEN_MINT, publicKey);
            const account = await getAccount(connection, ata);
            setBalance(Number(account.amount) / 1e6);
        } catch (e) {
            // Account likely doesn't exist
            setBalance(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [publicKey, connection]);

    return { balance, loading, refresh: fetchBalance };
}

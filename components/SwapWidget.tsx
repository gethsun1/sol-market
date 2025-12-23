
"use client";

import React, { useState, useEffect } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useSwap } from "@/hooks/useSwap";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RefreshCw, ArrowDownUp, Info, Wallet } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const SwapWidget = () => {
    const { publicKey } = useWallet();
    const { connection } = useConnection();
    const { swapSolToMkn, swapMknToSol, loading } = useSwap();
    const { balance: mknBalance, refresh: refreshMkn } = useTokenBalance();
    const [solBalance, setSolBalance] = useState<number>(0);
    const [inputAmount, setInputAmount] = useState<string>("");
    const [isSolToMkn, setIsSolToMkn] = useState(true);

    const fetchSolBalance = async () => {
        if (publicKey) {
            const bal = await connection.getBalance(publicKey);
            setSolBalance(bal / LAMPORTS_PER_SOL);
        }
    };

    useEffect(() => {
        fetchSolBalance();
    }, [publicKey, connection]);

    const handleSwap = async () => {
        const amount = parseFloat(inputAmount);
        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (isSolToMkn) {
            await swapSolToMkn(amount);
        } else {
            await swapMknToSol(amount);
        }

        setInputAmount("");
        fetchSolBalance();
        refreshMkn();
    };

    const exchangeAmount = isSolToMkn
        ? (parseFloat(inputAmount) || 0) * 100
        : (parseFloat(inputAmount) || 0) / 100;

    return (
        <Card className="w-full max-w-sm border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
            {/* Dynamic Background Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 blur-[100px] rounded-full group-hover:bg-purple-500/20 transition-all duration-500" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-500" />

            <CardHeader className="relative">
                <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Swap MKN
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10"
                            onClick={() => { fetchSolBalance(); refreshMkn(); }}
                        >
                            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>
                <CardDescription className="text-gray-400">
                    Fixed Rate: 1 SOL = 100 MKN
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 relative">
                {/* Input Section */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 px-1">
                        <span>From</span>
                        <span className="flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            {isSolToMkn ? `${solBalance.toFixed(4)} SOL` : `${mknBalance?.toFixed(2) || 0} MKN`}
                        </span>
                    </div>
                    <div className="relative group/input">
                        <Input
                            type="number"
                            placeholder="0.00"
                            value={inputAmount}
                            onChange={(e) => setInputAmount(e.target.value)}
                            className="bg-black/40 border-white/10 h-14 text-lg font-medium focus-visible:ring-purple-500/50 transition-all"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-gray-400">
                            {isSolToMkn ? "SOL" : "MKN"}
                        </div>
                    </div>
                </div>

                {/* Swap Direction Toggle */}
                <div className="flex justify-center -my-2 relative z-10">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-purple-500/20 hover:bg-purple-500/40 border border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/20 transition-all transform hover:rotate-180 duration-500"
                        onClick={() => setIsSolToMkn(!isSolToMkn)}
                    >
                        <ArrowDownUp className="h-4 w-4" />
                    </Button>
                </div>

                {/* Output Section */}
                <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 px-1">
                        <span>To (Estimated)</span>
                        <span className="flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            {isSolToMkn ? `${mknBalance?.toFixed(2) || 0} MKN` : `${solBalance.toFixed(4)} SOL`}
                        </span>
                    </div>
                    <div className="relative">
                        <div className="bg-black/20 border border-white/5 h-14 rounded-md flex items-center px-3 text-lg font-medium text-gray-300">
                            {exchangeAmount.toFixed(isSolToMkn ? 2 : 4)}
                            <div className="ml-auto font-bold text-gray-500">
                                {isSolToMkn ? "MKN" : "SOL"}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-3 flex gap-3 text-xs text-blue-300">
                    <Info className="h-4 w-4 shrink-0" />
                    <p>MKN is required for all platform activities. Use this widget to maintain your balance on Devnet.</p>
                </div>
            </CardContent>

            <CardFooter>
                <Button
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold shadow-xl shadow-purple-500/20 border-0 transition-all duration-300 transform active:scale-[0.98]"
                    onClick={handleSwap}
                    disabled={loading || !inputAmount || parseFloat(inputAmount) <= 0}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Processing Swap...
                        </div>
                    ) : (
                        `Swap to ${isSolToMkn ? "MKN" : "SOL"}`
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};

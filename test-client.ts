
import { Connection } from "@solana/web3.js";
import { getEscrowProgram, getSolmarketProgram } from "./lib/anchor/setup";

const connection = new Connection("https://api.devnet.solana.com");

async function main() {
    console.log("Testing Anchor Client Setup...");

    try {
        const escrowProgram = getEscrowProgram(connection);
        console.log("✅ Escrow Program Initialized");
        console.log("   Program ID:", escrowProgram.programId.toBase58());

        const solmarketProgram = getSolmarketProgram(connection);
        console.log("✅ Solmarket Program Initialized");
        console.log("   Program ID:", solmarketProgram.programId.toBase58());

        console.log("SUCCESS: Client setup is working.");
    } catch (error) {
        console.error("❌ SETUP FAILED:", error);
        process.exit(1);
    }
}

main();

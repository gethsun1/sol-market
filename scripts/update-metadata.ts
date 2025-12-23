
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    updateV1,
    mplTokenMetadata,
    fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata';
import {
    keypairIdentity,
    publicKey,
    some,
} from '@metaplex-foundation/umi';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.error("Usage: npx tsx scripts/update-metadata.ts <MINT_ADDRESS> <JSON_URI>");
        process.exit(1);
    }

    const mintAddress = args[0];
    const newUri = args[1];

    console.log(`🚀 Updating Metadata for Mint: ${mintAddress}...`);

    // 1. Setup Umi & Keys
    const RPC_URL = "https://api.devnet.solana.com";
    const umi = createUmi(RPC_URL);
    umi.use(mplTokenMetadata());

    const walletPath = path.join(homedir(), '.config/solana/id.json');
    const walletFile = JSON.parse(readFileSync(walletPath, 'utf-8'));
    const secretKey = new Uint8Array(walletFile);

    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
    umi.use(keypairIdentity(umiKeypair));

    console.log(`✅ Wallet loaded: ${umiKeypair.publicKey}`);

    const mint = publicKey(mintAddress);

    // 2. Fetch current metadata
    console.log("🔍 Fetching current metadata...");
    const metadata = await fetchMetadataFromSeeds(umi, { mint });

    console.log("📦 Sending update transaction with root mapping...");

    // 3. Perform update - Map root fields to DataV2 structure
    await updateV1(umi, {
        mint,
        data: some({
            name: "Makena Token",
            symbol: "MKN",
            uri: newUri,
            sellerFeeBasisPoints: metadata.sellerFeeBasisPoints,
            creators: metadata.creators,
            collection: metadata.collection,
            uses: metadata.uses,
        }),
    }).sendAndConfirm(umi);

    console.log("✅ Success! Metadata updated.");
    console.log(`View on Explorer: https://explorer.solana.com/address/${mintAddress}/metadata?cluster=devnet`);
}

main().catch(err => {
    console.error("❌ Fatal Error:", err);
    process.exit(1);
});

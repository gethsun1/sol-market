
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
    createFungible,
    mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata';
import {
    keypairIdentity,
    generateSigner,
    percentAmount
} from '@metaplex-foundation/umi';
import {
    Connection,
    Keypair,
    PublicKey,
} from '@solana/web3.js';
import {
    createAssociatedTokenAccount,
    mintTo,
} from '@solana/spl-token';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import path from 'path';

async function main() {
    console.log("🚀 Starting MKN Token Minting (Hybrid Approach)...");

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

    // 2. Generate Mint Signer in Umi
    const mintUmi = generateSigner(umi);
    console.log(`✨ Generated Mint Address: ${mintUmi.publicKey}`);

    // 3. Create Mint & Metadata (Umi)
    // We point to a generic placeholder JSON for now as requested by user constraints/time.
    // Ideally this JSON contains the image URL.
    const uri = "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json";

    console.log("📦 Creating Mint & Metadata...");
    await createFungible(umi, {
        mint: mintUmi,
        name: 'Makena Token',
        symbol: 'MKN',
        uri: uri,
        sellerFeeBasisPoints: percentAmount(0),
        decimals: 6,
    }).sendAndConfirm(umi);
    console.log("✅ Mint & Metadata Created.");

    // 4. Switch to Web3.js for Minting (Reliable Standard)
    const connection = new Connection(RPC_URL, "confirmed");
    const payerWeb3 = Keypair.fromSecretKey(secretKey);

    // Convert Umi Public Key to Web3.js Public Key
    // Umi uses string, Web3.js uses PublicKey object
    const mintPubkey = new PublicKey(mintUmi.publicKey);

    console.log("👤 Creating Associated Token Account...");
    const ata = await createAssociatedTokenAccount(
        connection,
        payerWeb3,
        mintPubkey,
        payerWeb3.publicKey
    );
    console.log(`✅ ATA Created: ${ata.toBase58()}`);

    console.log("💰 Minting 10,000,000 MKN...");
    const amount = 10_000_000 * Math.pow(10, 6);

    const txSig = await mintTo(
        connection,
        payerWeb3,
        mintPubkey,
        ata,
        payerWeb3,
        amount
    );

    console.log("✅ Minted. Signature:", txSig);
    console.log(`\n🎉 Success! MKN Token Address: ${mintPubkey.toBase58()}`);
    console.log(`View on Explorer: https://explorer.solana.com/address/${mintPubkey.toBase58()}?cluster=devnet`);
}

main().catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
});


import { PublicKey } from "@solana/web3.js";

export const MKN_TOKEN_MINT = new PublicKey("9CMv5nbwi48J9haJywdgpUhf8HRN7p4FRkrhzRc9Sfuw");
export const MKN_TOKEN_DECIMALS = 6;
export const MKN_TOKEN_SYMBOL = "MKN";
export const MKN_TOKEN_NAME = "Makena Token";

export const ESCROW_PROGRAM_ID = new PublicKey("33umURgaFrrQvJ8K7XrFXfVyUZsp3amfRBqyuEvPP5Wu");
// We will update these once we deploy the new contracts
export const AUCTION_PROGRAM_ID = new PublicKey("HJdFhhRi3Z3ipPjjbeoXu8x5nBHj7rTaU8D499gLWqqL");
export const RAFFLE_PROGRAM_ID = new PublicKey("AtbQBffhFkabRYCSTSa8BEjrCcV6tnD2AhJoNWSuBUvq");
export const SWAP_PROGRAM_ID = new PublicKey("BLyc8iNGvz1mYRWGZdRku1fAQdhKLpMatX4DKf2FREPt");

// Derivable PDAs (we'll use helper functions in hooks but keeping here for reference)
export const SWAP_VAULT_SEED = "mkn_vault";

// Here we export some useful types and functions for interacting with the Anchor program.
import { Account, getBase58Decoder, SolanaClient } from 'gill'
import { getProgramAccountsDecoded } from './helpers/get-program-accounts-decoded'
import { Solmarket, SOLMARKET_DISCRIMINATOR, SOLMARKET_PROGRAM_ADDRESS, getSolmarketDecoder } from './client/js'
import SolmarketIDL from '../target/idl/solmarket.json'

export type SolmarketAccount = Account<Solmarket, string>

// Re-export the generated IDL and type
export { SolmarketIDL }

export * from './client/js'

export function getSolmarketProgramAccounts(rpc: SolanaClient['rpc']) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getSolmarketDecoder(),
    filter: getBase58Decoder().decode(SOLMARKET_DISCRIMINATOR),
    programAddress: SOLMARKET_PROGRAM_ADDRESS,
  })
}

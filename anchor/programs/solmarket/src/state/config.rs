use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Config {
    pub authority: Pubkey,
    pub fee_bps: u16,         // 200 for 2%
    pub fee_recipient: Pubkey,
    pub bump: u8,
}






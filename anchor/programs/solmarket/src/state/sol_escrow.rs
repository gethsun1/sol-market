use anchor_lang::prelude::*;

#[repr(u8)]
pub enum EscrowStatus {
    Pending = 0,
    Funded = 1,
    Released = 2,
    Refunded = 3,
    Expired = 4,
}

#[account]
#[derive(InitSpace)]
pub struct SolEscrow {
    pub order_id: u64,
    pub buyer: Pubkey,
    pub merchant: Pubkey,
    pub amount_lamports: u64,
    pub fee_bps: u16, // snapshot of fee at creation
    pub status: u8,
    pub bump: u8,
    pub created_at: i64,
    pub expires_at: i64,
}






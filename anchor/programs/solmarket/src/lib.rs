#![allow(unexpected_cfgs)]
// Stops Rust Analyzer complaining about missing configs
// See https://solana.stackexchange.com/questions/17777

use anchor_lang::prelude::*;
use handlers::*;


pub mod error;
pub mod handlers;
pub mod state;


declare_id!("8jR5GeNzeweq35Uo84kGP3v1NcBaZWH5u62k7PxN4T2y");

#[program]
pub mod escrow {
    use super::*;

    // SOL escrow API
    pub fn initialize_config(context: Context<InitializeConfig>) -> Result<()> {
        handlers::sol_escrow::initialize_config(context)
    }
    pub fn initialize_escrow(
        context: Context<InitializeEscrow>,
        order_id: u64,
        amount_lamports: u64,
        expires_at: i64,
    ) -> Result<()> {
        handlers::sol_escrow::initialize_escrow(context, order_id, amount_lamports, expires_at)
    }
    pub fn fund_escrow(context: Context<FundEscrow>) -> Result<()> {
        handlers::sol_escrow::fund_escrow(context)
    }
    pub fn release_escrow(context: Context<ReleaseEscrow>) -> Result<()> {
        handlers::sol_escrow::release_escrow(context)
    }
    pub fn refund_escrow(context: Context<RefundEscrow>) -> Result<()> {
        handlers::sol_escrow::refund_escrow(context)
    }
    pub fn expire_escrow(context: Context<ExpireEscrow>) -> Result<()> {
        handlers::sol_escrow::expire_escrow(context)
    }
}

// Tests removed in this build to simplify IDL generation
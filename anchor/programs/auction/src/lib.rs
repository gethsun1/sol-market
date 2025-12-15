#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_lang::Discriminator;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod auction {
    use super::*;

    pub fn create_auction(
        _ctx: Context<CreateAuction>,
        _start_time_unix: i64,
        _end_time_unix: i64,
        _reserve_price_lamports: u64,
        _min_increment_lamports: u64,
        _anti_snipe_window_secs: i64,
    ) -> Result<()> {
        Ok(())
    }

    pub fn place_bid(_ctx: Context<PlaceBid>, _amount_lamports: u64) -> Result<()> {
        Ok(())
    }

    pub fn settle(_ctx: Context<SettleAuction>) -> Result<()> {
        Ok(())
    }

    pub fn cancel_no_bids(_ctx: Context<CancelNoBids>) -> Result<()> {
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Auction {
    pub merchant: Pubkey,
    pub start_time_unix: i64,
    pub end_time_unix: i64,
    pub reserve_price_lamports: u64,
    pub min_increment_lamports: u64,
    pub anti_snipe_window_secs: i64,
    pub highest_bidder: Option<Pubkey>,
    pub highest_bid_lamports: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateAuction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        payer = payer,
        space = Auction::DISCRIMINATOR.len() + Auction::INIT_SPACE,
        seeds = [b"auction", merchant.key().as_ref()],
        bump
    )]
    pub auction: Account<'info, Auction>,
    /// CHECK: Merchant authority for UI/reference
    pub merchant: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct PlaceBid <'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut, seeds = [b"auction", auction.merchant.as_ref()], bump = auction.bump)]
    pub auction: Account<'info, Auction>,
}

#[derive(Accounts)]
pub struct SettleAuction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"auction", auction.merchant.as_ref()], bump = auction.bump)]
    pub auction: Account<'info, Auction>,
}

#[derive(Accounts)]
pub struct CancelNoBids<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"auction", auction.merchant.as_ref()], bump = auction.bump)]
    pub auction: Account<'info, Auction>,
}




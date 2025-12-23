#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("HJdFhhRi3Z3ipPjjbeoXu8x5nBHj7rTaU8D499gLWqqL");

#[program]
pub mod auction {
    use super::*;

    pub fn create_auction(
        ctx: Context<CreateAuction>,
        start_time_unix: i64,
        end_time_unix: i64,
        reserve_price_mkn: u64,
        min_increment_mkn: u64,
        anti_snipe_window_secs: i64,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        
        require!(start_time_unix < end_time_unix, AuctionError::InvalidTimeRange);
        
        auction.merchant = ctx.accounts.merchant.key();
        auction.mkn_mint = ctx.accounts.mkn_mint.key();
        auction.start_time_unix = start_time_unix;
        auction.end_time_unix = end_time_unix;
        auction.reserve_price_mkn = reserve_price_mkn;
        auction.min_increment_mkn = min_increment_mkn;
        auction.anti_snipe_window_secs = anti_snipe_window_secs;
        auction.highest_bidder = None;
        auction.highest_bid_mkn = 0;
        auction.bump = ctx.bumps.auction;

        msg!("Auction created for mint: {}", auction.mkn_mint);
        Ok(())
    }

    pub fn place_bid(ctx: Context<PlaceBid>, amount_mkn: u64) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let now = Clock::get()?.unix_timestamp;

        require!(now >= auction.start_time_unix, AuctionError::NotStarted);
        require!(now < auction.end_time_unix, AuctionError::Ended);
        
        // Validation
        if let Some(_) = auction.highest_bidder {
             require!(amount_mkn >= auction.highest_bid_mkn + auction.min_increment_mkn, AuctionError::BidTooLow);
        } else {
             require!(amount_mkn >= auction.reserve_price_mkn, AuctionError::BidBelowReserve);
        }

        // 1. Refund previous bidder if exists
        if let Some(_) = auction.highest_bidder {
            let refund_amount = auction.highest_bid_mkn;
            
            let seeds = &[
                b"auction".as_ref(),
                auction.merchant.as_ref(),
                &[auction.bump],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.auction_vault.to_account_info(),
                to: ctx.accounts.previous_bidder_token_account.to_account_info(),
                authority: auction.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, refund_amount)?;
        }

        // 2. Take new bid (Transfer from Bidder to Auction Vault)
        let cpi_accounts = Transfer {
            from: ctx.accounts.bidder_token_account.to_account_info(),
            to: ctx.accounts.auction_vault.to_account_info(),
            authority: ctx.accounts.bidder.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount_mkn)?;

        // 3. Update State
        auction.highest_bidder = Some(ctx.accounts.bidder.key());
        auction.highest_bid_mkn = amount_mkn;

        // 4. Anti-snipe extension
        if auction.anti_snipe_window_secs > 0 {
            let time_left = auction.end_time_unix - now;
            if time_left < auction.anti_snipe_window_secs {
                auction.end_time_unix = now + auction.anti_snipe_window_secs;
            }
        }

        msg!("Bid placed: {} MKN by {}", amount_mkn, ctx.accounts.bidder.key());
        Ok(())
    }

    pub fn settle(ctx: Context<SettleAuction>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let now = Clock::get()?.unix_timestamp;

        require!(now >= auction.end_time_unix, AuctionError::NotEnded);
        require!(auction.highest_bidder.is_some(), AuctionError::NoBids);

        let amount = auction.highest_bid_mkn;
        
        // Transfer funds from vault to merchant recipient
        let seeds = &[
            b"auction".as_ref(),
            auction.merchant.as_ref(),
            &[auction.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.auction_vault.to_account_info(),
            to: ctx.accounts.merchant_token_account.to_account_info(),
            authority: auction.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        token::transfer(cpi_ctx, amount)?;

        Ok(())
    }

    pub fn cancel_no_bids(ctx: Context<CancelNoBids>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        require!(auction.highest_bidder.is_none(), AuctionError::HasBids);
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Auction {
    pub merchant: Pubkey,
    pub mkn_mint: Pubkey,
    pub start_time_unix: i64,
    pub end_time_unix: i64,
    pub reserve_price_mkn: u64,
    pub min_increment_mkn: u64,
    pub anti_snipe_window_secs: i64,
    pub highest_bidder: Option<Pubkey>,
    pub highest_bid_mkn: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct CreateAuction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub mkn_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = 8 + Auction::INIT_SPACE,
        seeds = [b"auction", merchant.key().as_ref()],
        bump
    )]
    pub auction: Account<'info, Auction>,

    #[account(
        init,
        payer = payer,
        token::mint = mkn_mint,
        token::authority = auction,
        seeds = [b"auction_vault", auction.key().as_ref()],
        bump
    )]
    pub auction_vault: Account<'info, TokenAccount>,

    /// CHECK: Merchant authority
    pub merchant: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    #[account(
        mut, 
        seeds = [b"auction", auction.merchant.as_ref()], 
        bump = auction.bump
    )]
    pub auction: Account<'info, Auction>,

    #[account(
        mut,
        seeds = [b"auction_vault", auction.key().as_ref()],
        bump
    )]
    pub auction_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub bidder_token_account: Account<'info, TokenAccount>,

    /// CHECK: Previous bidder's token account needed for refund
    #[account(mut)]
    pub previous_bidder_token_account: UncheckedAccount<'info>, 

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct SettleAuction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        close = merchant_recipient,
        seeds = [b"auction", auction.merchant.as_ref()], 
        bump = auction.bump
    )]
    pub auction: Account<'info, Auction>,

    #[account(
        mut,
        seeds = [b"auction_vault", auction.key().as_ref()],
        bump
    )]
    pub auction_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,

    /// CHECK: Merchant recipient must match state for rent recovery
    #[account(mut, address = auction.merchant)]
    pub merchant_recipient: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CancelNoBids<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        mut, 
        close = authority,
        seeds = [b"auction", auction.merchant.as_ref()], 
        bump = auction.bump,
        has_one = merchant
    )]
    pub auction: Account<'info, Auction>,
    /// CHECK: Merchant
    #[account(address = authority.key())]
    pub merchant: UncheckedAccount<'info>,
}

#[error_code]
pub enum AuctionError {
    #[msg("Invalid time range")]
    InvalidTimeRange,
    #[msg("Auction not started")]
    NotStarted,
    #[msg("Auction ended")]
    Ended,
    #[msg("Auction not ended")]
    NotEnded,
    #[msg("Bid too low")]
    BidTooLow,
    #[msg("Bid below reserve")]
    BidBelowReserve,
    #[msg("Auction has bids, cannot cancel")]
    HasBids,
    #[msg("No bids to settle")]
    NoBids,
}

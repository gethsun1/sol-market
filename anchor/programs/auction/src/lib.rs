#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::Discriminator;

declare_id!("HJdFhhRi3Z3ipPjjbeoXu8x5nBHj7rTaU8D499gLWqqL");

#[program]
pub mod auction {
    use super::*;

    pub fn create_auction(
        ctx: Context<CreateAuction>,
        start_time_unix: i64,
        end_time_unix: i64,
        reserve_price_lamports: u64,
        min_increment_lamports: u64,
        anti_snipe_window_secs: i64,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let _now = Clock::get()?.unix_timestamp;

        require!(start_time_unix < end_time_unix, AuctionError::InvalidTimeRange);
        // We allow start_time to be in the past slightly (due to clock drift) but generally future
        
        auction.merchant = ctx.accounts.merchant.key();
        auction.start_time_unix = start_time_unix;
        auction.end_time_unix = end_time_unix;
        auction.reserve_price_lamports = reserve_price_lamports;
        auction.min_increment_lamports = min_increment_lamports;
        auction.anti_snipe_window_secs = anti_snipe_window_secs;
        auction.highest_bidder = None;
        auction.highest_bid_lamports = 0;
        auction.bump = ctx.bumps.auction;

        Ok(())
    }

    pub fn place_bid(ctx: Context<PlaceBid>, amount_lamports: u64) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let now = Clock::get()?.unix_timestamp;

        require!(now >= auction.start_time_unix, AuctionError::NotStarted);
        require!(now < auction.end_time_unix, AuctionError::Ended);
        
        // Validation
        if let Some(_) = auction.highest_bidder {
             require!(amount_lamports >= auction.highest_bid_lamports + auction.min_increment_lamports, AuctionError::BidTooLow);
        } else {
             require!(amount_lamports >= auction.reserve_price_lamports, AuctionError::BidBelowReserve);
        }

        // 1. Refund previous bidder if exists
        if let Some(_prev_bidder) = auction.highest_bidder {
            let refund_amount = auction.highest_bid_lamports;
            
            // Signer seeds for PDA transfer
            let seeds: [&[u8]; 3] = [
                b"auction",
                auction.merchant.as_ref(), // Note: seed is merchant, not bidder
                &[auction.bump]
            ];
            let signer_seeds = [&seeds[..]];

            let cpi_accounts = system_program::Transfer {
                from: auction.to_account_info(),
                to: ctx.accounts.previous_bidder.to_account_info(), // Must be passed in Accounts
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                cpi_accounts,
                &signer_seeds
            );
            system_program::transfer(cpi_ctx, refund_amount)?;
        }

        // 2. Take new bid (Transfer from Bidder to Auction PDA)
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.bidder.to_account_info(),
            to: auction.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
        system_program::transfer(cpi_ctx, amount_lamports)?;

        // 3. Update State
        auction.highest_bidder = Some(ctx.accounts.bidder.key());
        auction.highest_bid_lamports = amount_lamports;

        // 4. Anti-snipe extension
        if auction.anti_snipe_window_secs > 0 {
            let time_left = auction.end_time_unix - now;
            if time_left < auction.anti_snipe_window_secs {
                auction.end_time_unix = now + auction.anti_snipe_window_secs;
            }
        }

        Ok(())
    }

    pub fn settle(ctx: Context<SettleAuction>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let now = Clock::get()?.unix_timestamp;

        require!(now >= auction.end_time_unix, AuctionError::NotEnded);
        require!(auction.highest_bidder.is_some(), AuctionError::NoBids);

        // Transfer funds to merchant
        let amount = auction.highest_bid_lamports;
        
        let seeds: [&[u8]; 3] = [
            b"auction",
            auction.merchant.as_ref(),
            &[auction.bump]
        ];
        let signer_seeds = [&seeds[..]];

        let cpi_accounts = system_program::Transfer {
            from: auction.to_account_info(),
            to: ctx.accounts.merchant_recipient.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            cpi_accounts,
            &signer_seeds
        );
        system_program::transfer(cpi_ctx, amount)?;

        // Close account happens automatically via `close = merchant` in struct if we wanted, 
        // but here we might want to keep history? 
        // For this implementation, we will NOT close it in instruction to allow viewing history,
        // unless explicitly requested. However, user usually wants to reclaim rent.
        // Let's assume we want to close it to reclaim rent.
        // Actually, the SettleAuction struct can have `close = authority`?
        // Let's Stick to standard transfer and letting a separate `close` instruction handle rent, or do it here.
        // The struct below uses `close = merchant` on Settle? Let's check struct below.
        
        Ok(())
    }

    pub fn cancel_no_bids(ctx: Context<CancelNoBids>) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        let _now = Clock::get()?.unix_timestamp;

        // Can cancel if no bids placed
        require!(auction.highest_bidder.is_none(), AuctionError::HasBids);
        
        // If has bids, must settle.
        // If expired or not, if no bids, merchant can close.
        
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
    /// CHECK: Merchant authority
    pub merchant: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct PlaceBid <'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut, seeds = [b"auction", auction.merchant.as_ref()], bump = auction.bump)]
    pub auction: Account<'info, Auction>,
    /// CHECK: Previous bidder needed for refund if exist
    #[account(mut)]
    pub previous_bidder: UncheckedAccount<'info>, 
}

#[derive(Accounts)]
pub struct SettleAuction<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Can be anyone, usually merchant
    pub system_program: Program<'info, System>,
    #[account(
        mut,
        close = merchant_recipient, // Close and send rent to merchant
        seeds = [b"auction", auction.merchant.as_ref()], 
        bump = auction.bump
    )]
    pub auction: Account<'info, Auction>,
    /// CHECK: Merchant recipient must match state
    #[account(mut, address = auction.merchant)]
    pub merchant_recipient: UncheckedAccount<'info>,
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
        has_one = merchant // Only merchant can cancel
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




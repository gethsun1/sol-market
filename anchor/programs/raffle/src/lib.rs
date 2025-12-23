#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("AtbQBffhFkabRYCSTSa8BEjrCcV6tnD2AhJoNWSuBUvq");

#[program]
pub mod raffle {
    use super::*;

    pub fn initialize_raffle(
        ctx: Context<InitializeRaffle>,
        category: u8,
        end_time_unix: i64,
        ticket_price_mkn: u64,
    ) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        raffle.merchant = ctx.accounts.merchant.key();
        raffle.mkn_mint = ctx.accounts.mkn_mint.key();
        raffle.category = category;
        raffle.end_time_unix = end_time_unix;
        raffle.ticket_price_mkn = ticket_price_mkn;
        raffle.tickets_sold = 0;
        raffle.winning_ticket_index = None;
        raffle.bump = ctx.bumps.raffle;
        Ok(())
    }

    pub fn buy_ticket(ctx: Context<BuyTicket>) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        let now = Clock::get()?.unix_timestamp;
        
        require!(now < raffle.end_time_unix, RaffleError::RaffleEnded);
        require!(raffle.winning_ticket_index.is_none(), RaffleError::WinnerAlreadySelected);
        
        let ticket_price = raffle.ticket_price_mkn;

        // 1. Transfer MKN to Raffle Vault
        let cpi_accounts = Transfer {
            from: ctx.accounts.buyer_token_account.to_account_info(),
            to: ctx.accounts.raffle_vault.to_account_info(),
            authority: ctx.accounts.buyer.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, ticket_price)?;

        // 2. Init Ticket
        let ticket = &mut ctx.accounts.ticket;
        ticket.raffle = raffle.key();
        ticket.owner = ctx.accounts.buyer.key();
        ticket.index = raffle.tickets_sold;
        ticket.bump = ctx.bumps.ticket;

        // 3. Increment count
        raffle.tickets_sold = raffle.tickets_sold.checked_add(1).unwrap();

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        let now = Clock::get()?.unix_timestamp;

        require!(now >= raffle.end_time_unix, RaffleError::RaffleNotEnded);
        require!(raffle.tickets_sold > 0, RaffleError::NoTicketsSold);
        require!(raffle.winning_ticket_index.is_none(), RaffleError::WinnerAlreadySelected);

        let clock = Clock::get()?;
        let random_seed = clock.slot.wrapping_add(clock.unix_timestamp as u64);
        let winner_index = random_seed % raffle.tickets_sold;

        raffle.winning_ticket_index = Some(winner_index);
        
        Ok(())
    }

    pub fn claim_prize(ctx: Context<ClaimPrize>) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        let ticket = &ctx.accounts.ticket;

        require!(raffle.winning_ticket_index.is_some(), RaffleError::WinnerNotSelected);
        require!(raffle.winning_ticket_index.unwrap() == ticket.index, RaffleError::NotTheWinner);
        require!(ticket.owner == ctx.accounts.winner.key(), RaffleError::Unauthorized);

        // Funds from ticket sales go to merchant
        let amount = raffle.tickets_sold.checked_mul(raffle.ticket_price_mkn).unwrap();
        
        if amount > 0 {
             let seeds = &[
                b"raffle".as_ref(),
                raffle.merchant.as_ref(),
                &[raffle.bump],
            ];
            let signer = &[&seeds[..]];

            let cpi_accounts = Transfer {
                from: ctx.accounts.raffle_vault.to_account_info(),
                to: ctx.accounts.merchant_token_account.to_account_info(),
                authority: raffle.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
            token::transfer(cpi_ctx, amount)?;
        }
        
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Raffle {
    pub merchant: Pubkey,
    pub mkn_mint: Pubkey,
    pub category: u8,
    pub end_time_unix: i64,
    pub ticket_price_mkn: u64,
    pub tickets_sold: u64,
    pub winning_ticket_index: Option<u64>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Ticket {
    pub raffle: Pubkey,
    pub owner: Pubkey,
    pub index: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitializeRaffle<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    pub mkn_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        space = 8 + Raffle::INIT_SPACE,
        seeds = [b"raffle", merchant.key().as_ref()],
        bump
    )]
    pub raffle: Account<'info, Raffle>,

    #[account(
        init,
        payer = payer,
        token::mint = mkn_mint,
        token::authority = raffle,
        seeds = [b"raffle_vault", raffle.key().as_ref()],
        bump
    )]
    pub raffle_vault: Account<'info, TokenAccount>,

    /// CHECK: Merchant authority
    pub merchant: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,

    #[account(
        mut, 
        seeds = [b"raffle", raffle.merchant.as_ref()], 
        bump = raffle.bump
    )]
    pub raffle: Account<'info, Raffle>,

    #[account(
        mut,
        seeds = [b"raffle_vault", raffle.key().as_ref()],
        bump
    )]
    pub raffle_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub buyer_token_account: Account<'info, TokenAccount>,

    #[account(
        init,
        payer = buyer,
        space = 8 + Ticket::INIT_SPACE,
        seeds = [b"ticket", raffle.key().as_ref(), &raffle.tickets_sold.to_le_bytes()],
        bump
    )]
    pub ticket: Account<'info, Ticket>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct PickWinner<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
}

#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(mut)]
    pub winner: Signer<'info>,

    #[account(
        mut, 
        seeds = [b"raffle", raffle.merchant.as_ref()], 
        bump = raffle.bump
    )]
    pub raffle: Account<'info, Raffle>,

    #[account(
        mut,
        seeds = [b"raffle_vault", raffle.key().as_ref()],
        bump
    )]
    pub raffle_vault: Account<'info, TokenAccount>,

    #[account(mut)]
    pub merchant_token_account: Account<'info, TokenAccount>,

    #[account(
        mut, 
        close = winner,
        seeds = [b"ticket", raffle.key().as_ref(), &ticket.index.to_le_bytes()],
        bump = ticket.bump
    )]
    pub ticket: Account<'info, Ticket>,

    pub token_program: Program<'info, Token>,
}

#[error_code]
pub enum RaffleError {
    #[msg("Raffle ended")]
    RaffleEnded,
    #[msg("Raffle not ended")]
    RaffleNotEnded,
    #[msg("No tickets sold")]
    NoTicketsSold,
    #[msg("Winner already selected")]
    WinnerAlreadySelected,
    #[msg("Winner not selected")]
    WinnerNotSelected,
    #[msg("Not the winner")]
    NotTheWinner,
    #[msg("Unauthorized")]
    Unauthorized,
}

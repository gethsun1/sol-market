#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_lang::system_program;
use anchor_lang::Discriminator;

declare_id!("AtbQBffhFkabRYCSTSa8BEjrCcV6tnD2AhJoNWSuBUvq");

#[program]
pub mod raffle {
    use super::*;

    pub fn initialize_raffle(
        ctx: Context<InitializeRaffle>,
        category: u8,
        end_time_unix: i64,
        ticket_price_lamports: u64,
    ) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        raffle.merchant = ctx.accounts.merchant.key();
        raffle.category = category;
        raffle.end_time_unix = end_time_unix;
        raffle.ticket_price_lamports = ticket_price_lamports;
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
        
        let ticket_price = raffle.ticket_price_lamports;

        // Transfer SOL to Raffle PDA
        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.buyer.to_account_info(),
            to: raffle.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
        system_program::transfer(cpi_ctx, ticket_price)?;

        // Init Ticket
        let ticket = &mut ctx.accounts.ticket;
        ticket.raffle = raffle.key();
        ticket.owner = ctx.accounts.buyer.key();
        ticket.index = raffle.tickets_sold;
        ticket.bump = ctx.bumps.ticket;

        // Increment count
        raffle.tickets_sold = raffle.tickets_sold.checked_add(1).unwrap();

        Ok(())
    }

    pub fn pick_winner(ctx: Context<PickWinner>) -> Result<()> {
        let raffle = &mut ctx.accounts.raffle;
        let now = Clock::get()?.unix_timestamp;

        require!(now >= raffle.end_time_unix, RaffleError::RaffleNotEnded);
        require!(raffle.tickets_sold > 0, RaffleError::NoTicketsSold);
        require!(raffle.winning_ticket_index.is_none(), RaffleError::WinnerAlreadySelected);

        // Simple Devnet Randomness: (Last Block Slot + Timestamp) % tickets_sold
        // WARNING: Not secure for mainnet (validators can manipulate), but fine for devnet demo.
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

        // Payout to Winner (e.g. 50% pot) and Merchant (50% pot) or Winner Item / Merchant Pot
        // Assuming this is a "Pot Raffle" (Funds go to winner/merchant split) or "Item Raffle" (Funds go to merchant, Item to Winner).
        // Since the instruction is `distribute_prize` in original, let's assume Funds -> Merchant (Revenue) and simple completion.
        // Wait, normally a raffle implies the USER wins something.
        // If it's a "Cash Raffle", winner takes pot.
        // If it's an "Item Raffle", Merchant takes cash, Winner takes Item.
        // Given SolMarket context (Ecommerce), it's likely "Buy Ticket to win Item".
        // So:
        // 1. Funds (Ticket Sales) -> Merchant
        // 2. Winner gets... the conceptual Item? Or maybe we refund the ticket price?
        // Let's implement: Funds -> Merchant. Winner is marked. Off-chain delivery of item.
        // OR: Winner takes pot (50/50).
        // Let's go with: Merchant gets Ticket Sales. Winner is just recorded on-chain.
        // This is simplest for "Item Raffle".
        
        let total_funds = raffle.to_account_info().lamports();
        // Rent exempt reserve?
        let rent = Rent::get()?.minimum_balance(raffle.to_account_info().data_len());
        let payroll = total_funds.saturating_sub(rent);
        
        if payroll > 0 {
             let seeds: [&[u8]; 3] = [
                b"raffle",
                raffle.merchant.as_ref(),
                &[raffle.bump]
            ];
            let signer_seeds = [&seeds[..]];

            let cpi_accounts = system_program::Transfer {
                from: raffle.to_account_info(),
                to: ctx.accounts.merchant.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                cpi_accounts,
                &signer_seeds
            );
            system_program::transfer(cpi_ctx, payroll)?;
        }
        
        // We could close the raffle here? Or leave it for history.
        // Let's close ticket account to reclaim rent for winner.
        
        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct Raffle {
    pub merchant: Pubkey,
    pub category: u8,
    pub end_time_unix: i64,
    pub ticket_price_lamports: u64,
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
    pub system_program: Program<'info, System>,
    #[account(
        init,
        payer = payer,
        space = Raffle::DISCRIMINATOR.len() + Raffle::INIT_SPACE,
        seeds = [b"raffle", merchant.key().as_ref()],
        bump
    )]
    pub raffle: Account<'info, Raffle>,
    /// CHECK: Merchant authority
    pub merchant: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
    #[account(
        init,
        payer = buyer,
        space = Ticket::DISCRIMINATOR.len() + Ticket::INIT_SPACE,
        seeds = [b"ticket", raffle.key().as_ref(), &raffle.tickets_sold.to_le_bytes()],
        bump
    )]
    pub ticket: Account<'info, Ticket>,
}

#[derive(Accounts)]
pub struct PickWinner<'info> {
    #[account(mut)]
    pub authority: Signer<'info>, // Anybody can trigger pick winner to ensure fairness/liveness
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
}

#[derive(Accounts)]
pub struct ClaimPrize<'info> {
    #[account(mut)]
    pub winner: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
    #[account(
        mut, 
        close = winner, // Close ticket and return rent to winner
        seeds = [b"ticket", raffle.key().as_ref(), &ticket.index.to_le_bytes()],
        bump = ticket.bump
    )]
    pub ticket: Account<'info, Ticket>,
    /// CHECK: Merchant recipient
    #[account(mut, address = raffle.merchant)]
    pub merchant: UncheckedAccount<'info>,
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




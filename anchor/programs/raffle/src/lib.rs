#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
use anchor_lang::Discriminator;

declare_id!("11111111111111111111111111111111");

#[program]
pub mod raffle {
    use super::*;

    pub fn initialize_raffle(
        _ctx: Context<InitializeRaffle>,
        _category: u8,
        _end_time_unix: i64,
        _ticket_price_lamports: u64,
    ) -> Result<()> {
        Ok(())
    }

    pub fn buy_ticket(_ctx: Context<BuyTicket>) -> Result<()> {
        Ok(())
    }

    pub fn request_randomness(_ctx: Context<RequestRandomness>) -> Result<()> {
        Ok(())
    }

    pub fn set_winner(_ctx: Context<SetWinner>, _randomness: [u8; 32]) -> Result<()> {
        Ok(())
    }

    pub fn distribute_prize(_ctx: Context<DistributePrize>) -> Result<()> {
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
    pub winner: Option<Pubkey>,
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
    /// CHECK: Merchant authority for UI/reference
    pub merchant: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct BuyTicket<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
}

#[derive(Accounts)]
pub struct RequestRandomness<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
}

#[derive(Accounts)]
pub struct SetWinner<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
}

#[derive(Accounts)]
pub struct DistributePrize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut, seeds = [b"raffle", raffle.merchant.as_ref()], bump = raffle.bump)]
    pub raffle: Account<'info, Raffle>,
}




use anchor_lang::prelude::*;
use anchor_lang::Discriminator;
use anchor_lang::system_program;
use crate::state::{Config, EscrowStatus, SolEscrow};

pub const FEE_BPS_DEFAULT: u16 = 200; // 2%

#[derive(Accounts)]
pub struct InitializeConfig<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        init,
        payer = authority,
        space = Config::DISCRIMINATOR.len() + Config::INIT_SPACE,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: fee recipient wallet
    pub fee_recipient: UncheckedAccount<'info>,
}

pub fn initialize_config(ctx: Context<InitializeConfig>) -> Result<()> {
    let bump = ctx.bumps.config;
    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.fee_bps = FEE_BPS_DEFAULT;
    config.fee_recipient = ctx.accounts.fee_recipient.key();
    config.bump = bump;
    Ok(())
}

#[derive(Accounts)]
#[instruction(order_id: u64, amount_lamports: u64, expires_at: i64)]
pub struct InitializeEscrow<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: Buyer paying for the order; often equals payer
    pub buyer: UncheckedAccount<'info>,
    /// CHECK: Merchant receiving funds
    pub merchant: UncheckedAccount<'info>,
    #[account(
        init,
        payer = payer,
        space = SolEscrow::DISCRIMINATOR.len() + SolEscrow::INIT_SPACE,
        seeds = [b"sol-escrow", buyer.key().as_ref(), &order_id.to_le_bytes()],
        bump
    )]
    pub escrow: Account<'info, SolEscrow>,
}

pub fn initialize_escrow(
    ctx: Context<InitializeEscrow>,
    order_id: u64,
    amount_lamports: u64,
    expires_at: i64,
) -> Result<()> {
    require!(amount_lamports > 0, EscrowError::InvalidAmount);
    let now = Clock::get()?.unix_timestamp;
    require!(expires_at > now, EscrowError::InvalidExpiry);

    let escrow = &mut ctx.accounts.escrow;
    escrow.order_id = order_id;
    escrow.buyer = ctx.accounts.buyer.key();
    escrow.merchant = ctx.accounts.merchant.key();
    escrow.amount_lamports = amount_lamports;
    escrow.fee_bps = ctx.accounts.config.fee_bps;
    escrow.status = EscrowStatus::Pending as u8;
    escrow.bump = ctx.bumps.escrow;
    escrow.created_at = now;
    escrow.expires_at = expires_at;
    Ok(())
}

#[derive(Accounts)]
pub struct FundEscrow<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        mut,
        seeds = [b"sol-escrow", escrow.buyer.as_ref(), &escrow.order_id.to_le_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, SolEscrow>,
}

pub fn fund_escrow(ctx: Context<FundEscrow>) -> Result<()> {
    require!(ctx.accounts.escrow.status == EscrowStatus::Pending as u8, EscrowError::InvalidState);
    // Transfer SOL from buyer to escrow PDA
    let ix = system_program::Transfer {
        from: ctx.accounts.buyer.to_account_info(),
        to: ctx.accounts.escrow.to_account_info(),
    };
    let cpi = CpiContext::new(ctx.accounts.system_program.to_account_info(), ix);
    let amount = ctx.accounts.escrow.amount_lamports;
    system_program::transfer(cpi, amount)?;
    let escrow = &mut ctx.accounts.escrow;
    escrow.status = EscrowStatus::Funded as u8;
    Ok(())
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    /// Merchant or authority may release
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: payout recipient (merchant)
    #[account(mut)]
    pub merchant: UncheckedAccount<'info>,
    /// CHECK: fee recipient
    #[account(mut, address = config.fee_recipient)]
    pub fee_recipient: UncheckedAccount<'info>,
    #[account(
        mut,
        close = merchant,
        seeds = [b"sol-escrow", escrow.buyer.as_ref(), &escrow.order_id.to_le_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, SolEscrow>,
}

pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
    require!(ctx.accounts.escrow.status == EscrowStatus::Funded as u8, EscrowError::InvalidState);
    let now = Clock::get()?.unix_timestamp;
    // Allow release by merchant, or by config authority (platform), or after expiry
    let is_merchant = ctx.accounts.authority.key() == ctx.accounts.escrow.merchant;
    let is_authority = ctx.accounts.authority.key() == ctx.accounts.config.authority;
    require!(is_merchant || is_authority || now >= ctx.accounts.escrow.expires_at, EscrowError::Unauthorized);

    let total = ctx.accounts.escrow.amount_lamports as u128;
    let fee = total * (ctx.accounts.escrow.fee_bps as u128) / 10_000;
    let pay_merchant = total - fee;

    // Transfer from escrow PDA → merchant and fee_recipient
    let order_id_bytes = ctx.accounts.escrow.order_id.to_le_bytes();
    let seeds: [&[u8]; 4] = [b"sol-escrow", ctx.accounts.escrow.buyer.as_ref(), &order_id_bytes, &[ctx.accounts.escrow.bump]];
    let signer_seeds = [&seeds[..]];
    let ix_m = system_program::Transfer {
        from: ctx.accounts.escrow.to_account_info(),
        to: ctx.accounts.merchant.to_account_info(),
    };
    let cpi_m = CpiContext::new_with_signer(ctx.accounts.system_program.to_account_info(), ix_m, &signer_seeds);
    system_program::transfer(cpi_m, pay_merchant as u64)?;

    if fee > 0 {
        let ix_f = system_program::Transfer {
            from: ctx.accounts.escrow.to_account_info(),
            to: ctx.accounts.fee_recipient.to_account_info(),
        };
        let cpi_f = CpiContext::new_with_signer(ctx.accounts.system_program.to_account_info(), ix_f, &signer_seeds);
        system_program::transfer(cpi_f, fee as u64)?;
    }

    let escrow = &mut ctx.accounts.escrow;
    escrow.status = EscrowStatus::Released as u8;
    Ok(())
}

#[derive(Accounts)]
pub struct RefundEscrow<'info> {
    /// Buyer or authority may refund
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: refund recipient (buyer)
    #[account(mut)]
    pub buyer_account: UncheckedAccount<'info>,
    #[account(
        mut,
        close = buyer_account,
        seeds = [b"sol-escrow", escrow.buyer.as_ref(), &escrow.order_id.to_le_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, SolEscrow>,
}

pub fn refund_escrow(ctx: Context<RefundEscrow>) -> Result<()> {
    let status = ctx.accounts.escrow.status;
    require!(status == EscrowStatus::Funded as u8 || status == EscrowStatus::Pending as u8, EscrowError::InvalidState);
    let now = Clock::get()?.unix_timestamp;
    let is_buyer = ctx.accounts.authority.key() == ctx.accounts.escrow.buyer;
    let is_authority = ctx.accounts.authority.key() == ctx.accounts.config.authority;
    require!(is_buyer || is_authority || now >= ctx.accounts.escrow.expires_at, EscrowError::Unauthorized);

    // Transfer from escrow PDA → buyer
    let order_id_bytes = ctx.accounts.escrow.order_id.to_le_bytes();
    let seeds: [&[u8]; 4] = [b"sol-escrow", ctx.accounts.escrow.buyer.as_ref(), &order_id_bytes, &[ctx.accounts.escrow.bump]];
    let signer_seeds = [&seeds[..]];
    let ix_b = system_program::Transfer {
        from: ctx.accounts.escrow.to_account_info(),
        to: ctx.accounts.buyer_account.to_account_info(),
    };
    let cpi_b = CpiContext::new_with_signer(ctx.accounts.system_program.to_account_info(), ix_b, &signer_seeds);
    system_program::transfer(cpi_b, ctx.accounts.escrow.amount_lamports)?;

    let escrow = &mut ctx.accounts.escrow;
    escrow.status = EscrowStatus::Refunded as u8;
    Ok(())
}

#[derive(Accounts)]
pub struct ExpireEscrow<'info> {
    pub system_program: Program<'info, System>,
    #[account(
        seeds = [b"config"],
        bump = config.bump
    )]
    pub config: Account<'info, Config>,
    /// CHECK: refund recipient (buyer)
    #[account(mut)]
    pub buyer_account: UncheckedAccount<'info>,
    #[account(
        mut,
        close = buyer_account,
        seeds = [b"sol-escrow", escrow.buyer.as_ref(), &escrow.order_id.to_le_bytes()],
        bump = escrow.bump
    )]
    pub escrow: Account<'info, SolEscrow>,
}

pub fn expire_escrow(ctx: Context<ExpireEscrow>) -> Result<()> {
    let now = Clock::get()?.unix_timestamp;
    require!(now >= ctx.accounts.escrow.expires_at, EscrowError::NotExpired);
    // use refund logic without signer (escrow signs)
    let order_id_bytes = ctx.accounts.escrow.order_id.to_le_bytes();
    let seeds: [&[u8]; 4] = [b"sol-escrow", ctx.accounts.escrow.buyer.as_ref(), &order_id_bytes, &[ctx.accounts.escrow.bump]];
    let signer_seeds = [&seeds[..]];
    let ix_b = system_program::Transfer {
        from: ctx.accounts.escrow.to_account_info(),
        to: ctx.accounts.buyer_account.to_account_info(),
    };
    let cpi_b = CpiContext::new_with_signer(ctx.accounts.system_program.to_account_info(), ix_b, &signer_seeds);
    system_program::transfer(cpi_b, ctx.accounts.escrow.amount_lamports)?;
    Ok(())
}

#[error_code]
pub enum EscrowError {
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Invalid expiry")]
    InvalidExpiry,
    #[msg("Invalid state")]
    InvalidState,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Not expired")]
    NotExpired,
}






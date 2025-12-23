use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};

declare_id!("BLyc8iNGvz1mYRWGZdRku1fAQdhKLpMatX4DKf2FREPt");

#[program]
pub mod swap {
    use super::*;

    pub fn initialize_vault(ctx: Context<InitializeVault>) -> Result<()> {
        ctx.accounts.vault_pda.bump = ctx.bumps.vault_pda;
        msg!("Swap vault initialized with bump {}", ctx.accounts.vault_pda.bump);
        Ok(())
    }

    pub fn swap_sol_to_mkn(ctx: Context<SwapSolToMkn>, sol_amount_lamports: u64) -> Result<()> {
        require!(sol_amount_lamports >= 10, SwapError::AmountTooSmall);
        
        let mkn_amount = sol_amount_lamports / 10;
        
        // 1. Transfer SOL from user to vault PDA
        anchor_lang::solana_program::program::invoke(
            &anchor_lang::solana_program::system_instruction::transfer(
                &ctx.accounts.user.key(),
                &ctx.accounts.vault_pda.key(),
                sol_amount_lamports,
            ),
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.vault_pda.to_account_info(),
            ],
        )?;

        // 2. Transfer MKN from vault token account to user
        let seeds = &[
            b"vault".as_ref(),
            &[ctx.accounts.vault_pda.bump],
        ];
        let signer = &[&seeds[..]];

        let cpi_accounts = Transfer {
            from: ctx.accounts.vault_token_account.to_account_info(),
            to: ctx.accounts.user_token_account.to_account_info(),
            authority: ctx.accounts.vault_pda.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
        
        token::transfer(cpi_ctx, mkn_amount)?;

        msg!("Swapped {} lamports for {} MKN units", sol_amount_lamports, mkn_amount);
        Ok(())
    }

    pub fn swap_mkn_to_sol(ctx: Context<SwapMknToSol>, mkn_amount_units: u64) -> Result<()> {
        let sol_amount = mkn_amount_units.checked_mul(10).ok_or(SwapError::MathOverflow)?;
        
        // 1. Transfer MKN from user to vault token account
        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.vault_token_account.to_account_info(),
            authority: ctx.accounts.user.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        
        token::transfer(cpi_ctx, mkn_amount_units)?;

        // 2. Transfer SOL from vault PDA to user
        require!(
            **ctx.accounts.vault_pda.to_account_info().lamports.borrow() >= sol_amount,
            SwapError::InsufficientSolInVault
        );

        **ctx.accounts.vault_pda.to_account_info().try_borrow_mut_lamports()? -= sol_amount;
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? += sol_amount;

        msg!("Swapped {} MKN units for {} lamports", mkn_amount_units, sol_amount);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeVault<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = 8 + 8, // marker + bump
        seeds = [b"mkn_vault"],
        bump
    )]
    pub vault_pda: Account<'info, VaultState>,

    pub mkn_mint: Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        token::mint = mkn_mint,
        token::authority = vault_pda,
        seeds = [b"mkn_vault_token"],
        bump
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SwapSolToMkn<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"vault"],
        bump = vault_pda.bump
    )]
    pub vault_pda: Account<'info, VaultState>,

    #[account(
        mut,
        constraint = vault_token_account.owner == vault_pda.key()
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SwapMknToSol<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"mkn_vault"],
        bump = vault_pda.bump
    )]
    pub vault_pda: Account<'info, VaultState>,

    #[account(
        mut,
        constraint = vault_token_account.owner == vault_pda.key()
    )]
    pub vault_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct VaultState {
    pub bump: u8,
}

#[error_code]
pub enum SwapError {
    #[msg("Amount too small to swap")]
    AmountTooSmall,
    #[msg("Insufficient SOL in vault for swap")]
    InsufficientSolInVault,
    #[msg("Math overflow")]
    MathOverflow,
}

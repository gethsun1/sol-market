#!/usr/bin/env node

/**
 * Smart Contract Deployment Script for SolMarket
 * 
 * This script deploys the Anchor programs to devnet and updates
 * the frontend configuration with the new program IDs.
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Starting SolMarket Smart Contract Deployment to Devnet...\n')

// ANSI colors for better output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function runCommand(command, description) {
  log(`\n📋 ${description}`, 'blue')
  try {
    const output = execSync(command, { cwd: path.join(__dirname, '../anchor'), stdio: 'inherit' })
    log(`✅ ${description} completed successfully`, 'green')
    return output
  } catch (error) {
    log(`❌ ${description} failed:`, 'red')
    log(error.message, 'red')
    process.exit(1)
  }
}

// Check if Solana CLI is installed and configured
function checkSolanaSetup() {
  log('\n🔍 Checking Solana setup...', 'yellow')
  try {
    const version = execSync('solana --version', { stdio: 'pipe' }).toString().trim()
    log(`✅ Solana CLI: ${version}`, 'green')
    
    const cluster = execSync('solana config get', { stdio: 'pipe' }).toString()
    if (cluster.includes('devnet')) {
      log('✅ Already configured for devnet', 'green')
    } else {
      log('⚠️  Setting cluster to devnet...', 'yellow')
      execSync('solana config set --url devnet', { stdio: 'inherit' })
    }
    
    // Check wallet balance
    try {
      const balance = execSync('solana balance', { stdio: 'pipe' }).toString().trim()
      log(`💰 Wallet balance: ${balance}`, 'blue')
    } catch (error) {
      log('⚠️  No SOL in wallet or wallet not configured', 'yellow')
      log('💡 Run: solana airdrop 2 devnet', 'yellow')
    }
  } catch (error) {
    log('❌ Solana CLI not found. Please install it first:', 'red')
    log('curl -sSf https://release.solana.com/v1.18.4/install | sh', 'blue')
    process.exit(1)
  }
}

// Deploy contracts
function deployContracts() {
  log('\n🏗️  Building and deploying contracts...', 'yellow')
  
  // Change to anchor directory
  const anchorDir = path.join(__dirname, '../anchor')
  process.chdir(anchorDir)
  
  // Build programs (using cargo build to avoid lock file issues)
  runCommand('rm -f Cargo.lock && cargo build --release', 'Building Anchor programs')
  
  // Build individual programs that might be missing
  runCommand('cargo build --release --manifest-path=programs/auction/Cargo.toml', 'Building auction program')
  runCommand('cargo build --release --manifest-path=programs/raffle/Cargo.toml', 'Building raffle program')
  
  // Copy built programs to deploy directory
  runCommand('mkdir -p target/deploy && cp target/release/libsolmarket.so target/deploy/solmarket.so', 'Copying solmarket program to deploy directory')
  
  // Deploy to devnet
  runCommand('anchor deploy --provider.cluster devnet', 'Deploying to devnet')
  
  // Update program IDs in frontend
  log('\n🔄 Updating frontend configuration...', 'yellow')
  updateFrontendConfig()
}

// Update frontend configuration with deployed program IDs
function updateFrontendConfig() {
  try {
    // Read Anchor.toml to get deployed program IDs
    const anchorTomlPath = path.join(__dirname, '../anchor/Anchor.toml')
    const anchorToml = fs.readFileSync(anchorTomlPath, 'utf8')
    
    // Extract program IDs using regex
    const escrowMatch = anchorToml.match(/escrow = "([^"]+)"/)
    const raffleMatch = anchorToml.match(/raffle = "([^"]+)"/)
    const auctionMatch = anchorToml.match(/auction = "([^"]+)"/)
    
    if (escrowMatch) {
      const escrowProgramId = escrowMatch[1]
      log(`✅ Escrow Program ID: ${escrowProgramId}`, 'green')
      
      // Update Solana escrow service
      const escrowServicePath = path.join(__dirname, '../lib/solana-escrow.ts')
      let escrowService = fs.readFileSync(escrowServicePath, 'utf8')
      escrowService = escrowService.replace(
        /const ESCROW_PROGRAM_ID = new PublicKey\("[^"]+"\)/,
        `const ESCROW_PROGRAM_ID = new PublicKey("${escrowProgramId}")`
      )
      fs.writeFileSync(escrowServicePath, escrowService)
      log('✅ Updated escrow service with new program ID', 'green')
    }
    
    if (raffleMatch) {
      log(`✅ Raffle Program ID: ${raffleMatch[1]}`, 'green')
    }
    
    if (auctionMatch) {
      log(`✅ Auction Program ID: ${auctionMatch[1]}`, 'green')
    }
    
  } catch (error) {
    log('⚠️  Could not update frontend configuration:', 'yellow')
    log(error.message, 'yellow')
  }
}

// Create deployment summary
function createDeploymentSummary() {
  log('\n📊 Deployment Summary', 'blue')
  log('==================', 'blue')
  log('✅ Smart contracts deployed to Solana devnet', 'green')
  log('✅ Frontend configuration updated', 'green')
  log('✅ Explorer URLs ready', 'green')
  
  log('\n🌐 Explorer URLs:', 'blue')
  log('https://explorer.solana.com/?cluster=devnet', 'blue')
  
  log('\n📋 Next Steps:', 'yellow')
  log('1. Test the deployed contracts on devnet', 'yellow')
  log('2. Update frontend to use new program IDs', 'yellow')
  log('3. Run integration tests', 'yellow')
  log('4. Deploy to Vercel when ready', 'yellow')
  
  log('\n🎉 Deployment completed successfully!', 'green')
}

// Main execution
function main() {
  try {
    checkSolanaSetup()
    deployContracts()
    createDeploymentSummary()
  } catch (error) {
    log(`\n❌ Deployment failed: ${error.message}`, 'red')
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = { main, checkSolanaSetup, deployContracts }

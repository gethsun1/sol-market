#!/usr/bin/env node

/**
 * Demo Data Seeding Script for SolMarket
 * 
 * This script populates the database with realistic demo data
 * for testing and demonstration purposes.
 */

const { sql } = require('../lib/db')

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

// Demo data
const demoMerchants = [
  {
    name: 'Solana Merch',
    wallet_address: 'merchant1_demo_wallet_address',
  },
  {
    name: 'Devnet Goods',
    wallet_address: 'merchant2_demo_wallet_address',
  },
  {
    name: 'Web3 Marketplace',
    wallet_address: 'merchant3_demo_wallet_address',
  }
]

const demoProducts = [
  {
    name: 'Solana Hoodie',
    description: 'Premium quality hoodie with Solana logo',
    category: 'Clothing',
    price_lamports: 5000000000, // 5 SOL
    image_url: 'https://res.cloudinary.com/demo/solmarket/hoodie.jpg'
  },
  {
    name: 'Crypto Trading Course',
    description: 'Complete cryptocurrency trading masterclass',
    category: 'Education',
    price_lamports: 2000000000, // 2 SOL
    image_url: 'https://res.cloudinary.com/demo/solmarket/course.jpg'
  },
  {
    name: 'Web3 Development Kit',
    description: 'Everything you need to start Web3 development',
    category: 'Development',
    price_lamports: 3000000000, // 3 SOL
    image_url: 'https://res.cloudinary.com/demo/solmarket/devkit.jpg'
  },
  {
    name: 'NFT Art Collection',
    description: 'Exclusive digital art collection',
    category: 'Digital Art',
    price_lamports: 10000000000, // 10 SOL
    image_url: 'https://res.cloudinary.com/demo/solmarket/nft.jpg'
  },
  {
    name: 'DeFi Trading Bot',
    description: 'Automated trading bot for DeFi protocols',
    category: 'Software',
    price_lamports: 7500000000, // 7.5 SOL
    image_url: 'https://res.cloudinary.com/demo/solmarket/bot.jpg'
  }
]

const demoAuctions = [
  {
    title: 'Rare Solana NFT #001',
    description: 'One of a kind Solana NFT from genesis collection',
    starting_price: 10000000000, // 10 SOL
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    goodwill_message: 'Proceeds support Solana ecosystem development',
    social_media_handle: '@solana_creator'
  },
  {
    title: 'Web3 Masterclass Access',
    description: 'Lifetime access to premium Web3 development course',
    starting_price: 5000000000, // 5 SOL
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    goodwill_message: 'Helping developers enter Web3 space',
    social_media_handle: '@web3_teacher'
  }
]

const demoRaffles = [
  {
    title: 'MacBook Pro raffle',
    description: 'Brand new MacBook Pro for one lucky winner',
    sector: 'Technology',
    ticket_price: 100000000, // 0.1 SOL
    max_raffle_slots: 1000,
    end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
  },
  {
    title: 'Solana NFT Bundle',
    description: 'Collection of 10 exclusive Solana NFTs',
    sector: 'Digital Art',
    ticket_price: 50000000, // 0.05 SOL
    max_raffle_slots: 500,
    end_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days from now
  }
]

// Seed functions
async function seedMerchants() {
  log('\n🏪 Seeding merchants...', 'yellow')
  
  for (const merchant of demoMerchants) {
    try {
      await sql`
        INSERT INTO merchant (name, wallet_address)
        VALUES (${merchant.name}, ${merchant.wallet_address})
        ON CONFLICT (wallet_address) DO NOTHING
      `
      log(`✅ Created merchant: ${merchant.name}`, 'green')
    } catch (error) {
      log(`❌ Failed to create merchant: ${merchant.name}`, 'red')
      log(error.message, 'red')
    }
  }
}

async function seedProducts() {
  log('\n📦 Seeding products...', 'yellow')
  
  const merchants = await sql`SELECT id, wallet_address FROM merchant`
  
  for (const product of demoProducts) {
    try {
      const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)]
      await sql`
        INSERT INTO product (merchant_id, name, description, category, price_lamports, image_url)
        VALUES (${randomMerchant.id}, ${product.name}, ${product.description}, ${product.category}, ${product.price_lamports}, ${product.image_url})
        ON CONFLICT DO NOTHING
      `
      log(`✅ Created product: ${product.name} (${product.price_lamports / 1000000000} SOL)`, 'green')
    } catch (error) {
      log(`❌ Failed to create product: ${product.name}`, 'red')
      log(error.message, 'red')
    }
  }
}

async function seedAuctions() {
  log('\n🔨 Seeding auctions...', 'yellow')
  
  const merchants = await sql`SELECT id, wallet_address FROM merchant`
  
  for (const auction of demoAuctions) {
    try {
      const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)]
      await sql`
        INSERT INTO auctions (seller_id, title, description, starting_price, current_price, end_date, goodwill_message, social_media_handle)
        VALUES (${randomMerchant.id}, ${auction.title}, ${auction.description}, ${auction.starting_price}, ${auction.starting_price}, ${auction.end_date}, ${auction.goodwill_message}, ${auction.social_media_handle})
        ON CONFLICT DO NOTHING
      `
      log(`✅ Created auction: ${auction.title} (${auction.starting_price / 1000000000} SOL)`, 'green')
    } catch (error) {
      log(`❌ Failed to create auction: ${auction.title}`, 'red')
      log(error.message, 'red')
    }
  }
}

async function seedRaffles() {
  log('\n🎟️  Seeding raffles...', 'yellow')
  
  const merchants = await sql`SELECT id, wallet_address FROM merchant`
  
  for (const raffle of demoRaffles) {
    try {
      const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)]
      await sql`
        INSERT INTO raffles (merchant_id, title, description, sector, ticket_price, max_raffle_slots, end_date)
        VALUES (${randomMerchant.id}, ${raffle.title}, ${raffle.description}, ${raffle.sector}, ${raffle.ticket_price}, ${raffle.max_raffle_slots}, ${raffle.end_date})
        ON CONFLICT DO NOTHING
      `
      log(`✅ Created raffle: ${raffle.title} (${raffle.ticket_price / 1000000000} SOL per ticket)`, 'green')
    } catch (error) {
      log(`❌ Failed to create raffle: ${raffle.title}`, 'red')
      log(error.message, 'red')
    }
  }
}

async function createDemoUsers() {
  log('\n👥 Creating demo users...', 'yellow')
  
  const demoUsers = [
    {
      wallet_address: 'demo_buyer_1_wallet',
      username: 'DemoBuyer1',
      email: 'buyer1@demo.solmarket'
    },
    {
      wallet_address: 'demo_buyer_2_wallet',
      username: 'DemoBuyer2',
      email: 'buyer2@demo.solmarket'
    },
    {
      wallet_address: 'demo_seller_1_wallet',
      username: 'DemoSeller1',
      email: 'seller1@demo.solmarket'
    }
  ]
  
  for (const user of demoUsers) {
    try {
      await sql`
        INSERT INTO users (wallet_address, username, email)
        VALUES (${user.wallet_address}, ${user.username}, ${user.email})
        ON CONFLICT (wallet_address) DO NOTHING
      `
      log(`✅ Created user: ${user.username}`, 'green')
    } catch (error) {
      log(`❌ Failed to create user: ${user.username}`, 'red')
      log(error.message, 'red')
    }
  }
}

// Main seeding function
async function seedDemoData() {
  log('🌱 Starting demo data seeding for SolMarket...', 'blue')
  log('==========================================', 'blue')
  
  try {
    await createDemoUsers()
    await seedMerchants()
    await seedProducts()
    await seedAuctions()
    await seedRaffles()
    
    log('\n🎉 Demo data seeding completed successfully!', 'green')
    log('\n📊 Seeding Summary:', 'blue')
    log(`- ${demoMerchants.length} Merchants`, 'yellow')
    log(`- ${demoProducts.length} Products`, 'yellow')
    log(`- ${demoAuctions.length} Auctions`, 'yellow')
    log(`- ${demoRaffles.length} Raffles`, 'yellow')
    log(`- 3 Demo users`, 'yellow')
    
    log('\n🌐 You can now test the demo at: http://localhost:3000', 'blue')
    
  } catch (error) {
    log('\n❌ Demo data seeding failed:', 'red')
    log(error.message, 'red')
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  seedDemoData()
}

module.exports = { seedDemoData }

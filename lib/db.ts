import { neon } from "@neondatabase/serverless"
import { env } from "./env"

// Initialize Neon SQL client with validated environment
const sql = neon(env.DATABASE_URL)

export { sql }

// Database schema initialization
export async function initializeDatabase() {
  try {
    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        profile_image_url VARCHAR(255),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // User wallets table
    await sql`
      CREATE TABLE IF NOT EXISTS user_wallets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        sol_balance DECIMAL(20, 8) DEFAULT 0,
        token_balance DECIMAL(20, 8) DEFAULT 0,
        escrow_balance DECIMAL(20, 8) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Marketplace listings table
    await sql`
      CREATE TABLE IF NOT EXISTS listings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(20, 8) NOT NULL,
        image_url VARCHAR(255),
        category VARCHAR(100),
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Transactions table
    await sql`
      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        buyer_id UUID NOT NULL REFERENCES users(id),
        seller_id UUID NOT NULL REFERENCES users(id),
        listing_id UUID NOT NULL REFERENCES listings(id),
        amount DECIMAL(20, 8) NOT NULL,
        escrow_address VARCHAR(255),
        status VARCHAR(50) DEFAULT 'pending',
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Token exchange records table
    await sql`
      CREATE TABLE IF NOT EXISTS token_exchanges (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        sol_amount DECIMAL(20, 8) NOT NULL,
        token_amount DECIMAL(20, 8) NOT NULL,
        exchange_rate DECIMAL(20, 8) NOT NULL,
        status VARCHAR(50) DEFAULT 'completed',
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // News and Web3 Trade articles table
    await sql`
      CREATE TABLE IF NOT EXISTS news_articles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(500) NOT NULL,
        content TEXT NOT NULL,
        category VARCHAR(100),
        image_url VARCHAR(255),
        summary VARCHAR(500),
        views_count INT DEFAULT 0,
        published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Raffles table
    await sql`
      CREATE TABLE IF NOT EXISTS raffles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        merchant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        sector VARCHAR(100) NOT NULL,
        prize_product_id UUID REFERENCES listings(id),
        ticket_price DECIMAL(20, 8) NOT NULL,
        total_tickets INT DEFAULT 0,
        max_raffle_slots INT DEFAULT 1000,
        status VARCHAR(50) DEFAULT 'active',
        start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        end_date TIMESTAMP NOT NULL,
        winner_id UUID REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Raffle entries/tickets table
    await sql`
      CREATE TABLE IF NOT EXISTS raffle_entries (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        raffle_id UUID NOT NULL REFERENCES raffles(id) ON DELETE CASCADE,
        buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        ticket_count INT DEFAULT 1,
        amount_paid DECIMAL(20, 8) NOT NULL,
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Auctions table
    await sql`
      CREATE TABLE IF NOT EXISTS auctions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID REFERENCES listings(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        starting_price DECIMAL(20, 8) NOT NULL,
        current_price DECIMAL(20, 8) NOT NULL,
        current_bidder_id UUID REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'active',
        end_date TIMESTAMP NOT NULL,
        goodwill_message TEXT,
        social_media_handle VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Auction bids table
    await sql`
      CREATE TABLE IF NOT EXISTS auction_bids (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        auction_id UUID NOT NULL REFERENCES auctions(id) ON DELETE CASCADE,
        bidder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        bid_amount DECIMAL(20, 8) NOT NULL,
        transaction_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Currency exchange rates table (for caching rates)
    await sql`
      CREATE TABLE IF NOT EXISTS currency_rates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        currency_code VARCHAR(10) NOT NULL,
        currency_name VARCHAR(100) NOT NULL,
        rate_to_sol DECIMAL(20, 8) NOT NULL,
        rate_to_usd DECIMAL(20, 8),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Merchants & catalog (for product/cart/order flows)
    await sql`
      CREATE TABLE IF NOT EXISTS merchant (
        id BIGSERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        wallet_address TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS product (
        id BIGSERIAL PRIMARY KEY,
        merchant_id BIGINT NOT NULL REFERENCES merchant(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        price_lamports BIGINT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS discount (
        id BIGSERIAL PRIMARY KEY,
        product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        percent INTEGER NOT NULL CHECK (percent >= 0 AND percent <= 100),
        starts_at TIMESTAMP,
        ends_at TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS cart (
        id BIGSERIAL PRIMARY KEY,
        client_wallet TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`CREATE INDEX IF NOT EXISTS idx_cart_client_wallet ON cart(client_wallet)`
    await sql`
      CREATE TABLE IF NOT EXISTS cart_item (
        id BIGSERIAL PRIMARY KEY,
        cart_id BIGINT NOT NULL REFERENCES cart(id) ON DELETE CASCADE,
        product_id BIGINT NOT NULL REFERENCES product(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0)
      )
    `
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_cart_item_unique ON cart_item(cart_id, product_id)`
    await sql`
      CREATE TABLE IF NOT EXISTS orders (
        id BIGSERIAL PRIMARY KEY,
        cart_id BIGINT REFERENCES cart(id),
        merchant_id BIGINT NOT NULL REFERENCES merchant(id),
        client_wallet TEXT NOT NULL,
        escrow_account TEXT,
        total_lamports BIGINT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_tx TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    await sql`
      CREATE TABLE IF NOT EXISTS order_item (
        id BIGSERIAL PRIMARY KEY,
        order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id BIGINT NOT NULL REFERENCES product(id),
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price_lamports BIGINT NOT NULL
      )
    `

    console.log("Database initialized successfully with new tables")
  } catch (error) {
    console.error("Database initialization error:", error)
    throw error
  }
}

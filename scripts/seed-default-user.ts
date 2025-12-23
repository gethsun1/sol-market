// Load environment variables from .env.local BEFORE any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { sql } from '../lib/db';

async function main() {
  console.log('Creating default user for listing creation...');

  try {
    // Create a default user for listings
    const defaultUserId = '550e8400-e29b-41d4-a716-446655440000';

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE id = ${defaultUserId}
    `;

    if (existing.length > 0) {
      console.log('✅ Default user already exists');
      return;
    }

    // Create default user
    await sql`
      INSERT INTO users (id, wallet_address, username, email, bio)
      VALUES (
        ${defaultUserId},
        'BGYQyZsXwJeUgBfduGSmMJ3ouVaeii47wuw88qN8tgsE',
        'platform_admin',
        'admin@solmarket.dev',
        'Platform default user for marketplace listings'
      )
    `;

    console.log('✅ Default user created successfully!');
  } catch (error) {
    console.error('❌ Failed to create default user:', error);
    process.exit(1);
  }
}

main();

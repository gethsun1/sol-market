// Load environment variables from .env.local BEFORE any other imports
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { initializeDatabase } from '../lib/db';

async function main() {
    console.log('Initializing database schema...');

    try {
        await initializeDatabase();
        console.log('✅ Database initialized successfully!');
    } catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}

main();

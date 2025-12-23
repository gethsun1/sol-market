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

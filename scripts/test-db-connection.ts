// Simple test to verify DATABASE_URL connection
import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import { neon } from '@neondatabase/serverless';

async function testConnection() {
    console.log('Testing Neon database connection...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('DATABASE_URL starts with:', process.env.DATABASE_URL?.substring(0, 20) + '...');

    try {
        const sql = neon(process.env.DATABASE_URL!);

        // Simple query to test connection
        const result = await sql`SELECT NOW() as current_time`;

        console.log('✅ Connection successful!');
        console.log('Database time:', result[0].current_time);

        // Test if we can query tables
        const tables = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            LIMIT 5
        `;

        console.log('✅ Found', tables.length, 'tables');
        if (tables.length > 0) {
            console.log('Tables:', tables.map(t => t.table_name).join(', '));
        }

    } catch (error: any) {
        console.error('❌ Connection failed!');
        console.error('Error type:', error.constructor.name);
        console.error('Error message:', error.message);

        if (error.code === 'ETIMEDOUT') {
            console.log('\n🔍 Timeout error suggests:');
            console.log('1. Database might be suspended (Neon free tier suspends after inactivity)');
            console.log('2. Network/firewall blocking connection');
            console.log('3. DATABASE_URL might be incorrect');
            console.log('\n💡 Try:');
            console.log('- Visit your Neon dashboard and wake the database');
            console.log('- Check if DATABASE_URL is correct');
            console.log('- Try connecting from Vercel instead of locally');
        }

        throw error;
    }
}

testConnection();

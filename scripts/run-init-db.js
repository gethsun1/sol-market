#!/usr/bin/env node

// Load .env.local before ANYTHING else
require('dotenv').config({ path: require('path').resolve(process.cwd(), '.env.local') });

// Now run the init script
require('tsx/cli').main(['run', 'scripts/init-db.ts']);

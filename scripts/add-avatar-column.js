const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local if it exists
let directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join('=').trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (key === 'DIRECT_URL') {
          directUrl = value;
        } else if (key === 'DATABASE_URL' && !directUrl) {
          directUrl = value;
        }
      }
    }
  }
} catch (e) {
  console.warn('Warning: Could not read .env.local file.', e.message);
}

if (!directUrl) {
  console.error('Error: Connection string (DIRECT_URL or DATABASE_URL) not found.');
  process.exit(1);
}

async function run() {
  const client = new Client({ connectionString: directUrl });
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');

    const query = `
      ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS avatar_url TEXT;
      ALTER TABLE "EmployeeUser" ADD COLUMN IF NOT EXISTS avatar_url TEXT;
    `;

    await client.query(query);
    console.log('Migration completed successfully: avatar_url column added to AdminUser and EmployeeUser tables.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();

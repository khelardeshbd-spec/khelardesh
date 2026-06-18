const { Client } = require('pg');

const directUrl = process.env.DIRECT_URL || "postgresql://postgres.uvuqxixoncdbjupupxow:ShahMdEliausKomol@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function run() {
  const client = new Client({
    connectionString: directUrl,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");

    // Create SiteUser table if it doesn't exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "SiteUser" (
        "id" SERIAL PRIMARY KEY,
        "email" TEXT UNIQUE NOT NULL,
        "name" TEXT,
        "image" TEXT,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        "lastLoginAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createTableQuery);
    console.log("Table 'SiteUser' verified/created successfully.");

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    await client.end();
  }
}

run();

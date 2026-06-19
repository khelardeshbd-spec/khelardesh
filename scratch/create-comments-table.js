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

    // Create Comment table if it doesn't exist
    // Using Article(id) as foreign key (but let's reference articleSlug as it's easier to query and handle)
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS "Comment" (
        "id" SERIAL PRIMARY KEY,
        "articleSlug" TEXT NOT NULL,
        "userEmail" TEXT NOT NULL,
        "userName" TEXT,
        "userImage" TEXT,
        "body" TEXT NOT NULL,
        "parentId" INTEGER REFERENCES "Comment"(id) ON DELETE CASCADE,
        "isReporter" BOOLEAN NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS "Comment_articleSlug_idx" ON "Comment"("articleSlug");
      CREATE INDEX IF NOT EXISTS "Comment_parentId_idx" ON "Comment"("parentId");
    `;

    await client.query(createTableQuery);
    console.log("Table 'Comment' verified/created successfully.");

  } catch (err) {
    console.error("Database operation failed:", err);
  } finally {
    await client.end();
  }
}

run();

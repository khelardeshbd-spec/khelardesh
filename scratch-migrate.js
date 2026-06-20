const { Client } = require('pg');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const directUrlLine = envFile.split('\n').find(line => line.startsWith('DIRECT_URL='));
const directUrl = directUrlLine ? directUrlLine.split('=')[1].trim().replace(/^"|"$/g, '') : "postgresql://postgres.uvuqxixoncdbjupupxow:ShahMdEliausKomol@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function run() {
  const client = new Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database.");

    // Add likes and dislikes to Comment table if they don't exist
    await client.query(`
      ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "likes" INTEGER DEFAULT 0;
      ALTER TABLE "Comment" ADD COLUMN IF NOT EXISTS "dislikes" INTEGER DEFAULT 0;
    `);
    console.log("Updated Comment table with likes and dislikes.");

    // Create CommentReaction table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "CommentReaction" (
        "id" SERIAL PRIMARY KEY,
        "commentId" INTEGER REFERENCES "Comment"(id) ON DELETE CASCADE,
        "userEmail" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("commentId", "userEmail")
      );
      CREATE INDEX IF NOT EXISTS "CommentReaction_commentId_idx" ON "CommentReaction"("commentId");
      CREATE INDEX IF NOT EXISTS "CommentReaction_userEmail_idx" ON "CommentReaction"("userEmail");
    `);
    console.log("Created CommentReaction table.");

    // Create AdminNotification table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "AdminNotification" (
        "id" SERIAL PRIMARY KEY,
        "type" TEXT NOT NULL,
        "articleSlug" TEXT NOT NULL,
        "commentId" INTEGER REFERENCES "Comment"(id) ON DELETE CASCADE,
        "actorName" TEXT,
        "actorEmail" TEXT,
        "read" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Created AdminNotification table.");

    // Create UserNotification table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "UserNotification" (
        "id" SERIAL PRIMARY KEY,
        "userEmail" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "commentId" INTEGER REFERENCES "Comment"(id) ON DELETE CASCADE,
        "actorName" TEXT,
        "read" BOOLEAN DEFAULT false,
        "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS "UserNotification_userEmail_idx" ON "UserNotification"("userEmail");
    `);
    console.log("Created UserNotification table.");

    // Enable realtime for notifications
    // Supabase handles realtime via publications
    // Check if the publication 'supabase_realtime' exists, and add tables to it.
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1 
          FROM pg_publication 
          WHERE pubname = 'supabase_realtime'
        ) THEN
          ALTER PUBLICATION supabase_realtime ADD TABLE "AdminNotification";
          ALTER PUBLICATION supabase_realtime ADD TABLE "UserNotification";
        END IF;
      EXCEPTION
        WHEN OTHERS THEN
          -- Ignore errors if tables are already in publication
          NULL;
      END;
      $$;
    `);
    console.log("Realtime publication updated (if exists).");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();

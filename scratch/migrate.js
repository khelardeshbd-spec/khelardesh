const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.uvuqxixoncdbjupupxow:ShahMdEliausKomol@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
});

async function run() {
  await client.connect();
  try {
    const res = await client.query('ALTER TABLE "Article" ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;');
    console.log('Successfully added views column:', res);
  } catch (err) {
    if (err.message.includes('already exists')) {
      console.log('Column already exists, ignoring.');
    } else {
      console.error('Error:', err);
    }
  } finally {
    await client.end();
  }
}

run();

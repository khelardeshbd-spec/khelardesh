const { Client } = require('pg');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const directUrlLine = envFile.split('\n').find(line => line.startsWith('DIRECT_URL='));
const directUrl = directUrlLine ? directUrlLine.split('=')[1].trim().replace(/^"|"$/g, '') : "postgresql://postgres.uvuqxixoncdbjupupxow:ShahMdEliausKomol@aws-1-ap-south-1.pooler.supabase.com:5432/postgres";

async function run() {
  const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const res = await client.query('SELECT * FROM "AdminNotification" LIMIT 1');
    console.log(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();

const { Client } = require('pg');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const directUrlLine = envFile.split('\n').find(line => line.startsWith('DIRECT_URL='));
const directUrl = directUrlLine ? directUrlLine.split('=')[1].trim().replace(/^"|"$/g, '') : "";

async function run() {
  const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const res = await client.query(`
      SELECT
        conname AS constraint_name,
        conrelid::regclass AS table_name,
        a.attname AS column_name,
        confrelid::regclass AS foreign_table_name,
        af.attname AS foreign_column_name
      FROM pg_constraint c
      JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
      JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
      WHERE confrelid = '"Comment"'::regclass;
    `);
    console.log("Foreign keys to Comment:");
    console.table(res.rows);
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();

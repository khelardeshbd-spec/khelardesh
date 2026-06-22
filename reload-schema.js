const { Client } = require('pg');
const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const directUrlLine = envFile.split('\n').find(line => line.startsWith('DIRECT_URL='));
const directUrl = directUrlLine ? directUrlLine.split('=')[1].trim().replace(/^"|"$/g, '') : "";

async function run() {
  const client = new Client({ connectionString: directUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query("NOTIFY pgrst, 'reload schema';");
    console.log("Reloaded schema cache");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
run();

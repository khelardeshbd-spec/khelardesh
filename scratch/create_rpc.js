const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.uvuqxixoncdbjupupxow:ShahMdEliausKomol@aws-1-ap-south-1.pooler.supabase.com:5432/postgres',
});

async function run() {
  await client.connect();
  try {
    const res = await client.query(`
      CREATE OR REPLACE FUNCTION increment_article_views(article_id int)
      RETURNS void AS $$
      BEGIN
        UPDATE "Article"
        SET views = views + 1
        WHERE id = article_id;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('Successfully created RPC function:', res);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

run();

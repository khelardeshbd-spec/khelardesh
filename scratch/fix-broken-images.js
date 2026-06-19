const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
    env[key] = val;
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseSecret = env.SUPABASE_SECRET_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseSecret);

const WORKING_IMAGE_URL = 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2862&auto=format&fit=crop';
const BROKEN_IMAGE_URL = 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200';

async function main() {
  console.log('Finding articles with the broken mediaUrl...');
  
  const { data: articles, error: fetchErr } = await supabase
    .from('Article')
    .select('id, slug, mediaUrl')
    .or(`mediaUrl.eq."${BROKEN_IMAGE_URL}",mediaUrl.is.null`);

  if (fetchErr) {
    console.error('Error fetching articles:', fetchErr);
    process.exit(1);
  }

  console.log(`Found ${articles.length} articles to update.`);

  for (const art of articles) {
    console.log(`Updating article ID ${art.id} (${art.slug})...`);
    const { error: updateErr } = await supabase
      .from('Article')
      .update({ mediaUrl: WORKING_IMAGE_URL })
      .eq('id', art.id);

    if (updateErr) {
      console.error(`Failed to update ${art.slug}:`, updateErr.message);
    } else {
      console.log(`Successfully updated ${art.slug}`);
    }
  }

  console.log('Database image fix complete!');
}

main();

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey);

async function main() {
  const { data, error } = await supabase
    .from('Article')
    .select('sport, publishedAt, headlineBn')
    .order('publishedAt', { ascending: false });

  if (error) {
    console.error('Error fetching:', error);
    return;
  }

  const sportsMap = {};
  data.forEach(a => {
    sportsMap[a.sport] = (sportsMap[a.sport] || 0) + 1;
  });

  console.log('Unique sports and counts:');
  console.log(sportsMap);

  console.log('\nRecent articles (last 5):');
  console.log(data.slice(0, 5));
}

main();

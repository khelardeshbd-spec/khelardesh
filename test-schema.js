const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const { data, error } = await supabase.rpc('get_schema_info');
  // Or just query the DB directly if there's a way.
  // Actually, we can just try to update a non-existent article with status = 'archived'
  // If it's a type error, it will say "invalid input value for enum..."
  const res = await supabase.from('Article').update({ status: 'archived' }).eq('id', -1);
  console.log(res);
}
run();

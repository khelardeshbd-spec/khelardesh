require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabaseAdmin
      .from('UserNotification')
      .select(`
        *,
        Comment (
          body,
          createdAt,
          userImage,
          articleSlug
        )
      `)
      .eq('userEmail', 'siamsledvk@gmail.com')
      .order('createdAt', { ascending: false })
      .limit(30);
      
  console.log('Error:', error);
  console.log('Data:', JSON.stringify(data, null, 2));
}
run();

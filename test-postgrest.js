const fs = require('fs');
const envFile = fs.readFileSync('.env.local', 'utf8');
const supabaseUrlLine = envFile.split('\n').find(line => line.startsWith('NEXT_PUBLIC_SUPABASE_URL='));
const supabaseAnonLine = envFile.split('\n').find(line => line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY='));
const supabaseKeyLine = envFile.split('\n').find(line => line.startsWith('SUPABASE_SERVICE_ROLE_KEY='));
const supabaseUrl = supabaseUrlLine ? supabaseUrlLine.split('=')[1].trim().replace(/^"|"$/g, '') : "";
const supabaseAnon = supabaseAnonLine ? supabaseAnonLine.split('=')[1].trim().replace(/^"|"$/g, '') : "";
const supabaseKey = supabaseKeyLine ? supabaseKeyLine.split('=')[1].trim().replace(/^"|"$/g, '') : "";

async function run() {
  const res = await fetch(`${supabaseUrl}/rest/v1/UserNotification?select=*,Comment(body,createdAt,userImage,articleSlug)&userEmail=eq.siamsledvk@gmail.com`, {
    headers: {
      'apikey': supabaseAnon,
      'Authorization': `Bearer ${supabaseKey}`
    }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();

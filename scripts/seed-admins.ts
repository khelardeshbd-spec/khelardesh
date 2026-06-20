/**
 * scripts/seed-admins.ts
 * Run ONCE to seed the 3 admin accounts into Supabase.
 * Usage: npx tsx scripts/seed-admins.ts
 *
 * Accounts created:
 *   superadmin  / password: khelardesh@super  (role: super_admin)
 *   admin1      / password: khelardesh@admin1 (role: admin)
 *   admin2      / password: khelardesh@admin2 (role: admin)
 */

// @ts-nocheck
/* eslint-disable */
/**
 * Run: npx tsx --env-file=.env.local scripts/seed-admins.ts
 */
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_KEY!
);

const SALT_ROUNDS = 12;

const admins = [
  {
    username: 'superadmin',
    password: 'khelardesh@super',
    display_name: 'Super Admin',
    role: 'super_admin',
  },
  {
    username: 'admin1',
    password: 'khelardesh@admin1',
    display_name: 'Admin One',
    role: 'admin',
  },
  {
    username: 'admin2',
    password: 'khelardesh@admin2',
    display_name: 'Admin Two',
    role: 'admin',
  },
];

async function seed() {
  console.log('🌱 Seeding admin accounts...\n');

  for (const admin of admins) {
    const password_hash = await bcrypt.hash(admin.password, SALT_ROUNDS);

    const { error } = await supabase.from('AdminUser').upsert(
      {
        username: admin.username,
        password_hash,
        display_name: admin.display_name,
        role: admin.role,
        is_blocked: false,
      },
      { onConflict: 'username' }
    );

    if (error) {
      console.error(`❌ Failed to seed ${admin.username}:`, error.message);
    } else {
      console.log(`✅ Seeded: ${admin.username} (${admin.role}) — password: ${admin.password}`);
    }
  }

  console.log('\n✨ Done! Change passwords immediately after first login.');
}

seed().catch(console.error);

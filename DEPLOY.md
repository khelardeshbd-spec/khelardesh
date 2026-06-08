# Deploying FIELD to Cloudflare Pages

## One-time setup (do this once)

### Step 1 — Supabase database
1. Go to supabase.com → New project
2. Choose region: Southeast Asia (closest to Bangladesh)
3. Copy the connection strings into .env.local:
   - DATABASE_URL → use the "Transaction" pooler string (port 6543)
   - DIRECT_URL → use the "Session" pooler string (port 5432)
4. Run: `npx prisma migrate deploy`
5. Run: `npx prisma db seed`

### Step 2 — Cloudflare R2 bucket
1. Go to dash.cloudflare.com → R2 → Create bucket
2. Name it: field-media
3. Go to bucket settings → Enable public access → Copy the public URL
4. Go to Manage R2 API tokens → Create token with Object Read & Write
5. Copy Account ID, Access Key, Secret Key into .env.local

### Step 3 — Cloudflare Pages
1. Go to dash.cloudflare.com → Pages → Create project
2. Connect your GitHub repo OR use direct upload
3. Build settings:
   - Framework preset: None
   - Build command: npx @cloudflare/next-on-pages
   - Build output directory: .vercel/output/static
4. Add all environment variables from .env.local into Pages settings
5. Click Deploy

### Step 4 — Connect your domain
1. Go to your Pages project → Custom domains
2. Add your domain
3. If domain is already on Cloudflare DNS it activates instantly

## Redeploying after changes
Push to GitHub → Cloudflare Pages auto-deploys.
Or manually: `npm run deploy`

## Local development
npm run dev        ← runs normal Next.js locally
npm run pages:dev  ← runs Cloudflare edge environment locally

# Khelardesh Platform Handover Document

## 1. PROJECT OVERVIEW
Khelardesh is a modern, responsive sports news and live scores platform built for Bengali-speaking audiences. Its core features include an administrative dashboard for publishing rich-text articles, dynamic news feeds categorized by sport, integrated live score tracking for multiple sports, and a flexible sponsorship system supporting both custom image banners and third-party ad networks (like Adsterra). 

**Tech Stack**
*   **Next.js**: Powers the frontend UI and the backend API routes, enabling fast Server-Side Rendering (SSR) and seamless client-side navigation.
*   **Supabase**: Serves as the primary backend, providing a PostgreSQL database, cloud storage for images, and secure authentication.
*   **Vercel**: Handles the deployment and hosting of the Next.js application, including running serverless API functions and scheduled cron jobs.
*   **Tailwind CSS**: Used for all styling and layout, ensuring a responsive design that looks great on mobile, tablet, and desktop devices.

## 2. ARCHITECTURE SUMMARY
The application follows a standard Next.js Serverless architecture. 
*   **Frontend**: Public pages fetch data directly from Supabase via the Supabase Javascript Client for fast, read-only operations. 
*   **API Routes**: Administrative actions (creating articles, uploading images, updating sponsors) are routed through secure `/api/admin/*` endpoints on the Next.js server, which validate the user's admin session before interacting with Supabase.
*   **Vercel Cron Jobs**: Vercel triggers a scheduled function (`/api/cron/sync-scores`) that pulls live sports data from an external API and updates the Supabase database.

**Data Storage (Supabase Tables)**
*   `Article`: Stores all news articles, including their HTML content blocks, SEO metadata, cover images, and publication status (draft or published).
*   `ScoreCard`: Stores the live and scheduled match data (teams, scores, match status) synchronized from the sports API.
*   `Sponsor`: Stores the configuration for banner ads across the site, including uploaded banner images, redirect links, or third-party Adsterra scripts.
*   `Comment`: Stores user comments left on articles.

**Live Data Pipeline**
The live sports scores are sourced from an external API (SofaScore). A Vercel Cron Job is scheduled to run periodically to fetch the latest scores, translate team names and statuses into Bengali, and update the `ScoreCard` table in Supabase.

## 3. ACCESS & CREDENTIALS
> [!IMPORTANT]
> **No actual passwords or secret keys are stored in this document.** All sensitive API keys and database credentials are saved securely in the **Vercel Environment Variables** settings page.

To fully manage the platform, you will need access to the following services:
*   **Vercel**: Hosts the website and manages the domain. (Tier: Hobby/Pro - monitor Vercel dashboard for bandwidth and Serverless Function execution limits).
*   **Supabase**: Hosts the database and image storage. (Tier: Free/Pro - be aware of the 500MB database size limit and 1GB storage limit on the Free tier).
*   **GitHub**: Stores the project's source code. Vercel is connected to GitHub and automatically deploys any new code pushed to the `main` branch.
*   **Domain Registrar**: The provider where `khelardesh.com` is registered, used to manage DNS records.

## 4. SECURITY POSTURE
A comprehensive security audit has been conducted on the platform to ensure data integrity and prevent unauthorized access.

**Row Level Security (RLS)**
Supabase uses Row Level Security (RLS), which acts as a firewall directly on the database tables. We have enabled RLS on **all tables** (`Article`, `Sponsor`, `ScoreCard`, `Comment`). This means that by default, no one can read or write data unless an explicit rule allows it. We have configured rules so that the public can only read published articles and active sponsors, but cannot modify any data.

**Admin Access Control**
Admin login is handled securely via NextAuth. When an admin logs in, a secure session cookie is created. When the admin attempts to create an article or update a sponsor, the frontend sends a request to the server-side API routes. The server strictly verifies the admin session cookie before proceeding. All sensitive database writes are performed server-side, never on the user's device.

**Service Role Key**
> [!CAUTION]
> The **Supabase Service Role Key** is a master key that bypasses all database RLS rules. It is strictly kept in server-side API routes (via the `SUPABASE_SERVICE_ROLE_KEY` environment variable) and is **NEVER** exposed to the frontend browser. This ensures that malicious users cannot extract the key to modify your database.

## 5. DAY-TO-DAY OPERATIONS
*   **Publishing Articles**: Navigate to `/admin` and log in. Use the "Create Article" button to open the rich-text editor. You can add text, upload images, embed YouTube videos, and insert Adsterra scripts. Set the status to "Published" to make it live.
*   **Managing Sponsors**: In the Admin Dashboard, go to "Sponsors". You can assign ads to specific slots (e.g., Homepage Banner, Header Logo). For each slot, you can either upload a custom image with a redirect link, or toggle "Use Adsterra script" and paste your third-party ad code.
*   **Uploading Images**: Image uploads (for article covers and sponsors) are handled automatically in the dashboard. The images are securely uploaded to a Supabase Storage bucket.

## 6. EMERGENCY PLAYBOOK
*   **If the site goes down**: Log into the **Vercel Dashboard** and check the "Deployments" tab for any build errors. Check the "Logs" tab for runtime errors. Next, check the **Supabase Dashboard** to ensure the database is active and hasn't been paused (Supabase pauses free tier projects after 1 week of inactivity).
*   **If API/Database limits are hit**: If you exceed the Supabase Free Tier limits (e.g., database size or bandwidth), the database will go into read-only mode, and admin uploads will fail. You will need to upgrade to the Supabase Pro plan. Monitor your usage in the Supabase "Project Settings -> Usage" page. Monitor Vercel for failed cron jobs. *Recommendation: Rotate API keys annually.*
*   **If live scores stop updating**: Check the Vercel logs for the `/api/cron/sync-scores` endpoint. The SofaScore API might have changed its structure or rate-limited the server.

## 7. KNOWN LIMITATIONS & FUTURE RECOMMENDATIONS
*   **SofaScore API Dependency**: The live score sync relies on an unofficial proxy connection to the SofaScore API. If SofaScore changes their API or blocks the Vercel server IP, the live scores will break. *Recommendation: Purchase an official sports data API (like Sportmonks or API-Football) for production reliability.*
*   **Adsterra Script Workaround**: To prevent React hydration errors, Adsterra scripts inside the article editor are encoded in base64 format (e.g., `[ADSTERRA: base64code]`). While functional, it is a workaround. 
*   **Search Functionality**: The current article search is a basic MVP implementation using database text matching and may become slow as the number of articles grows. *Recommendation: Implement a dedicated search service like Algolia or Typesense in the future.*
*   **Next Steps**: It is highly recommended to set up an error monitoring service (like Sentry), establish a dedicated staging environment for testing new features before they go live, and add automated testing suites.

## 8. SUPPORT & HANDOVER CONTACT
[Leave a placeholder for me to fill in: support terms, contact info, warranty period if any]

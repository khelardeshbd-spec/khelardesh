# Khelardesh Project Handover Documentation

## 1. PROJECT OVERVIEW

**Khelardesh** is a modern, Bengali-language sports news platform that provides comprehensive coverage of various sports, including football, cricket, tennis, and more. Designed primarily for Bengali-speaking sports enthusiasts, the platform offers real-time match scores, detailed news articles, user engagement through comments and reactions, and administrative tools for content management. 

### Core Features
- **Frontend Reader Experience**: Clean, responsive UI with real-time news feeds, trending articles, sticky headers, and interactive elements (reactions, comments, bookmarks).
- **Live Match Scores**: Integration with third-party APIs (like SofaScore) to display real-time match results directly in the header and dedicated scoreboards.
- **Admin Dashboard**: A secure, comprehensive backend for administrators to create and edit articles (with a rich text composer), manage users, moderate comments, control banner advertisements, and manage notifications.
- **Automated Advertisement Placement**: Seamless integration with Adsterra for automated injection of ad scripts across header, homepage, and in-article placements via a simple toggle interface.

### Technology Stack
- **Next.js (App Router)**: Acts as the core React framework for both frontend rendering (SSR/SSG) and backend API routing.
- **Supabase**: Serves as the primary PostgreSQL database and authentication provider, ensuring secure data storage and user management.
- **Vercel**: The hosting and deployment platform that provides seamless CI/CD, edge networking, and serverless infrastructure (including Cron jobs).
- **Tailwind CSS**: Utilized for rapid, utility-first styling to ensure a consistent, mobile-responsive, and modern aesthetic across the application.

---

## 2. ARCHITECTURE SUMMARY

### High-Level Architecture
1. **Client (Browser)**: Users interact with the React frontend built using Next.js.
2. **Next.js Server / Edge**: Handles API requests, server-side rendering, and communicates securely with the database using the Supabase Admin SDK.
3. **Database (Supabase PostgreSQL)**: Stores all application state, structured across various relational tables.
4. **Vercel Cron Jobs**: Scheduled tasks trigger Next.js API routes periodically to synchronize live match data from third-party APIs into the Supabase database.

### Data Storage & Tables
- **`Article`**: Stores all published and draft news content (title, slug, content blocks, featured images, tags, metadata).
- **`User`**: Contains user profiles, roles (`ADMIN` vs. regular users), and preferences.
- **`Comment` & `Reaction`**: Stores user-generated engagement data linked to specific articles.
- **`Sponsor`**: Manages advertisement configurations (custom banners or Adsterra scripts) and their specific placement locations.
- **`Match` & `MatchEvent`**: Caches real-time sports scores and event timelines retrieved from external APIs.
- **`Notification`**: Stores system and user notifications, including admin alerts for new registrations or comments.

---

## 3. HOW TO MANAGE THE APP

### Content Management (Articles)
- Navigate to the **Admin Dashboard** (`/admin/dashboard`) and select **Manage Articles**.
- Use the **Article Composer** to write news, add multimedia blocks, and insert advertisement blocks.
- **Note**: Ensure articles are assigned appropriate tags (e.g., `football`, `cricket`) to properly categorize them on the frontend.

### Advertisement Management
- Go to **Sponsors** (`/admin/sponsors`) in the admin panel.
- For any placement (Header, Homepage, or In-Article), you can upload a custom banner image and provide a redirection link.
- **Adsterra Automation**: Alternatively, simply toggle the **"Use Adsterra ad"** switch. This automatically injects the correct pre-configured script (e.g., 728x90 for homepage, 320x50 for mobile headers) without requiring any manual code pasting.

### Live Match Scores
- Scores are synced automatically via Vercel Cron jobs that call `/api/cron/sync-scores`.
- Admins can manually trigger or override score updates in the **Live Scores** admin section if the automated sync is delayed.

---

## 4. SECURITY AUDIT & FIXES APPLIED

A comprehensive security audit was recently conducted, and the following critical vulnerabilities were patched to ensure enterprise-grade security:

### 1. Insecure Direct Object Reference (IDOR) on User Deletion
- **Issue**: Any authenticated user could previously pass an arbitrary user ID to the deletion endpoint and delete other users' accounts, including administrators.
- **Fix**: Implemented strict Role-Based Access Control (RBAC). The `/api/admin/admins/[id]/block` route now rigorously verifies the session against the `User` table to ensure the requester possesses `ADMIN` privileges before executing the action.

### 2. SQL Injection / Logic Flaw in Password Reset
- **Issue**: The password reset logic relied on insecure string comparisons that could be bypassed using JSON payload manipulation or PostgreSQL type juggling, allowing account takeover.
- **Fix**: The update password route (`/api/admin/profile/password`) now utilizes strict parameter binding and robust data validation, preventing arbitrary payload evaluation.

### 3. Server-Side Request Forgery (SSRF) in Proxy API
- **Issue**: The `/api/proxy/sofascore` endpoint accepted an arbitrary `url` parameter from the client and fetched it server-side. Attackers could exploit this to scan internal Vercel networks or access internal metadata.
- **Fix**: Removed the dynamic `url` parameter. The proxy endpoint now strictly hardcodes the target domain and paths, ensuring it can only fetch data from the intended external sports API.

---

## 5. FUTURE ROADMAP (What to build next)

- **Enhanced SEO & Open Graph Metadata**: Implement dynamic, server-generated Open Graph images and structured schema data (JSON-LD) for better search engine visibility.
- **User Progression & Gamification**: Introduce user badges, reputation scores, or a loyalty system to incentivize frequent reading and commenting.
- **Push Notifications**: Integrate Web Push APIs or a service like Firebase Cloud Messaging to send real-time alerts to users for breaking news or match updates.
- **Advanced Analytics Dashboard**: Build a comprehensive internal analytics view to track page views, average read time, and ad click-through rates directly within the Khelardesh admin panel.

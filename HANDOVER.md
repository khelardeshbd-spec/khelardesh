# Khelardesh Project Handover Documentation

## 1. PROJECT OVERVIEW

**Khelardesh** is a modern, Bengali-language sports news platform that provides comprehensive coverage of various sports, including football, cricket, tennis, and more. Designed primarily for Bengali-speaking sports enthusiasts, the platform offers real-time match scores, detailed news articles, user engagement through comments and reactions, and administrative tools for content management. 

### Core Features
- **Frontend Reader Experience**: Clean, responsive UI with real-time news feeds, trending articles, sticky headers, and interactive elements (reactions, comments, bookmarks).
- **Live Match Scores**: Integration with third-party APIs (like SofaScore) to display real-time match results directly in the header and dedicated scoreboards.
- **Admin Dashboard**: A secure, comprehensive backend for administrators to manage users, moderate comments, control banner advertisements, manage notifications, and write articles.
- **Automated Advertisement Placement**: Seamless integration with Adsterra for automated injection of ad scripts across header, homepage, and in-article placements via a simple toggle interface.

### Technology Stack
- **Next.js (App Router)**: Acts as the core React framework for both frontend rendering (SSR/SSG) and backend API routing.
- **Supabase**: Serves as the PostgreSQL database and authentication provider, ensuring secure data storage and user management.
- **Vercel**: The hosting and deployment platform that provides seamless CI/CD, edge networking, and serverless infrastructure (including Cron jobs).
- **Tailwind CSS**: Utilized for rapid, utility-first styling to ensure a consistent, mobile-responsive, and modern aesthetic across the application.

---

## 2. ARCHITECTURE SUMMARY

### High-Level Architecture
1. **Client (Browser)**: Users interact with the React frontend built using Next.js. The frontend **never** fetches or writes data directly to the Supabase database.
2. **Next.js Server / Edge API Routes**: All data reads and writes pass through Next.js server-side API routes (`/api/*`) or React Server Components. These routes authenticate the user securely and communicate with the database using the **Supabase Admin SDK** (Service Role Key).
3. **Database (Supabase PostgreSQL)**: Stores all application state, structured across various relational tables. Because the server uses the Admin SDK, database Row Level Security (RLS) is bypassed by design. All authorization logic is enforced strictly at the Next.js API layer.
4. **Vercel Cron Jobs**: Scheduled tasks trigger Next.js API routes periodically to synchronize live match data from third-party APIs into the database.

### Data Storage & Tables
The database consists of the following exact tables:
- **`Article`**: Stores all published and draft news content (stored as plain text with shortcodes).
- **`ScoreCard`**: Caches real-time sports scores.
- **`Sponsor`**: Manages advertisement configurations and placements.
- **`Comment` & `CommentReaction`**: Stores user-generated comments and their reaction counts (Like, Love, Angry, etc.). Note: Users are identified via session data; there is no explicit `SiteUser` table.
- **`AdminUser` & `EmployeeUser`**: Dedicated tables for backend staff credentials, roles, and permissions.
- **`SidebarContent`**: Manages dynamic sidebar widgets.
- **`AdminNotification` & `UserNotification`**: Stores system and user alerts.

### Content Security & Rendering
- **Plain-text Composer**: The Article Composer uses a plain-text textarea, **not** a WYSIWYG rich-text editor.
- **XSS Prevention**: Content is stored as plain text and rendered safely via React text nodes.
- **Shortcode System**: Rich media (images, embeds, Adsterra ads) are inserted using specific shortcodes (e.g., `[AD: url | link]`), which the frontend parses and replaces with isolated React components.

### Adsterra Base64 Embedding Explained
In-article Adsterra ads are embedded using the shortcode `[ADSTERRA: base64_encoded_script]`.
- **What gets stored**: The raw `<script>` tag provided by Adsterra is Base64 encoded before being saved into the `Article` body text.
- **Why Base64?**: Ad scripts contain raw HTML, quotes, and JavaScript that would break the plain-text parser's logic. Base64 encoding safely encapsulates the script so it doesn't interfere with standard text formatting.
- **How it's rendered**: The frontend (`article/[slug]/page.tsx`) extracts the Base64 string, decodes it back into the raw `<script>` tag, and passes it to the `<AdsterraAd>` React component, which executes the script using DOM injection.
- **Security Implications**: Because this mechanism decodes and blindly executes whatever script is inside the shortcode, it **can execute arbitrary malicious code** if tampered with. If a malicious actor with Admin access (or via an API injection flaw) modifies an article to include `[ADSTERRA: base64(malicious_script)]`, it will result in Stored XSS. The security of this system relies entirely on the robust Role-Based Access Control (RBAC) protecting the server-side Article API routes.

---

## 3. HOW TO MANAGE THE APP

### Content Management (Articles)
- Navigate to the **Admin Dashboard** (`/admin/dashboard`) and select **Manage Articles**.
- Use the **Article Composer** to write news in plain text and insert advertisement blocks.
- **Note**: Ensure articles are assigned appropriate tags (e.g., `football`, `cricket`) to properly categorize them on the frontend.

### Advertisement Management
- Go to **Sponsors** (`/admin/sponsors`) in the admin panel.
- For any placement (Header, Homepage, or In-Article), you can upload a custom banner image and provide a redirection link.
- **Adsterra Automation**: Alternatively, simply toggle the **"Use Adsterra ad"** switch. This automatically injects the correct pre-configured script (e.g., 728x90 for homepage, 320x50 for mobile headers) without requiring any manual code pasting. Recent updates removed the ugly border frames around these ads to ensure they float cleanly within the layout.

### Live Match Scores
- Scores are synced automatically via Vercel Cron jobs that call `/api/cron/sync-scores`.
- Admins can manually trigger or override score updates in the **Live Scores** admin section if the automated sync is delayed.

---

## 4. FUTURE ROADMAP (What to build next)

- **Enhanced SEO & Open Graph Metadata**: Implement dynamic, server-generated Open Graph images and structured schema data (JSON-LD) for better search engine visibility.
- **User Progression & Gamification**: Introduce user badges, reputation scores, or a loyalty system to incentivize frequent reading and commenting.
- **Push Notifications**: Integrate Web Push APIs or a service like Firebase Cloud Messaging to send real-time alerts to users for breaking news or match updates.
- **Advanced Analytics Dashboard**: Build a comprehensive internal analytics view to track page views, average read time, and ad click-through rates directly within the Khelardesh admin panel.

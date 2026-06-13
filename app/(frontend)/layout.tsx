import type { Metadata } from 'next';
import '@/styles/globals.css';
import SmartHeader from '@/components/frontend/SmartHeader';
import StickyScrollHeader from '@/components/frontend/StickyScrollHeader';
import BottomNav from '@/components/frontend/BottomNav';
import LiveTicker from '@/components/frontend/LiveTicker';
import Footer from '@/components/frontend/Footer';

export const metadata: Metadata = {
  title: {
    template: '%s | খেলারদেশ — স্পোর্টস · স্বতন্ত্র',
    default: 'খেলারদেশ — স্পোর্টস · স্বতন্ত্র',
  },
  description:
    'খেলারদেশ বাংলাদেশে ক্রীড়া সাংবাদিকতায় এক স্বাধীন কণ্ঠস্বর — বাংলা ও ইংরেজিতে ফুটবল, ক্রিকেট, বাস্কেটবল, টেনিস, F1 সহ সমস্ত খেলার খবর।',
  keywords: ['sports news Bangladesh', 'Bengali sports', 'BPL football', 'cricket', 'খেলারদেশ', 'khelar desh'],
  openGraph: {
    siteName: 'খেলারদেশ',
    type: 'website',
    locale: 'bn_BD',
  },
};

/**
 * Root layout — ThemeProvider (data-theme set client-side), Section 15
 * Default theme: paper (set via script to avoid flash)
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" data-theme="paper" suppressHydrationWarning>
      <head>
        {/* Inline script to set theme before first paint — prevents flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var theme = localStorage.getItem('field-theme') || 'paper';
                document.documentElement.dataset.theme = theme;
              })();
            `,
          }}
        />
      </head>
      <body className="has-bottom-nav">
        {/* <SmartHeader /> removed as per user request */}
        <StickyScrollHeader />
        <LiveTicker />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}

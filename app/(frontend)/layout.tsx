import type { Metadata } from 'next';
import '@/styles/globals.css';
import SmartHeader from '@/components/frontend/SmartHeader';
import StickyScrollHeader from '@/components/frontend/StickyScrollHeader';
import BottomNav from '@/components/frontend/BottomNav';
import LiveTicker from '@/components/frontend/LiveTicker';
import Footer from '@/components/frontend/Footer';
import SessionProviderWrapper from '@/components/frontend/SessionProviderWrapper';
import PresenceTracker from '@/components/frontend/PresenceTracker';

export const metadata: Metadata = {
  // metadataBase is CRITICAL — without this Next.js can't build absolute OG image URLs
  metadataBase: new URL('https://khelardesh.com'),
  title: {
    template: '%s | খেলারদেশ',
    default: 'খেলারদেশ | বাংলাদেশের নির্ভরযোগ্য স্পোর্টস নিউজ পোর্টাল',
  },
  description:
    'বাংলাদেশের অন্যতম নির্ভরযোগ্য ও স্বাধীন স্পোর্টস নিউজ পোর্টাল খেলারদেশ। ফুটবল, ক্রিকেট, টেনিস থেকে শুরু করে ফর্মুলা ওয়ান—সব খেলার সর্বশেষ খবর, বিশ্লেষণ এবং লাইভ আপডেট পান সবার আগে।',
  keywords: [
    'sports news Bangladesh', 'Bengali sports news', 'BPL football', 'cricket Bangladesh',
    'খেলারদেশ', 'খেলাধুলার খবর', 'khelardesh', 'khelar desh',
    'বাংলাদেশ ক্রীড়া সংবাদ', 'football news', 'cricket news',
  ],
  authors: [{ name: 'খেলারদেশ', url: 'https://khelardesh.com' }],
  creator: 'খেলারদেশ',
  publisher: 'খেলারদেশ',
  openGraph: {
    siteName: 'খেলারদেশ',
    type: 'website',
    locale: 'bn_BD',
    url: 'https://khelardesh.com',
    title: 'খেলারদেশ | বাংলাদেশের নির্ভরযোগ্য স্পোর্টস নিউজ পোর্টাল',
    description: 'বাংলাদেশের অন্যতম নির্ভরযোগ্য ও স্বাধীন স্পোর্টস নিউজ পোর্টাল খেলারদেশ। সব খেলার সর্বশেষ খবর, বিশ্লেষণ এবং লাইভ আপডেট।',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'খেলারদেশ | বাংলাদেশের নির্ভরযোগ্য স্পোর্টস নিউজ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@khelardesh',
    creator: '@khelardesh',
    title: 'খেলারদেশ | বাংলাদেশের নির্ভরযোগ্য স্পোর্টস নিউজ',
    description: 'বাংলাদেশের অন্যতম নির্ভরযোগ্য ও স্বাধীন স্পোর্টস নিউজ পোর্টাল খেলারদেশ। সব খেলার সর্বশেষ খবর এবং বিশ্লেষণ।',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: 'https://khelardesh.com',
    languages: {
      'bn-BD': 'https://khelardesh.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '06nRGTpcUV7PVzfg1dY8l5nMQuxgmtiw-3Y8LK48A9o',
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
      <body>
        <SessionProviderWrapper>
          <PresenceTracker />
          {/* <SmartHeader /> removed as per user request */}
          <StickyScrollHeader />
          <LiveTicker />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

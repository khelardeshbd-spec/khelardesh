import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'খেলারদেশ — স্পোর্টস · স্বতন্ত্র',
    short_name: 'খেলারদেশ',
    description: 'স্বাধীন বাংলাদেশি স্পোর্টস নিউজ — ফুটবল, ক্রিকেট, বাস্কেটবল ও আরও অনেক কিছু।',
    start_url: '/',
    display: 'standalone',
    background_color: '#f5f0e8',
    theme_color: '#1a5c2e',
    lang: 'bn',
    icons: [
      {
        src: '/images/khelardesh_logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/khelardesh_logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['news', 'sports'],
  };
}

import { MetadataRoute } from 'next';
import { supabaseAdmin } from '@/lib/supabase';

const BASE_URL = 'https://khelardesh.com';

const SPORT_SLUGS = [
  'football', 'bd-football', 'club-football', 'international-football',
  'cricket', 'bd-cricket', 'basketball', 'tennis', 'f1',
  'interview', 'feature', 'special', 'guest-column', 'rugby', 'athletics',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static routes ────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/scores`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // ── Sport category routes ─────────────────────────────────────────────────
  const sportRoutes: MetadataRoute.Sitemap = SPORT_SLUGS.map((sport) => ({
    url: `${BASE_URL}/sport/${sport}`,
    lastModified: new Date(),
    changeFrequency: 'hourly' as const,
    priority: 0.8,
  }));

  // ── Article routes from DB ────────────────────────────────────────────────
  let articleRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: articles } = await supabaseAdmin
      .from('Article')
      .select('slug, updatedAt, publishedAt')
      .order('publishedAt', { ascending: false })
      .limit(5000); // Cover up to 5k articles

    if (articles) {
      articleRoutes = articles.map((a: { slug: string; updatedAt?: string; publishedAt?: string }) => ({
        url: `${BASE_URL}/article/${a.slug}`,
        lastModified: a.updatedAt ? new Date(a.updatedAt) : a.publishedAt ? new Date(a.publishedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      }));
    }
  } catch (err) {
    console.error('[sitemap] Failed to fetch articles:', err);
  }

  return [...staticRoutes, ...sportRoutes, ...articleRoutes];
}

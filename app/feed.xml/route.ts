export const dynamic = 'force-dynamic';

import { supabaseAdmin } from '@/lib/supabase';

function escapeXml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export async function GET() {
  try {
    // Fetch latest 50 published articles
    const { data: articles, error } = await supabaseAdmin
      .from('Article')
      .select('slug, headline, headlineBn, deck, publishedAt, mediaUrl')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(50);

    if (error) throw error;

    const baseUrl = 'https://khelardesh.com';

    // Generate XML string
    let xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml('খেলারদেশ — স্পোর্টস নিউজ')}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml('স্বাধীন বাংলাদেশী স্পোর্টস নিউজ। ফুটবল, ক্রিকেট, বাস্কেটবল, টেনিস, F1 এবং আরও অনেক কিছু।')}</description>
    <language>bn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
`;

    if (articles) {
      for (const article of articles) {
        const articleUrl = `${baseUrl}/article/${article.slug}`;
        const title = article.headlineBn || article.headline || '';
        const pubDate = article.publishedAt ? new Date(article.publishedAt).toUTCString() : new Date().toUTCString();
        
        xml += `    <item>
      <title>${escapeXml(title)}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(article.deck || '')}</description>
`;

        if (article.mediaUrl) {
          xml += `      <media:content url="${escapeXml(article.mediaUrl)}" type="image/jpeg" medium="image" />\n`;
        }

        xml += `    </item>\n`;
      }
    }

    xml += `  </channel>
</rss>`;

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=600, stale-while-revalidate',
      },
    });
  } catch (err) {
    console.error('[GET /feed.xml]', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}

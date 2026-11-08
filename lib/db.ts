import { Pool } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.DIRECT_URL ||
      '';

    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL pool error:', err);
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const p = getDbPool();
  const res = await p.query(text, params);
  return res.rows as T[];
}

export async function fetchHomepageData() {
  try {
    const [
      leads,
      footballArticles,
      cricketArticles,
      interviewArticles,
      featureArticles,
      specialArticles,
      guestArticles,
      othersArticles,
      didYouKnowArticles,
      onThisDayArticles,
      scores,
      sponsors,
    ] = await Promise.all([
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt", "isLead" 
         FROM "Article" 
         WHERE "isLead" = true AND status = $1 
         ORDER BY "publishedAt" DESC LIMIT 5`,
        ['published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport IN ('football', 'bd-football', 'international-football', 'club-football') AND status = $1 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport IN ('cricket', 'bd-cricket', 'international-cricket', 'local-cricket') AND status = $1 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND status = $2 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['interview', 'published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND status = $2 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['feature', 'published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND status = $2 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['special', 'published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND status = $2 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['guest-column', 'published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport IN ('others', 'other', 'basketball', 'tennis', 'f1', 'rugby', 'athletics', 'table-tennis', 'golf') AND status = $1 
         ORDER BY "publishedAt" DESC LIMIT 10`,
        ['published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND status = $2 
         ORDER BY "publishedAt" DESC LIMIT 5`,
        ['did-you-know', 'published']
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND status = $2 
         ORDER BY "publishedAt" DESC LIMIT 5`,
        ['on-this-day', 'published']
      ),
      query(
        `SELECT * FROM "ScoreCard" WHERE is_visible = true ORDER BY "isLive" DESC, "displayOrder" ASC`
      ),
      query(
        `SELECT * FROM "Sponsor" WHERE "isActive" = true ORDER BY "displayOrder" ASC`
      ),
    ]);

    return {
      leads,
      footballArticles,
      cricketArticles,
      interviewArticles,
      featureArticles,
      specialArticles,
      guestArticles,
      othersArticles,
      didYouKnowArticles,
      onThisDayArticles,
      scores,
      sponsors,
    };
  } catch (err) {
    console.error('[fetchHomepageData] DB error:', err);
    return null;
  }
}

export async function fetchSportPageData(sports: string[]) {
  try {
    const [leadArr, articles, scores, sponsors] = await Promise.all([
      query(
        `SELECT * FROM "Article" WHERE sport = ANY($1) AND "isLead" = true AND status = 'published' ORDER BY "publishedAt" DESC LIMIT 1`,
        [sports]
      ),
      query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" WHERE sport = ANY($1) AND status = 'published' ORDER BY "publishedAt" DESC LIMIT 20`,
        [sports]
      ),
      query(`SELECT * FROM "ScoreCard" WHERE is_visible = true ORDER BY "isLive" DESC, "displayOrder" ASC`),
      query(`SELECT * FROM "Sponsor" WHERE "isActive" = true ORDER BY "displayOrder" ASC`),
    ]);
    return {
      lead: leadArr?.[0] ?? null,
      articles: articles ?? [],
      scores: scores ?? [],
      sponsors: sponsors ?? [],
    };
  } catch (err) {
    console.error('[fetchSportPageData] DB error:', err);
    return null;
  }
}

export async function fetchArticleBySlug(slug: string) {
  try {
    const rows = await query(
      `SELECT * FROM "Article" WHERE slug = $1 AND status = 'published' LIMIT 1`,
      [slug]
    );
    return rows[0] || null;
  } catch (err) {
    console.error('[fetchArticleBySlug] DB error:', err);
    return null;
  }
}

export async function fetchRelatedArticles(sport: string | null, excludeId: number, limit = 6) {
  try {
    if (sport) {
      const rows = await query(
        `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
         FROM "Article" 
         WHERE sport = $1 AND id != $2 AND status = 'published' 
         ORDER BY "publishedAt" DESC LIMIT $3`,
        [sport, excludeId, limit]
      );
      if (rows.length >= 3) return rows;
    }
    return await query(
      `SELECT id, slug, headline, "headlineBn", deck, sport, "mediaType", "mediaUrl", byline, "publishedAt" 
       FROM "Article" 
       WHERE id != $1 AND status = 'published' 
       ORDER BY "publishedAt" DESC LIMIT $2`,
      [excludeId, limit]
    );
  } catch (err) {
    console.error('[fetchRelatedArticles] DB error:', err);
    return [];
  }
}

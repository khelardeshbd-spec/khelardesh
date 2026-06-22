import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/login', '/saved'],
      },
      {
        // Block AI training bots
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Google-Extended'],
        disallow: '/',
      },
    ],
    sitemap: 'https://khelardesh.com/sitemap.xml',
    host: 'https://khelardesh.com',
  };
}

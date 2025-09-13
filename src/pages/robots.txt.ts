import type { APIRoute } from 'astro';

const excludedAgents = [
  'AhrefsBot',
  'SemrushBot',
  'MJ12bot',
  'DotBot',
  'Baiduspider',
  'YandexBot',
  'Scrapy',
  'Python-urllib',
  'wget',
  'curl',
];

const getRobotsTxt = (sitemapURL: URL) => {
  const excluded = excludedAgents.map(agent => `User-agent: ${agent}\nDisallow: /\n`).join('\n');

  return `${excluded}
User-agent: *
Allow: /

Sitemap: ${sitemapURL.href}
`;
};

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap.xml', site);
  return new Response(getRobotsTxt(sitemapURL));
};

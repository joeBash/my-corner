import { checkSlashPageExists } from './utils';
import { ChangeFreqEnum, type SlashPage } from '../types/types';

export const slashes: Record<string, SlashPage> = {
  '/🍪': {
    url: '/🍪',
    description: 'would you like a cookie?',
    isVisible: checkSlashPageExists('/🍪'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.1,
    },
  },
  '/about': {
    url: '/about',
    description: 'my story in 60 seconds',
    isVisible: checkSlashPageExists('/about'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.MONTHLY,
      priority: 0.8,
    },
  },
  '/ai': {
    url: '/ai',
    description: 'how I am using AI',
    isVisible: checkSlashPageExists('/ai'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.6,
    },
  },
  '/blank': {
    url: '/blank',
    description: 'this page was intentionally left blank',
    isVisible: checkSlashPageExists('/blank'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.1,
    },
  },
  '/blog': {
    url: '/blog',
    description: 'my miniblog where I share my thoughts and expertise',
    isVisible: checkSlashPageExists('/blog'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.9,
    },
  },
  '/bucket-list': {
    url: '/bucket-list',
    description: 'a list of things I hope to complete before I pass on from this realm',
    isVisible: checkSlashPageExists('/bucket-list'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.5,
    },
  },
  '/changelog': {
    url: '/changelog',
    description: 'what I have done (and will do) with this site',
    isVisible: checkSlashPageExists('/changelog'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.MONTHLY,
      priority: 0.4,
    },
  },
  '/colophon': {
    url: '/colophon',
    description: 'what keeps this site alive',
    isVisible: checkSlashPageExists('/colophon'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.5,
    },
  },
  '/contact': {
    url: '/contact',
    description: 'channels you can reach me through',
    isVisible: checkSlashPageExists('/contact'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.7,
    },
  },
  '/feeds': {
    url: '/feeds',
    description: 'my own blog feeds (RSS, Atom, JSON)',
    isVisible: checkSlashPageExists('/feeds'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.WEEKLY,
      priority: 0.6,
    },
  },
  '/guestbook': {
    url: '/guestbook',
    description: 'let me know you have dropped by…',
    isVisible: checkSlashPageExists('/guestbook'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.2,
    },
  },
  '/hello': {
    url: '/hello',
    description: 'ways you can say hello',
    isVisible: checkSlashPageExists('/hello'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.5,
    },
  },
  '/interests': {
    url: '/interests',
    description: 'a list of what I am fascinated by',
    isVisible: checkSlashPageExists('/interests'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.5,
    },
  },
  '/llm': {
    url: '/llm',
    description: 'are you an LLM?',
    isVisible: checkSlashPageExists('/llm'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.3,
    },
  },
  '/nope': {
    url: '/nope',
    description: 'a list of what I will never accept',
    isVisible: checkSlashPageExists('/nope'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.2,
    },
  },
  '/now': {
    url: '/now',
    description: 'a summary of what I am working on (updated quarterly)',
    isVisible: checkSlashPageExists('/now'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.MONTHLY,
      priority: 0.7,
    },
  },
  '/podroll': {
    url: '/podroll',
    description: 'a curated list of podcasts I listen to (and would recommend)',
    isVisible: checkSlashPageExists('/podroll'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.5,
    },
  },
  '/privacy': {
    url: '/privacy',
    description: 'how I ensure your visit to my site remains transparent',
    isVisible: checkSlashPageExists('/privacy'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.4,
    },
  },
  '/resume': {
    url: '/resume',
    description: 'my career timeline up to now',
    isVisible: checkSlashPageExists('/resume'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.YEARLY,
      priority: 0.8,
    },
  },
  '/sitemap': {
    url: '/sitemap',
    description: 'if you are not a bot, then do not worry about this!',
    isVisible: checkSlashPageExists('/sitemap'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.1,
    },
  },
  '/til': {
    url: '/til',
    description: 'today, I learned…',
    isVisible: checkSlashPageExists('/til'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.DAILY,
      priority: 0.3,
    },
  },
  '/watched': {
    url: '/watched',
    description: 'I keep a log of all the movies I have watched so far',
    isVisible: checkSlashPageExists('/watched'),
    sitemapRules: {
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.MONTHLY,
      priority: 0.5,
    },
  },
  '/yep': {
    url: '/yep',
    description: 'a list of what I will always accept',
    isVisible: checkSlashPageExists('/yep'),
    sitemapRules: {
      exclude: true,
      lastmod: new Date().toISOString(),
      changefreq: ChangeFreqEnum.NEVER,
      priority: 0.2,
    },
  },
};

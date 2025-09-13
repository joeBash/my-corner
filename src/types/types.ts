export type SlashPage = {
  url?: string;
  description: string;
  isVisible: boolean;
  sitemapRules?: {
    exclude?: boolean;
    lastmod?: string;
    changefreq?: ChangeFreqEnum;
    priority?: number;
  };
};

/* ------------------------------ SITEMAP TYPES ----------------------------- */
export type Locale = 'en'; // TODO: add more languages when localization is introduced

export enum ChangeFreqEnum {
  ALWAYS = 'always',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  NEVER = 'never',
}

export enum PageType {
  SITE = 'site',
  BLOG = 'blog',
  PROJECT = 'project',
}

export type PageSitemapConfig = Record<
  PageType,
  {
    changefreq: ChangeFreqEnum;
    priority: number;
  }
>;

export type Page = {
  lang: Locale;
  slug: string;
  excludeFromIndex: boolean;
  lastmod: Date;
  type: PageType;
  changefreq?: ChangeFreqEnum;
  priority?: number;
  slugTranslations: Record<Locale, string> | {};
};

export type RouteEntry = {
  url: string;
  lang: Locale;
  lastmod: Date;
  changefreq: ChangeFreqEnum;
  priority: number;
  alternateVersions: Record<Locale, string> | {};
};
/* -------------------------- END OF SITEMAP TYPES -------------------------- */

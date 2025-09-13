import { ChangeFreqEnum, type Locale, type Page, type PageSitemapConfig, type RouteEntry } from "../types/types.ts";
import { BLUE, MAGENTA, GREEN, ORANGE, RED, RED_BG, RESET, YELLOW, GRAY } from "@utils/utils.ts";

const DEFAULT_LOCALE: Locale = "en";
const DISCOVERABLE_PAGE_FORMATS = ["astro", "md", "mdx"];

let indexablePages: Partial<Page>[] = [];
let nonIndexablePages: Partial<Page>[] = [];
let dirtyPages: Partial<Page>[] = [];
let cleanPages: Partial<Page>[] = [];

const pageSitemapConfig: PageSitemapConfig = {
  site: {
    changefreq: ChangeFreqEnum.WEEKLY,
    priority: 0.7,
  },
  blog: {
    changefreq: ChangeFreqEnum.DAILY,
    priority: 0.8,
  },
  project: {
    changefreq: ChangeFreqEnum.MONTHLY,
    priority: 0.6,
  },
};

/**
 * Gets the list of all pages (.astro, .md, .mdx) to be indexed in the sitemap.
 * Filters out pages that should be excluded (based on the `excludeFromIndex`
 * frontmatter property).
 *
 * @returns the list of pages to be indexed in the sitemap
 *
 * @example
 * ```
 * const pages = getIndexablePages();
 * console.log(pages);
 *
 * // [
 * //   {
 * //     lang: "en",
 * //     slug: "slashes",
 * //     excludeFromIndex: false,
 * //     lastmod: "2023-10-01",
 * //     slugTranslations: {
 * //       fr: "barres-obliques"
 * //     }
 * //   },
 * //   ...
 * // ]
 * ```
 */
function getIndexablePages(): Page[] {
  const validPages = Object.values(
    import.meta.glob<Page>("src/pages/**/*.{astro,md,mdx}", {
      eager: true,
      import: "metadata",
    })
  );

  return validPages.filter(page => {
    if (page.excludeFromIndex) {
      nonIndexablePages.push({ lang: page.lang, slug: page.slug });

      return false;
    }

    indexablePages.push({ lang: page.lang, slug: page.slug });

    return true;
  });
}

/**
 * Checks if a page was modified anytime today.
 *
 * @param page the page we are checking
 * @returns true if page is dirty (modified anytime today), false otherwise
 */
function isPageDirty(page: Page | undefined): boolean {
  //? Is this even needed at this point?
  if (!page) {
    return true;
  }

  const today = new Date();
  const lastModDate = new Date(page.lastmod);

  const isDirty =
    lastModDate.getDate() === today.getDate() &&
    lastModDate.getMonth() === today.getMonth() &&
    lastModDate.getFullYear() === today.getFullYear();

  if (isDirty) {
    dirtyPages.push({ lang: page.lang, slug: page.slug });
    return true;
  }

  cleanPages.push({ lang: page.lang, slug: page.slug });

  return false;
}

/**
 * Cleans up a URL by removing any double slashes (except for the "://" part).
 *
 * @param url the URL to clean
 * @returns the cleaned URL
 *
 * @example
 * ```
 * getSanitizedURL("https://example.com/path/to/page") // "https://example.com/path/to/page"
 * getSanitizedURL("https://example.com//path//to//page") // "https://example.com/path/to/page"
 * getSanitizedURL("https://example.com///path///to///page") // "https://example.com/path/to/page"
 * ```
 */
function getSanitizedURL(url: string): string {
  return url.replace(/(?<!:)\/{2,}/g, "/");
}

/**
 * Generates a localized URL for a given language based on slug translations.
 *
 * @param slugTranslations the translations of the slug for different locales
 * @param lang the locale/language code
 * @returns the localized URL for the given language
 *
 * @example
 * ```
 * getLocalizedURL({ en: "slashes", fr: "barres-obliques" }, "en") // "/slashes/"
 * getLocalizedURL({ en: "slashes", fr: "barres-obliques" }, "fr") // "/fr/barres-obliques/"
 * ```
 */
function getLocalizedURL(page: Page, lang: Locale): string {
  let url = `${page.slug}`; // e.g. "/slashes/"

  if (lang !== DEFAULT_LOCALE) {
    url = `/${lang}/${page.slugTranslations[lang]}/`; // e.g. "/fr/barres-obliques/"
  }

  return getSanitizedURL(url);
}

/**
 *
 * @param pages the list of pages to convert to routes
 * @returns the list of routes to be included in the sitemap
 *
 * @example
 * ```
 * const pages = [
 *   {
 *     lang: "en",
 *     slug: "slashes",
 *     excludeFromIndex: false,
 *     lastmod: "2023-10-01",
 *     slugTranslations: { fr: "barres-obliques" },
 *   },
 *   {
 *     lang: "fr",
 *     slug: "barres-obliques",
 *     excludeFromIndex: false,
 *     lastmod: "2023-10-01",
 *     slugTranslations: { en: "slashes" },
 *   },
 * ];
 *
 * const routes = parsePagesToRoutes(pages);
 * console.log(routes);
 *
 * // [
 * //   {
 * //     url: "/slashes",
 * //     lang: "en",
 * //     lastmod: "2023-10-01T14:30:00.000Z",
 * //     changefreq: "weekly",
 * //     priority: 0.7,
 * //     alternateVersions: { fr: "/barres-obliques" },
 * //   },
 * //   {
 * //     url: "/fr/barres-obliques",
 * //     lang: "fr",
 * //     lastmod: "2023-10-01T14:45:00.000Z",
 * //     changefreq: "weekly",
 * //     priority: 0.7,
 * //     alternateVersions: { en: "/slashes" },
 * //   },
 * // ]
 * ```
 *
 * @todo Extend to support different changefreq and priority based on page type.
 */
function parsePagesToRoutes(pages: Page[]): RouteEntry[] {
  const routes: Array<RouteEntry> = [];

  pages.forEach(page => {
    const {
      lang,
      lastmod,
      type,
      changefreq = pageSitemapConfig[type].changefreq,
      priority = pageSitemapConfig[type].priority,
      slugTranslations,
    } = page;

    /**
     * Remove current lang from alternate versions (if it was left by error)
     *  e.g. if current page is "en", and
     *   page.slugTranslations = { en: "slashes", fr: "barres-obliques" }
     *  then:
     *   alternateVersions = { fr: "/barres-obliques" }
     */
    const { [lang]: _, ...alternateVersions } = slugTranslations as Record<Locale, string>;

    routes.push({
      url: getLocalizedURL(page, lang),
      lang,
      lastmod: isPageDirty(page) ? new Date() : lastmod,
      changefreq,
      priority,
      alternateVersions,
    });
  });

  return routes;
}

/**
 *
 * @param routes the list of routes to convert to sitemap items
 * @returns a valid sitemap XML string
 *
 * @example
 * ```
 * const routes = [
 *  {
 *   url: "/only-en-page",
 *   lang: "en",
 *   lastmod: "2023-10-01T14:30:00.000Z",
 *   changefreq: "weekly",
 *   priority: 0.7,
 *   alternateVersions: {},
 *  },
 *  {
 *     url: "/slashes",
 *     lang: "en",
 *     lastmod: "2023-10-01T14:30:00.000Z",
 *     changefreq: "weekly",
 *     priority: 0.7,
 *     alternateVersions: { fr: "/barres-obliques" },
 *   },
 *   {
 *     url: "/fr/barres-obliques",
 *     lang: "fr",
 *     lastmod: "2023-10-01T14:45:00.000Z",
 *     changefreq: "weekly",
 *     priority: 0.7,
 *     alternateVersions: { en: "/slashes" },
 *   },
 * ];
 *
 * const sitemap = renderSitemapFromRoutes("https://example.com", routes);
 * console.log(sitemap);
 *
 * // <?xml version="1.0" encoding="UTF-8"?>
 * // <urlset
 * //   xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 * //   xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
 * //   xmlns:xhtml="http://www.w3.org/1999/xhtml"
 * //   xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
 * //   xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
 * // >
 * //   <url>
 * //     <loc>https://example.com/only-en-page</loc>
 * //     <lastmod>2023-10-01T14:30:00.000Z</lastmod>
 * //     <changefreq>weekly</changefreq>
 * //     <priority>0.7</priority>
 * //   </url>
 * //   <url>
 * //     <loc>https://example.com/slashes</loc>
 * //     <lastmod>2023-10-01T14:30:00.000Z</lastmod>
 * //     <changefreq>weekly</changefreq>
 * //     <priority>0.7</priority>
 * //     <xhtml:link
 * //       rel="alternate"
 * //       hreflang="fr"
 * //       href="https://example.com/fr/barres-obliques"
 * //     />
 * //   </url>
 * //   <url>
 * //     <loc>https://example.com/fr/barres-obliques</loc>
 * //     <lastmod>2023-10-01T14:45:00.000Z</lastmod>
 * //     <changefreq>weekly</changefreq>
 * //     <priority>0.7</priority>
 * //     <xhtml:link
 * //       rel="alternate"
 * //       hreflang="en"
 * //       href="https://example.com/slashes"
 * //     />
 * //   </url>
 * // </urlset>
 * ```
 *
 * @todo Try to add a styled XSLT to the sitemap XML.
 * @todo Add error handling for invalid routes or missing data.
 * @todo Write unit tests to cover various route formats and edge cases.
 * @todo Consider using a library for XML generation to ensure proper escaping and formatting.
 * @todo Optimize for large sitemaps (e.g. pagination, compression, etc.).
 * @todo Extend to support images, videos, news, etc.
 */
function renderSitemapFromRoutes(baseUrl: string, routes: RouteEntry[]): string {
  const urlsetAttributes = `
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
  `;

  let sitemapXml = `<urlset ${urlsetAttributes}>`;

  routes.forEach(route => {
    let urlXml = `
      <url>
        <loc>${getSanitizedURL(`${baseUrl}/${route.url}`)}</loc>
        <lastmod>${route.lastmod.toISOString()}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    `;

    const alternateVersions = Object.entries(route.alternateVersions) as Array<[Locale, string]>;

    if (alternateVersions.length > 0) {
      alternateVersions.forEach(([lang, localUrl]) => {
        urlXml += `
          <xhtml:link 
            rel="alternate" 
            hreflang="${lang}" 
            href="${getSanitizedURL(`${baseUrl}/${localUrl}`)}" 
          />
        `;
      });
    }

    urlXml += `</url>`;
    sitemapXml += urlXml;
  });

  sitemapXml += `</urlset>`;

  return sitemapXml;
}

function printConsoleLogs(flag: boolean): void {
  if (!flag) return;

  const indexableCount = indexablePages.length;
  const nonIndexableCount = nonIndexablePages.length;
  const totalPagesCount = indexableCount + nonIndexableCount;

  const dirtyCount = dirtyPages.length;
  const cleanCount = cleanPages.length;

  console.debug("\n");
  console.debug(`${YELLOW}Since the \`--verbose\` flag was passed...${RESET}`);
  console.debug(`${GRAY}****************************************************************${RESET}`);

  console.debug(`${GRAY}DEFAULT_LOCALE = ${DEFAULT_LOCALE}${RESET}`);
  console.debug("\n");

  console.debug(`${GRAY}Discoverable page formats:\n   .${DISCOVERABLE_PAGE_FORMATS.join(", .")}${RESET}`);
  console.debug("\n");

  console.debug(`${BLUE}${totalPagesCount} discovered pages${RESET}`);
  console.debug(`${RED}   └─ ${nonIndexableCount} non-indexed pages\t(excluded)${RESET}`);
  console.debug(`${GREEN}   └─ ${indexableCount} indexed pages \t\t(included)${RESET}`);
  console.debug(`${ORANGE}\t └─ ${dirtyCount} dirty pages\t(indexed with an updated lastmod)${RESET}`);
  console.debug(`${MAGENTA}\t └─ ${cleanCount} clean pages\t(indexed as-is)${RESET}`);
  console.debug("\n");

  console.debug(`${RED}Excluded Pages:\t\t   ${nonIndexablePages.length}${RESET}`);
  nonIndexablePages.forEach(page => console.debug(`${RED}(${page.lang}) /${page.slug}${RESET}`));
  console.debug("\n");

  console.debug(`${GREEN}Included Pages:\t\t   ${indexablePages.length}${RESET}`);
  indexablePages.forEach(page => console.debug(`${GREEN}(${page.lang}) /${page.slug}${RESET}`));
  console.debug("\n");

  console.debug(`${ORANGE}Dirty Pages:\t\t   ${dirtyPages.length}${RESET}`);
  dirtyPages.forEach(page => console.debug(`${ORANGE}(${page.lang}) /${page.slug}${RESET}`));
  console.debug("\n");

  console.debug(`${MAGENTA}Clean Pages:\t\t   ${cleanPages.length}${RESET}`);
  cleanPages.forEach(page => console.debug(`${MAGENTA}(${page.lang}) /${page.slug}${RESET}`));

  console.debug(`${GRAY}****************************************************************${RESET}`);
  console.debug(`${YELLOW}Don't want to see this? Remove the \`--verbose\` flag when rebuilding the project.${RESET}`);
}

export async function GET(): Promise<Response> {
  console.log("\n\t\tGenerating sitemap.xml...");

  const BASE_URL = process.env.BASE_URL;

  if (!BASE_URL && process.env.NODE_ENV === "production") {
    console.error(`\n${RED_BG}BASE_URL is not defined. Skipped updating the sitemap during this build.${RESET}\n`);

    console.warn(
      `${RED}Verify BASE_URL is included in the .env file, then rebuild the project.\nThe sitemap will then be generated as expected.${RESET}\n`
    );

    console.log(`${YELLOW}Continuing the build without updating the sitemap...${RESET}\n`);

    return new Response("BASE_URL is not defined", { status: 500 });
  }

  const pagesToIndex = getIndexablePages();
  const indexableRoutes = parsePagesToRoutes(pagesToIndex);

  const sitemapXml = renderSitemapFromRoutes(BASE_URL!, indexableRoutes);

  const isVerboseRun = process.env.npm_config_loglevel?.includes("verbose") || false;
  printConsoleLogs(isVerboseRun);

  console.log(`${GREEN}\t\tsitemap.xml was generated successfully!${RESET}`);

  return new Response(sitemapXml, {
    headers: { "Content-Type": "application/xml" },
  });
}

const DEFAULT_SITE_URL = 'https://civiclens.codingliquids.com';

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const siteConfig = {
  name: 'CivicLens',
  shortName: 'CivicLens',
  creator: 'Coding Liquids',
  description:
    'Report potholes, broken streetlights, graffiti, and other local issues so civic teams can respond faster.',
  keywords: [
    'civic issue reporting',
    '311 alternative',
    'municipal issue tracker',
    'pothole reporting',
    'streetlight repair reporting',
    'community problem reporting',
    'CivicLens',
    'Coding Liquids',
  ],
  get url() {
    return trimTrailingSlash(
      process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL
    );
  },
  get ogImage() {
    return `${this.url}/og-card.svg`;
  },
};

export function getAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

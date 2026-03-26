const DEFAULT_SITE_URL = 'https://civiclens.codingliquids.com';

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const siteConfig = {
  name: 'CivicLens',
  shortName: 'CivicLens',
  creator: 'Sagnik Bhattacharya',
  creatorUrl: 'https://sagnikbhattacharya.com',
  publisher: 'Coding Liquids',
  description:
    'Report potholes, broken streetlights, graffiti, and other local issues so civic teams can respond faster. CivicLens is an open-source civic-tech platform for smarter municipal operations.',
  keywords: [
    'civic issue reporting',
    '311 alternative',
    'municipal issue tracker',
    'pothole reporting',
    'streetlight repair reporting',
    'community problem reporting',
    'smart city platform',
    'citizen engagement tool',
    'civic tech',
    'gov tech',
    'municipal operations software',
    'local government software',
    'neighborhood reporting app',
    'public works management',
    'CivicLens',
    'Sagnik Bhattacharya',
    'Coding Liquids',
  ],
  licensingEmail: 'hello@sagnikbhattacharya.com',
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

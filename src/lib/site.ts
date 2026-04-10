const DEFAULT_SITE_URL = 'https://civiclens.codingliquids.com';
const DEFAULT_CONTACT_URL = 'https://sagnikbhattacharya.com/contact';
const DEFAULT_CONTACT_EMAIL = 'hello@sagnikbhattacharya.com';
const DEFAULT_PUBLISHER_URL = 'https://codingliquids.com';

function trimTrailingSlash(value: string) {
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export const siteConfig = {
  name: 'CivicLens',
  shortName: 'CivicLens',
  creator: 'Sagnik Bhattacharya',
  creatorUrl: 'https://sagnikbhattacharya.com',
  publisher: 'Coding Liquids',
  tagline: 'White-label civic issue reporting software',
  description:
    'Proprietary white-label civic issue reporting software for municipalities, campuses, and managed communities. License a branded resident portal and staff dashboard, or acquire the platform outright with deployment and implementation guidance.',
  keywords: [
    'white-label 311 software',
    'white-label 311 software license',
    'civic reporting software',
    'civic reporting software licensing',
    'municipal reporting software',
    'resident issue reporting portal',
    'civic issue management software',
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
    'municipal software procurement',
    'municipal operations software',
    'local government software',
    'neighborhood reporting app',
    'public works management',
    'campus issue reporting software',
    'white-label civic platform',
    'CivicLens',
    'Sagnik Bhattacharya',
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
  get contactUrl() {
    return process.env.NEXT_PUBLIC_CONTACT_URL ?? process.env.CONTACT_URL ?? DEFAULT_CONTACT_URL;
  },
  get contactEmail() {
    return (
      process.env.NEXT_PUBLIC_CONTACT_EMAIL ??
      process.env.CONTACT_EMAIL ??
      DEFAULT_CONTACT_EMAIL
    );
  },
  get publisherUrl() {
    return (
      process.env.NEXT_PUBLIC_PUBLISHER_URL ??
      process.env.PUBLISHER_URL ??
      DEFAULT_PUBLISHER_URL
    );
  },
};

export function getAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

const DEFAULT_SITE_URL = 'https://civiclens.codingliquids.com';
const DEFAULT_CONTACT_URL = 'https://sagnikbhattacharya.com/contact';

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
    'White-label civic issue reporting software for municipalities, campuses, and property portfolios. Launch a branded resident portal, photo-backed issue intake, and a staff dashboard without a long custom build.',
  keywords: [
    'white-label 311 software',
    'civic reporting software',
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
    'municipal operations software',
    'local government software',
    'neighborhood reporting app',
    'public works management',
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
};

export function getAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${normalizedPath}`;
}

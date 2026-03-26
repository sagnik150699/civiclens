export const SESSION_COOKIE_NAME = 'civiclens-session';
const DEV_ADMIN_USERNAME = 'admin';
const DEV_ADMIN_PASSWORD = 'admin';

export interface AdminSession {
  user: string;
  loggedIn: true;
  issuedAt: number;
}

export function parseAdminSession(rawValue?: string | null): AdminSession | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<AdminSession>;
    if (parsed.loggedIn === true && typeof parsed.user === 'string' && typeof parsed.issuedAt === 'number') {
      return parsed as AdminSession;
    }
  } catch {
    return null;
  }

  return null;
}

function getConfiguredAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD;

  if (username && password) {
    return {
      configured: true,
      username,
      password,
      usingDevelopmentFallback: false,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    return {
      configured: true,
      username: DEV_ADMIN_USERNAME,
      password: DEV_ADMIN_PASSWORD,
      usingDevelopmentFallback: true,
    };
  }

  return {
    configured: false,
    username: '',
    password: '',
    usingDevelopmentFallback: false,
  };
}

export function validateAdminCredentials(username: string, password: string) {
  const credentials = getConfiguredAdminCredentials();

  if (!credentials.configured) {
    return {
      success: false as const,
      message:
        'Admin login is not configured. Set ADMIN_USERNAME and ADMIN_PASSWORD in your environment before signing in.',
    };
  }

  if (username === credentials.username && password === credentials.password) {
    return {
      success: true as const,
      session: {
        user: credentials.username,
        loggedIn: true as const,
        issuedAt: Date.now(),
      },
      usedDevelopmentFallback: credentials.usingDevelopmentFallback,
    };
  }

  return {
    success: false as const,
    message: 'Invalid username or password.',
  };
}

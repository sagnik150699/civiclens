export const SESSION_COOKIE_NAME = 'civiclens-session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 5; // 5 days

const DEV_ADMIN_USERNAME = 'admin';
const DEV_ADMIN_PASSWORD = 'admin';
const DEV_SESSION_SECRET = 'civiclens-development-session-secret';

export interface AdminSession {
  user: string;
  loggedIn: true;
  issuedAt: number;
}

const encoder = new TextEncoder();

function base64UrlEncode(bytes: Uint8Array) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function constantTimeEqual(left: string, right: string) {
  const leftBytes = encoder.encode(left);
  const rightBytes = encoder.encode(right);
  let mismatch = leftBytes.length ^ rightBytes.length;
  const length = Math.max(leftBytes.length, rightBytes.length);
  for (let index = 0; index < length; index += 1) {
    mismatch |= (leftBytes[index] ?? 0) ^ (rightBytes[index] ?? 0);
  }
  return mismatch === 0;
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

/**
 * Resolves the secret used to sign session cookies.
 *
 * Prefer a dedicated SESSION_SECRET. When it is not set, fall back to the admin
 * credentials so existing deployments keep working; rotating the password then
 * also invalidates every existing session. Outside production a fixed
 * development secret is used so local sign-in works without configuration.
 */
function getSessionSecret(): string | null {
  const explicit = process.env.SESSION_SECRET?.trim();
  if (explicit) {
    return explicit;
  }

  const credentials = getConfiguredAdminCredentials();
  if (credentials.configured && !credentials.usingDevelopmentFallback) {
    return `${credentials.username}:${credentials.password}`;
  }

  if (process.env.NODE_ENV !== 'production') {
    return DEV_SESSION_SECRET;
  }

  return null;
}

async function importSigningKey(secret: string) {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
}

async function signPayload(payload: string, secret: string) {
  const key = await importSigningKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return base64UrlEncode(new Uint8Array(signature));
}

function isAdminSession(value: unknown): value is AdminSession {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const candidate = value as Partial<AdminSession>;
  return (
    candidate.loggedIn === true &&
    typeof candidate.user === 'string' &&
    typeof candidate.issuedAt === 'number' &&
    Number.isFinite(candidate.issuedAt)
  );
}

/**
 * Serializes a session into a signed cookie value: `<base64url(payload)>.<base64url(hmac)>`.
 */
export async function createSessionToken(session: AdminSession): Promise<string> {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('Session signing is not configured. Set SESSION_SECRET or the admin credentials.');
  }

  const payload = base64UrlEncode(encoder.encode(JSON.stringify(session)));
  const signature = await signPayload(payload, secret);
  return `${payload}.${signature}`;
}

/**
 * Verifies a signed session cookie. Returns null for missing, malformed,
 * tampered, or expired tokens. Works in both the Node.js and Edge runtimes.
 */
export async function parseAdminSession(rawValue?: string | null): Promise<AdminSession | null> {
  if (!rawValue) {
    return null;
  }

  const secret = getSessionSecret();
  if (!secret) {
    return null;
  }

  const separatorIndex = rawValue.lastIndexOf('.');
  if (separatorIndex <= 0) {
    return null;
  }

  const payload = rawValue.slice(0, separatorIndex);
  const providedSignature = rawValue.slice(separatorIndex + 1);

  try {
    const expectedSignature = await signPayload(payload, secret);
    if (!constantTimeEqual(providedSignature, expectedSignature)) {
      return null;
    }

    const parsed: unknown = JSON.parse(new TextDecoder().decode(base64UrlDecode(payload)));
    if (!isAdminSession(parsed)) {
      return null;
    }

    const ageSeconds = (Date.now() - parsed.issuedAt) / 1000;
    if (ageSeconds < 0 || ageSeconds > SESSION_MAX_AGE_SECONDS) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
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

  const usernameMatches = constantTimeEqual(username, credentials.username);
  const passwordMatches = constantTimeEqual(password, credentials.password);

  if (usernameMatches && passwordMatches) {
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

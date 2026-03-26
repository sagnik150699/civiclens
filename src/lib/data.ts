
import { ISSUE_CATEGORIES, ISSUE_STATUSES, ISSUE_PRIORITIES } from './constants';

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]['value'];
export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

interface FirestoreTimestampLike {
  toDate: () => Date;
}

export interface IssueReport {
  id: string;
  description: string;
  category: IssueCategory;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  photoUrl: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  reason: string;
  createdAt: Date;
}

export interface IssueReportFirestore {
  description: string;
  category: IssueCategory;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  photoUrl: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  reason: string;
  createdAt: FirestoreTimestampLike | Date | string | number | null | undefined;
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function getNumericValue(value: unknown) {
  if (isFiniteNumber(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return null;
}

function normalizeDate(value: IssueReportFirestore['createdAt']) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
    const converted = value.toDate();
    if (converted instanceof Date && !Number.isNaN(converted.getTime())) {
      return converted;
    }
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const converted = new Date(value);
    if (!Number.isNaN(converted.getTime())) {
      return converted;
    }
  }

  return new Date(0);
}

function normalizeLocation(value: unknown) {
  if (value && typeof value === 'object') {
    const maybeLat = getNumericValue('lat' in value ? value.lat : undefined);
    const maybeLng = getNumericValue('lng' in value ? value.lng : undefined);
    if (maybeLat !== null && maybeLng !== null) {
      return { lat: maybeLat, lng: maybeLng };
    }

    const maybeLatitude = getNumericValue('latitude' in value ? value.latitude : undefined);
    const maybeLongitude = getNumericValue('longitude' in value ? value.longitude : undefined);
    if (maybeLatitude !== null && maybeLongitude !== null) {
      return { lat: maybeLatitude, lng: maybeLongitude };
    }
  }

  return { lat: 0, lng: 0 };
}

export function normalizeIssueRecord(
  id: string,
  value: Partial<IssueReportFirestore>
): IssueReport {
  const category =
    typeof value.category === 'string' &&
    ISSUE_CATEGORIES.some((item) => item.value === value.category)
      ? (value.category as IssueCategory)
      : ISSUE_CATEGORIES[0].value;

  const status =
    typeof value.status === 'string' && ISSUE_STATUSES.includes(value.status as IssueStatus)
      ? (value.status as IssueStatus)
      : ISSUE_STATUSES[0];

  const priority =
    typeof value.priority === 'string' &&
    ISSUE_PRIORITIES.includes(value.priority as IssuePriority)
      ? (value.priority as IssuePriority)
      : ISSUE_PRIORITIES[1];

  return {
    id,
    description: typeof value.description === 'string' ? value.description : 'No description provided.',
    category,
    location: normalizeLocation(value.location),
    address: typeof value.address === 'string' ? value.address : 'Address unavailable',
    photoUrl: typeof value.photoUrl === 'string' && value.photoUrl.length > 0 ? value.photoUrl : null,
    status,
    priority,
    reason:
      typeof value.reason === 'string' && value.reason.trim().length > 0
        ? value.reason
        : 'Awaiting review',
    createdAt: normalizeDate(value.createdAt),
  };
}

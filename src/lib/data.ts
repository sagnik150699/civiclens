import type { Timestamp } from 'firebase/firestore';
import type { ISSUE_CATEGORIES, ISSUE_STATUSES, ISSUE_PRIORITIES } from './constants';

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]['value'];
export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

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
  createdAt: Timestamp;
}

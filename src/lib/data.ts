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

// In-memory "database"
let issues: IssueReport[] = [
    {
        id: '1',
        description: 'Large pothole on the main street near the library. It is causing traffic issues.',
        category: 'pothole',
        location: { lat: 34.0522, lng: -118.2437 },
        address: '123 Main St, Los Angeles, CA',
        photoUrl: 'https://picsum.photos/400/300?grayscale',
        status: 'Submitted',
        priority: 'High',
        reason: 'The pothole is on a main street and is causing traffic issues, which makes it a high priority.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
        id: '2',
        description: 'Streetlight is flickering on and off at the corner of Oak & Pine.',
        category: 'streetlight_out',
        location: { lat: 34.055, lng: -118.245 },
        address: 'Corner of Oak & Pine, Los Angeles, CA',
        photoUrl: 'https://picsum.photos/400/300?blur=2',
        status: 'Acknowledged',
        priority: 'Medium',
        reason: 'A flickering streetlight can be a safety hazard at night, but is not as urgent as a major road obstruction.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    },
    {
        id: '3',
        description: 'Trash can in the park is overflowing.',
        category: 'trash_overflow',
        location: { lat: 34.05, lng: -118.24 },
        address: 'Central Park, Los Angeles, CA',
        photoUrl: 'https://picsum.photos/400/300',
        status: 'Resolved',
        priority: 'Low',
        reason: 'While unsightly, an overflowing trash can does not pose an immediate danger.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    }
];

export const getIssues = async (): Promise<IssueReport[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return issues.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const addIssue = async (issue: Omit<IssueReport, 'id' | 'createdAt'>) => {
    const newIssue: IssueReport = {
        ...issue,
        id: Date.now().toString(),
        createdAt: new Date(),
    };
    issues.push(newIssue);
    return newIssue;
}

export const updateIssueStatus = async (id: string, status: IssueStatus): Promise<IssueReport | null> => {
    const issueIndex = issues.findIndex(issue => issue.id === id);
    if (issueIndex > -1) {
        issues[issueIndex].status = status;
        return issues[issueIndex];
    }
    return null;
}

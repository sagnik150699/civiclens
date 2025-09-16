import type { IssueReport, IssueStatus } from '../data';

let mockIssues: IssueReport[] = [
    {
        id: '1',
        description: 'Large pothole on the corner of Main and 1st.',
        category: 'pothole',
        location: { lat: 34.0522, lng: -118.2437 },
        address: '100 N Main St, Los Angeles, CA 90012',
        photoUrl: 'https://picsum.photos/seed/1/600/400',
        status: 'Submitted',
        priority: 'High',
        reason: 'Multiple cars have reported tire damage.',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
        id: '2',
        description: 'Streetlight is flickering and seems to be out most of the night.',
        category: 'streetlight_out',
        location: { lat: 34.055, lng: -118.245 },
        address: '250 N Spring St, Los Angeles, CA 90012',
        photoUrl: 'https://picsum.photos/seed/2/600/400',
        status: 'Acknowledged',
        priority: 'Medium',
        reason: 'Awaiting crew assignment.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: '3',
        description: 'Public trash can is overflowing at the bus stop.',
        category: 'trash_overflow',
        location: { lat: 34.050, lng: -118.250 },
        address: '50 W 1st St, Los Angeles, CA 90012',
        photoUrl: null,
        status: 'In Progress',
        priority: 'Low',
        reason: 'Sanitation crew dispatched.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
        id: '4',
        description: 'Graffiti on the wall of the public library.',
        category: 'graffiti',
        location: { lat: 34.054, lng: -118.242 },
        address: '630 W 5th St, Los Angeles, CA 90071',
        photoUrl: 'https://picsum.photos/seed/4/600/400',
        status: 'Resolved',
        priority: 'Medium',
        reason: 'Clean-up completed on 2024-07-18.',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    }
];

// Functions to interact with the mock database
export function getIssues(): IssueReport[] {
  return mockIssues.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function addIssue(issue: Omit<IssueReport, 'id' | 'createdAt'>): IssueReport {
  const newIssue: IssueReport = {
    ...issue,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  mockIssues.unshift(newIssue);
  return newIssue;
}

export function updateIssueStatus(id: string, status: IssueStatus): boolean {
    const issueIndex = mockIssues.findIndex(issue => issue.id === id);
    if (issueIndex > -1) {
        mockIssues[issueIndex].status = status;
        return true;
    }
    return false;
}

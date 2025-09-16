
import type { IssueReport } from '@/lib/data';

// In-memory array to act as a mock database
export const mockIssues: IssueReport[] = [
  {
    id: '1',
    category: 'pothole',
    description: 'Large pothole on the main road, very dangerous for cyclists.',
    address: '123 Main St, Los Angeles, CA 90001',
    location: { lat: 34.0522, lng: -118.2437 },
    photoUrl: 'https://picsum.photos/seed/1/400/300',
    status: 'Submitted',
    priority: 'High',
    reason: 'Safety hazard',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '2',
    category: 'streetlight_out',
    description: 'The streetlight at the corner of Elm and Oak has been out for a week.',
    address: '456 Elm St, Los Angeles, CA 90002',
    location: { lat: 34.055, lng: -118.245 },
    photoUrl: 'https://picsum.photos/seed/2/400/300',
    status: 'Acknowledged',
    priority: 'Medium',
    reason: 'Awaiting repair crew',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: '3',
    category: 'trash_overflow',
    description: 'The public trash can is overflowing and attracting pests.',
    address: '789 Oak Ave, Los Angeles, CA 90003',
    location: { lat: 34.05, lng: -118.25 },
    photoUrl: 'https://picsum.photos/seed/3/400/300',
    status: 'In Progress',
    priority: 'Medium',
    reason: 'Sanitation crew dispatched',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '4',
    category: 'graffiti',
    description: 'Graffiti on the park bench.',
    address: '101 Park Rd, Los Angeles, CA 90004',
    location: { lat: 34.06, lng: -118.26 },
    photoUrl: null,
    status: 'Resolved',
    priority: 'Low',
    reason: 'Cleaned by city services',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
  },
    {
    id: '5',
    category: 'abandoned_vehicle',
    description: 'An old blue sedan has been parked here for over a month.',
    address: '210 Industrial Way, Los Angeles, CA 90005',
    location: { lat: 34.04, lng: -118.23 },
    photoUrl: 'https://picsum.photos/seed/5/400/300',
    status: 'Submitted',
    priority: 'Medium',
    reason: 'Awaiting verification',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

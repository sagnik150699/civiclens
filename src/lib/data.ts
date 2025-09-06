import { adminDb } from './firebase-admin';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, Timestamp } from 'firebase/firestore';
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

export const getIssues = async (): Promise<IssueReport[]> => {
  try {
    if (!adminDb) throw new Error('Firestore not initialized');
    const db = adminDb as any;
    const issuesCollection = collection(db, 'issues');
    const q = query(issuesCollection, orderBy('createdAt', 'desc'));
    const issuesSnapshot = await getDocs(q);
    const issuesList = issuesSnapshot.docs.map(doc => {
      const data = doc.data() as IssueReportFirestore;
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
      };
    });
    return issuesList;
  } catch (error) {
    console.error('Error fetching issues from Firestore: ', error);
    return [];
  }
};

export const addIssue = async (issue: Omit<IssueReport, 'id' | 'createdAt'>) => {
    if (!adminDb) throw new Error('Firestore not initialized');
    const db = adminDb as any;
    const newIssue = {
        ...issue,
        createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'issues'), newIssue);
    return { ...newIssue, id: docRef.id, createdAt: newIssue.createdAt.toDate() };
}

export const updateIssueStatus = async (id: string, status: IssueStatus): Promise<boolean> => {
    if (!adminDb) {
        console.error('Firestore not initialized');
        return false;
    }
    const db = adminDb as any;
    const issueRef = doc(db, 'issues', id);
    try {
        await updateDoc(issueRef, { status });
        return true;
    } catch (error) {
        console.error('Error updating status in Firestore: ', error);
        return false;
    }
}

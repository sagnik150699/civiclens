# CivicLens: Community Issue Reporting Platform

CivicLens is a modern, full-stack web application designed to empower citizens to report civic issues directly to their local government. From potholes to broken streetlights, users can quickly submit reports with photos and location data. The platform features an administrative dashboard where municipal staff can view, manage, and prioritize these issues, facilitated by an AI-powered analysis of incoming reports.

This project was built with Firebase Studio.

## Features

*   **Public Issue Reporting**: An intuitive form for users to submit issues, including category, description, address, and a photo.
*   **Geolocation**: Automatically detects the user's location to simplify address entry.
*   **Image Uploads**: Securely uploads and stores user-submitted photos with Firebase Storage.
*   **AI-Powered Prioritization**: Leverages a Google Genkit flow to analyze the report's content and photo, automatically assigning a priority level (High, Medium, or Low).
*   **Secure Admin Dashboard**: A password-protected dashboard for staff to manage and track all reported issues.
*   **Interactive Map**: Displays all reported issues on a map for easy visualization of problem areas.
*   **Issue Filtering & Management**: Admins can filter issues by category, priority, and status, and update the status as work progresses.
*   **Authentication**: A simple session-based authentication system for the admin dashboard.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **AI Integration**: [Google AI & Genkit](https://firebase.google.com/docs/genkit)
*   **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons.
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Firebase Storage, Firebase Authentication)

---

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   A Firebase project.

### 1. Firebase Setup

1.  **Create a Firebase Project**: If you don't have one already, create a new project in the [Firebase Console](https://console.firebase.google.com/).
2.  **Enable Services**:
    *   Go to **Build > Firestore Database** and create a database.
    *   Go to **Build > Storage** and enable it.
3.  **Set Security Rules**:
    *   **Firestore Rules** (`/firestore/rules` in the console):
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            match /issues/{issueId} {
              allow read: if false;
              allow create: if true;
              allow update, delete: if false;
            }
          }
        }
        ```
    *   **Storage Rules** (`/storage/rules` in the console):
        ```
        rules_version = '2';
        service firebase.storage {
          match /b/{bucket}/o {
            match /{allPaths=**} {
              allow read: if true;
              allow write: if request.resource.size < 4 * 1024 * 1024
                           && request.resource.contentType.matches('image/.*');
            }
          }
        }
        ```

### 2. Environment Variables

This project uses environment variables to connect to Firebase. You will need to get your Firebase project's configuration keys and add them to the project.

### 3. Running the Application

Once your environment is configured, you can run the application locally:

```bash
npm run dev
```

This will start the development server, typically on `http://localhost:9002`.

---

## Connect With Me

*   **YouTube**: [Your YouTube Channel URL]
*   **Udemy**: [Your Udemy Profile URL]
*   **LinkedIn**: [Your LinkedIn Profile URL]

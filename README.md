# CivicLens: Community Issue Reporting Platform

CivicLens is a modern, full-stack web application designed to empower citizens to report civic issues directly to their local government. From potholes to broken streetlights, user can quickly submit reports with photos and location data. The platform features an administrative dashboard where municipal staff can view, manage, and prioritize these issues.

This project was built with Firebase Studio.

## Features

*   **Public Issue Reporting**: An intuitive form for users to submit issues, including category, description, address, and a photo.
*   **Geolocation**: Automatically detects the user's location to simplify address entry.
*   **Image Uploads**: Securely uploads and stores user-submitted photos.
*   **Secure Admin Dashboard**: A password-protected dashboard for staff to manage and track all reported issues.
*   **Interactive Map**: Displays all reported issues on a map for easy visualization of problem areas.
*   **Issue Filtering & Management**: Admins can filter issues by category, priority, and status, and update the status as work progresses.
*   **Authentication**: A simple session-based authentication system for the admin dashboard.

## Tech Stack

*   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **UI**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
*   **Components**: [shadcn/ui](https://ui.shadcn.com/) & [Lucide React](https://lucide.dev/guide/packages/lucide-react) for icons.
*   **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Firebase Storage)

---

## Getting Started

### Prerequisites

*   Node.js (v18 or later)
*   A Firebase project.

### Environment Variables

This project uses environment variables to connect to Firebase. You will need to get your Firebase project's configuration keys and add them to the project.

### Running the Application

Once your environment is configured, you can run the application locally:

```bash
npm run dev
```

This will start the development server, typically on `http://localhost:9002`.

---

## Built By

Sagnik Bhattacharya
*   **YouTube**: [youtube.com/@sagnikteaches](https://www.youtube.com/@sagnikteaches)
*   **Udemy**: [udemy.com/user/sagnik-bhattacharya-5/](https://www.udemy.com/user/sagnik-bhattacharya-5/)
*   **LinkedIn**: [linkedin.com/in/sagnik-bhattacharya-916b9463/](https://www.linkedin.com/in/sagnik-bhattacharya-916b9463/)

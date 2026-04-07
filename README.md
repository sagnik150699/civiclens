<p align="center">
  <img src="https://raw.githubusercontent.com/sagnik150699/Sagnik-Bhattacharya/master/public/sagnik-bhattacharya.png" alt="Sagnik Bhattacharya" width="180">
</p>
Website: [sagnikbhattacharya.com](https://sagnikbhattacharya.com)

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

For Firebase Admin access, provide one of the following:

* `FIREBASE_SERVICE_ACCOUNT`: A JSON string of your Firebase service-account credentials. This should include the `project_id`, `client_email`, and `private_key` fields exactly as exported from the Google Cloud Console.
* or set `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, and optionally `FIREBASE_PROJECT_ID` individually. The private key should preserve newline characters (use `"\n"` in `.env` files).
* or, when deploying on Firebase App Hosting, rely on Google Application Default Credentials and set `FIREBASE_PROJECT_ID` plus `FIREBASE_STORAGE_BUCKET`.

Regardless of which option you choose, ensure `FIREBASE_PRIVATE_KEY` (directly or within the JSON) is populated with your actual private key value, not a placeholder.

For file uploads you must also configure a Firebase Storage bucket. Set `FIREBASE_STORAGE_BUCKET` (preferred for server-side configuration) or `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` (shared client/server) to the bucket name. If neither variable is provided, the app will fall back to the bucket defined in `src/lib/firebase-client.ts` (default `civiclens-bexm4.firebasestorage.app`) or, if unavailable, to `${projectId}.firebasestorage.app`.

For admin access in production, set:

* `ADMIN_USERNAME`
* `ADMIN_PASSWORD`

For SEO and canonical URLs, set:

* `SITE_URL`
* `NEXT_PUBLIC_SITE_URL`

For buyer-facing contact CTAs, optionally set:

* `CONTACT_URL`
* `NEXT_PUBLIC_CONTACT_URL`

### Running the Application

Once your environment is configured, you can run the application locally:

```bash
npm run dev
```

This will start the development server, typically on `http://localhost:9002`.

For Firebase App Hosting with GitHub rollouts, see [`docs/firebase-app-hosting.md`](docs/firebase-app-hosting.md) and copy the values from [`.env.example`](.env.example).

---

## Built By

Sagnik Bhattacharya
*   **YouTube**: [youtube.com/@sagnikteaches](https://www.youtube.com/@sagnikteaches)
*   **Udemy**: [udemy.com/user/sagnik-bhattacharya-5/](https://www.udemy.com/user/sagnik-bhattacharya-5/)
*   **LinkedIn**: [linkedin.com/in/sagnik-bhattacharya-916b9463/](https://www.linkedin.com/in/sagnik-bhattacharya-916b9463/)

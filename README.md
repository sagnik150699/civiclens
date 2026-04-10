<p align="center">
  <img src="https://raw.githubusercontent.com/sagnik150699/Sagnik-Bhattacharya/master/public/sagnik-bhattacharya.png" alt="Sagnik Bhattacharya" width="180">
</p>
Website: [sagnikbhattacharya.com](https://sagnikbhattacharya.com)

# CivicLens: Proprietary White-Label Civic Issue Reporting Software

CivicLens is proprietary software owned by Sagnik Bhattacharya. It is not open source and it is not available for public deployment, redistribution, resale, or commercial use without a separate written agreement.

Organizations can work with CivicLens in only two ways:

*   **Commercial license** for a branded rollout.
*   **Outright acquisition** of the product under a separate written agreement.

Repository access is provided for evaluation, due diligence, and approved contribution workflows only, as described in the [LICENSE](LICENSE).

CivicLens is a modern full-stack platform for municipalities, campuses, and managed communities that need a branded civic issue reporting experience. Residents can submit reports with photos and map-based location data, while staff teams triage, prioritize, and resolve issues through an administrative dashboard.

This project was built with Firebase Studio.

## Commercial Model

*   **Ownership**: CivicLens and its source code remain the intellectual property of Sagnik Bhattacharya unless transferred under a separate outright acquisition agreement.
*   **Licensing**: Commercial use requires a written license agreement covering rollout scope, branding, hosting, implementation, and support expectations.
*   **Acquisition**: Buyers who want full ownership can discuss an outright purchase separately.
*   **Evaluation-only access**: If you do not have a signed commercial agreement, you may review the code for evaluation purposes only and may not deploy it publicly.

## Features

*   **White-label resident reporting**: A branded intake flow for issue category, description, address, exact map location, and photo evidence.
*   **Geolocation and map workflow**: Automatically detects user location and supports precise location capture.
*   **Secure image uploads**: Stores photo evidence for clearer staff triage.
*   **Staff operations dashboard**: A password-protected interface for reviewing, prioritizing, and updating reported issues.
*   **Interactive issue mapping**: Visualizes reports on a map so teams can spot problem areas quickly.
*   **Workflow management**: Staff can update categories, priorities, statuses, and notes as work progresses.
*   **Commercial rollout readiness**: Built to support branded deployments under license or as part of an outright acquisition.

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

The setup instructions below are intended for licensed customers, acquisition due diligence, or other authorized evaluation environments.

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

## Licensing and Acquisition

For commercial licensing, rollout discussions, or an outright acquisition inquiry, contact:

*   **Sagnik Bhattacharya**
*   **Email**: [hello@sagnikbhattacharya.com](mailto:hello@sagnikbhattacharya.com)
*   **Web**: [sagnikbhattacharya.com/contact](https://sagnikbhattacharya.com/contact)

## Built By

Sagnik Bhattacharya
*   **YouTube**: [youtube.com/@sagnikteaches](https://www.youtube.com/@sagnikteaches)
*   **Udemy**: [udemy.com/user/sagnik-bhattacharya-5/](https://www.udemy.com/user/sagnik-bhattacharya-5/)
*   **LinkedIn**: [linkedin.com/in/sagnik-bhattacharya-916b9463/](https://www.linkedin.com/in/sagnik-bhattacharya-916b9463/)

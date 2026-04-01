# Firebase App Hosting Setup

This project is prepared for Firebase App Hosting with a GitHub-connected rollout flow.

## Before you start

1. Make sure the Firebase project is on the Blaze plan.
2. Make sure Firestore and Cloud Storage are enabled in the same Firebase project.
3. Push this repository to GitHub.

## Create the backend

Use either the Firebase console or the Firebase CLI.

### Console flow

1. Open Firebase Console -> Build -> App Hosting.
2. Select `Get started` or `Create backend`.
3. Choose the GitHub repository for this project.
4. Set the app root directory to `/`.
5. Set the live branch to your deployment branch, typically `main`.
6. Enable automatic rollouts only for your production branch.
7. Pick a primary region close to your users. For US traffic, `us-east4` or `us-central1` is usually the right choice.
8. Finish the setup and let Firebase perform the first rollout.

### CLI flow

Use Firebase CLI `13.15.4` or newer:

```bash
firebase apphosting:backends:create --project civiclens-bexm4
```

The CLI will prompt for the region, GitHub connection, root directory, live branch, and rollout behavior.

## Required environment variables

This repo includes the variables App Hosting needs in [`apphosting.yaml`](/C:/Workspace/civiclens/apphosting.yaml).

Set or confirm these values in Firebase App Hosting:

- `SITE_URL`
- `NEXT_PUBLIC_SITE_URL`
- `CONTACT_URL`
- `NEXT_PUBLIC_CONTACT_URL`
- `FIREBASE_STORAGE_BUCKET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

If you want to override the baked-in Firebase web config, also set the `NEXT_PUBLIC_FIREBASE_*` variables from [`.env.example`](/C:/Workspace/civiclens/.env.example).

## Cost controls

This repo is tuned for a low-cost backend profile:

- `minInstances: 0` so there is no always-on instance charge.
- `maxInstances: 1` to cap scale-out spend for a low-traffic launch.
- `concurrency: 80` to let a single instance absorb light bursts before App Hosting tries to scale further.

If your traffic stays small, keep rollouts limited to `main` so you do not burn Cloud Build minutes and Artifact Registry storage on every branch push.

## Secrets

Store the admin credentials as App Hosting secrets:

```bash
firebase apphosting:secrets:set ADMIN_USERNAME --project civiclens-bexm4 --location YOUR_REGION
firebase apphosting:secrets:set ADMIN_PASSWORD --project civiclens-bexm4 --location YOUR_REGION
```

If you create secrets outside the guided flow, grant the backend access:

```bash
firebase apphosting:secrets:grantaccess ADMIN_USERNAME BACKEND_ID --project civiclens-bexm4 --location YOUR_REGION
firebase apphosting:secrets:grantaccess ADMIN_PASSWORD BACKEND_ID --project civiclens-bexm4 --location YOUR_REGION
```

## Storage and Admin SDK

The server code now supports Google Application Default Credentials, which is the authentication model App Hosting provides automatically at build time and runtime.

If issue photo uploads fail in production, add Cloud Storage object write permissions to the App Hosting service account:

`firebase-app-hosting-compute@PROJECT_ID.iam.gserviceaccount.com`

## Connect the custom subdomain

After the backend is live:

1. Open the App Hosting backend dashboard.
2. Open `Settings`.
3. Select `Add custom domain`.
4. Enter your subdomain, for example `civiclens.codingliquids.com`.
5. Copy the DNS records Firebase gives you into your DNS provider for `codingliquids.com`.
6. Wait for DNS verification and SSL provisioning to complete.

Do not leave old `A` or `CNAME` records pointing that subdomain somewhere else, or Firebase cannot finish certificate provisioning.

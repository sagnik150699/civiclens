// IMPORTANT: Do not share this file or commit it to a public repository.
// It contains sensitive private keys for your Firebase project.

// To get these values, go to your Firebase project settings, then "Service accounts",
// and generate a new private key. This will download a JSON file.
// Open that file and copy the values into the placeholders below.

export const firebaseCredentials = {
  projectId: "your-project-id", // <-- REPLACE with your project_id from the JSON file
  clientEmail: "your-client-email@your-project-id.iam.gserviceaccount.com", // <-- REPLACE with your client_email
  privateKey: "-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n", // <-- REPLACE with your private_key. Keep the \n characters.
};

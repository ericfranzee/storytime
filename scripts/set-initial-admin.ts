import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url'; // Import necessary function for ESM

// --- Calculate project root in ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..'); // Go up one level from /scripts

// Load environment variables from .env.local at the calculated project root
dotenv.config({ path: path.resolve(projectRoot, '.env.local') });


async function setInitialAdmin() {
  // --- Configuration ---
  // Get the target User ID from command line arguments
  const targetUserId = process.argv[2]; // Expecting: ts-node scripts/set-initial-admin.ts <USER_ID>

  if (!targetUserId) {
    console.error('Error: Please provide the target User ID as a command line argument.');
    console.log('Usage: ts-node scripts/set-initial-admin.ts <USER_ID>');
    process.exit(1);
  }

  // --- Firebase Admin Initialization ---
  // Ensure Firebase Admin SDK environment variables are loaded
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID; // Still needed for initialization check

  if (!clientEmail || !privateKey || !projectId) {
    console.error('Error: Missing Firebase Admin SDK environment variables (FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY, NEXT_PUBLIC_FIREBASE_PROJECT_ID) in .env.local');
    process.exit(1);
  }

  // Initialize Firebase Admin SDK if not already initialized
  if (!getApps().length) {
    try {
      console.log('Initializing Firebase Admin SDK...');
      initializeApp({
        credential: cert({
          clientEmail: clientEmail,
          privateKey: privateKey,
          // Project ID is inferred but good to have for checks
          projectId: projectId,
        }),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.error('Firebase admin initialization error:', error);
      process.exit(1);
    }
  } else {
    console.log('Firebase Admin SDK already initialized.');
  }

  const adminAuth = getAuth();

  // --- Set Custom Claim ---
  try {
    console.log(`Attempting to set isAdmin=true claim for user: ${targetUserId}`);

    // Fetch the user to ensure they exist before setting claims
    await adminAuth.getUser(targetUserId);
    console.log(`User ${targetUserId} found.`);

    // Set the custom claim
    await adminAuth.setCustomUserClaims(targetUserId, { isAdmin: true });
    console.log(`Successfully set isAdmin=true claim for user: ${targetUserId}`);
    console.log('Important: The user may need to log out and log back in for the claim to be reflected in their session cookie.');

  } catch (error: any) {
    console.error(`Error setting custom claim for user ${targetUserId}:`, error.message);
    if (error.code === 'auth/user-not-found') {
        console.error(`Could not find user with ID: ${targetUserId}`);
    }
    process.exit(1);
  }
}

// Run the function
setInitialAdmin();

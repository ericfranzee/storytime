import { NextResponse, NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { ListUsersResult } from 'firebase-admin/auth';

// Define the structure of the user data we want to return
interface UserListData {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
  creationTime?: string;
  lastSignInTime?: string;
  isAdmin: boolean; // From custom claims
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  usage?: number; // Add usage
  remainingUsage?: number; // Add remaining usage
}

export async function GET(request: NextRequest) {
  try {
    // 1. Verify the session cookie of the requesting user (must be admin)
    const sessionCookie = request.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Missing session cookie' }, { status: 401 });
    }

    let isRequestingUserAdmin = false;
    try {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      isRequestingUserAdmin = decodedToken.isAdmin === true;
    } catch (error) {
      console.error('Error verifying requestor session cookie:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    if (!isRequestingUserAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 });
    }

    // 2. Fetch users from Firebase Auth
    console.log('Fetching users from Firebase Auth...');
    const listUsersResult: ListUsersResult = await adminAuth.listUsers(1000); // Adjust limit as needed

    const users: UserListData[] = listUsersResult.users.map(userRecord => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      disabled: userRecord.disabled,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
      // Extract custom claim, default to false if not present
      isAdmin: userRecord.customClaims?.isAdmin === true,
    }));

    console.log(`Fetched ${users.length} users from Auth.`);

    // Fetch subscription data from Firestore for all fetched users
    // Note: For large numbers of users, fetching one-by-one can be slow.
    // Consider pagination in listUsers and fetching subscriptions in batches if performance becomes an issue.
    const usersWithSubscriptions: UserListData[] = [];
    for (const user of users) {
      try {
        const subQuery = adminDb.collection('subscriptions').where('userId', '==', user.uid).limit(1);
        const subSnapshot = await subQuery.get();
        let subPlan = 'N/A';
        let subStatus = 'N/A';
        let usage: number | undefined = undefined; // Define variables outside the if block
        let remainingUsage: number | undefined = undefined;

        if (!subSnapshot.empty) {
          const subData = subSnapshot.docs[0].data();
          subPlan = subData.subscriptionPlan || 'N/A';
          subStatus = subData.paymentStatus || 'N/A';
          // Assign usage fields, defaulting to 0 if not present or not a number
          usage = typeof subData.usage === 'number' ? subData.usage : 0;
          remainingUsage = typeof subData.remainingUsage === 'number' ? subData.remainingUsage : 0;
        }
        usersWithSubscriptions.push({
          ...user,
          subscriptionPlan: subPlan,
          subscriptionStatus: subStatus,
          usage: usage, // Pass the value (number or undefined)
          remainingUsage: remainingUsage, // Pass the value (number or undefined)
        });
      } catch (firestoreError) {
        console.error(`Error fetching subscription for user ${user.uid}:`, firestoreError);
        // Add user anyway, but indicate missing subscription data
        usersWithSubscriptions.push({
          ...user,
          subscriptionPlan: 'Error',
          subscriptionStatus: 'Error',
          usage: undefined, // Indicate error by omitting usage
          remainingUsage: undefined,
        });
      }
    }

    console.log(`Processed subscriptions for ${usersWithSubscriptions.length} users.`);

    return NextResponse.json({ users: usersWithSubscriptions }, { status: 200 });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}

// Optional: Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

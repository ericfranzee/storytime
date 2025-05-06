import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { adminAuth } from '@/lib/firebase-admin'; // Correctly import adminAuth
import { db } from '@/lib/firebase/firebase'; // Import the initialized db instance
// Removed firebase-admin/app imports and config import as initialization is handled in lib/firebase-admin.ts
// Removed getFirestore import as we now import the initialized db instance

// Define the structure of a history item (adjust based on actual stored data)
interface HistoryItem {
  id: string;
  createdAt: Timestamp; // Keep as Firestore Timestamp initially
  storyTitle: string;
  videoUrl: string;
  voiceUrl: string;
  imageUrls: string[];
  // Add other fields if they exist
}

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }
    const idToken = authorization.split('Bearer ')[1];

    let decodedToken;
    try {
      // Use the imported adminAuth directly
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (error) {
      console.error('Error verifying token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User ID not found in token' }, { status: 401 });
    }

    const historyCollectionRef = collection(db, `users/${userId}/generationHistory`);
    const historyQuery = query(
      historyCollectionRef,
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const querySnapshot = await getDocs(historyQuery);

    const historyItems = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamp to ISO string or milliseconds for JSON serialization
      const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt;
      
      return {
        id: doc.id,
        ...data,
        createdAt, // Overwrite with serialized date
      } as HistoryItem; // Cast to HistoryItem, assuming structure matches
    });

    return NextResponse.json(historyItems, { status: 200 });

  } catch (error) {
    console.error('Error fetching generation history:', error);
    // Log the specific error for debugging
    if (error instanceof Error) {
        console.error(error.message);
    }
    return NextResponse.json({ error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

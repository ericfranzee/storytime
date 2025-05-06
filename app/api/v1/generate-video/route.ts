import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  getUserSubscription,
  incrementVideoUsage,
  addVideoHistory,
} from '@/app/firebase'; // Assuming firebase functions are correctly exported
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp, getApps } from 'firebase/app'; // Import Firebase app initialization

// Ensure Firebase is initialized (adapt based on your actual firebase setup in firebase.ts)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const db = getFirestore();

const MAX_CHARACTERS = 1500; // Same as frontend
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL; // Read from environment variable

interface RequestBody {
  story: string;
  voice: string;
  music: string; // Can be '1', '2', ..., 'others' or a URL if music is 'others'
  isVertical?: boolean; // Optional, defaults to false (landscape)
  storyType: string;
  musicUrl?: string; // Required only if music is 'others'
  video_length?: 'default' | 'medium' | 'long'; // Optional video length
}

export async function POST(req: NextRequest) {
  if (!N8N_WEBHOOK_URL) {
    console.error('N8N_WEBHOOK_URL environment variable is not set.');
    return NextResponse.json({ success: false, error: 'Configuration error: Webhook URL missing.' }, { status: 500 });
  }

  // 1. Authentication
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer sk_')) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Missing or invalid API key.' }, { status: 401 });
  }
  const apiKey = authHeader.split(' ')[1];
  const userId = apiKey.substring(3); // Extract UID from sk_<uid>

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized: Invalid API key format.' }, { status: 401 });
  }

  try {
    // Verify user exists in Firestore 'users' collection
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json({ success: false, error: 'Unauthorized: User not found.' }, { status: 401 });
    }
    const userData = userDoc.data(); // We might need user email later if needed

    // 2. Parse and Validate Request Body
    let body: RequestBody;
    try {
      body = await req.json();
    } catch { // Removed unused _err variable
      return NextResponse.json({ success: false, error: 'Invalid request: Could not parse JSON body.' }, { status: 400 });
    }

    const { story, voice, music, isVertical = false, storyType, musicUrl } = body;
    const errors: Record<string, string> = {};

    if (!story || typeof story !== 'string' || story.trim().length === 0) {
      errors.story = 'Story content is required.';
    } else if (story.length > MAX_CHARACTERS) {
      errors.story = `Story exceeds maximum length of ${MAX_CHARACTERS} characters.`;
    }
    if (!voice || typeof voice !== 'string') {
      errors.voice = 'Voice selection is required.';
    }
    if (!music || typeof music !== 'string') {
      errors.music = 'Music selection is required.';
    }
    if (music === 'others' && (!musicUrl || typeof musicUrl !== 'string' || !musicUrl.startsWith('http'))) {
      errors.musicUrl = 'A valid public Music URL is required when music is set to "others".';
    }
    if (!storyType || typeof storyType !== 'string') {
      errors.storyType = 'Story type is required.';
    }
    if (typeof isVertical !== 'boolean') {
      errors.isVertical = 'isVertical must be a boolean value (true for vertical, false for landscape).';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, error: 'Invalid input.', details: errors }, { status: 400 });
    }

    // 3. Subscription & Usage Check
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      return NextResponse.json({ success: false, error: 'Subscription not found for user.' }, { status: 403 });
    }

    // Check if user is unrestricted (using email - requires fetching user doc if not already done)
    const unrestrictedEmails = process.env.NEXT_PUBLIC_UNRESTRICTED_EMAILS ? JSON.parse(process.env.NEXT_PUBLIC_UNRESTRICTED_EMAILS) : []; // Use NEXT_PUBLIC_ prefix if checking here
    const isUnrestricted = unrestrictedEmails.includes(userData.email); // Assumes email is in userDoc

    const isProOrElite = subscription.plan === 'pro' || subscription.plan === 'elite';
    const requestedVideoLength = body.video_length || 'default';

    // Validate video_length based on plan
    if (requestedVideoLength !== 'default' && !isProOrElite && !isUnrestricted) {
        return NextResponse.json({ success: false, error: 'Extended video length is only available for Pro and Elite plans.' }, { status: 403 });
    }

    // Determine usage increment
    let usageIncrement = 1;
    if (requestedVideoLength === 'medium') {
        usageIncrement = 2;
    } else if (requestedVideoLength === 'long') {
        usageIncrement = 3;
    }

    // Check remaining usage against increment amount
    if (!isUnrestricted && (subscription.usage + usageIncrement) > subscription.videoLimit) {
      return NextResponse.json({ success: false, error: `Insufficient credits. Required: ${usageIncrement}, Remaining: ${subscription.remainingUsage}` }, { status: 403 });
    }

    const isProUser = isProOrElite; // Use the calculated variable
    const videoScale = isVertical ? 'vertical' : 'landscape'; // Determine scale string for history

    // 4. Prepare and Send to Webhook
    const musicParameter = music === 'others' ? musicUrl : music;
    // Sanitize story content for JSON compatibility (more aggressive)
    const sanitizedStory = story
        .replaceAll('\n', ' ')
        .replaceAll('\"', ' ') // Replace double quotes with space
        // .replaceAll('\'', ' ') // Replace single quotes with space
        .replaceAll(':', ' ') // Replace colons with space
        .replaceAll('-', ' ') // Replace hyphens with space
        .replaceAll('_', ' ') // Replace underscores with space
        .replaceAll('.', ' '); // Replace periods with space
    const webhookPayload = {
      story: sanitizedStory, // Use sanitized story
      music: musicParameter,
      voice: voice,
      storyType: storyType,
      vertical_video: isVertical,
      pro_user: isProUser,
      // Conditionally add video_length if not default
      ...(requestedVideoLength !== "default" && { video_length: requestedVideoLength }),
      // Add musicUrl only if 'others' is selected
      ...(music === 'others' && { musicUrl: musicUrl }),
      // Add any other necessary fields expected by n8n
    };

    let n8nResponseData: unknown = null; // Use unknown instead of any
    try {
      const n8nResponse = await axios.post(N8N_WEBHOOK_URL, webhookPayload, {
        headers: { 'Content-Type': 'application/json' }
      });
      n8nResponseData = n8nResponse.data; // Store response data

      // Check if n8n indicated success (adjust based on actual n8n response structure)
      // Assuming n8n returns a 2xx status and potentially a body indicating acceptance
      if (n8nResponse.status < 200 || n8nResponse.status >= 300) {
         throw new Error(`Webhook returned status ${n8nResponse.status}`);
      }
       // Optional: Check response body for specific success indicators if needed
       // if (!n8nResponseData || !n8nResponseData.success) { // Example check
       //   throw new Error('Webhook processing failed.');
       // }

    } catch (error: unknown) { // Use unknown
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error('Error calling n8n webhook:', errorMessage);
      // Check if it's an Axios error to potentially get more details
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.response?.data);
        const axiosErrorMessage = (error.response?.data as { message?: string })?.message || errorMessage;
        return NextResponse.json({ success: false, error: `Webhook communication failed: ${axiosErrorMessage}` }, { status: 502 }); // Bad Gateway
      }
      return NextResponse.json({ success: false, error: `Webhook communication failed: ${errorMessage}` }, { status: 502 });
    }

    // 5. Increment Usage & Add History (Only if webhook call was successful)
    try {
      // Use the calculated usageIncrement
      await incrementVideoUsage(userId, usageIncrement);

      // Add history record - use placeholder/null for URLs initially if not available
      // n8n might return the initial videoUrl in its first response
      // Type assertion needed when accessing properties of unknown
      const initialVideoUrl = (n8nResponseData as { videoUrl?: string })?.videoUrl || null;
      const initialVoiceUrl = (n8nResponseData as { voiceUrl?: string })?.voiceUrl || null; // If n8n provides this too
      const initialImageUrls: string[] = []; // Explicitly type as string array

      await addVideoHistory(
        userId,
        initialVideoUrl ?? '', // Provide fallback if null
        initialVoiceUrl ?? '', // Provide fallback if null
        initialImageUrls, // Use the typed array
        sanitizedStory, // Use sanitized story for history
        musicParameter ?? '', // Provide fallback for TS type checker
        voice,
        videoScale // Use 'vertical' or 'landscape'
      );

    } catch (error: unknown) { // Use unknown
      // Log this error but don't necessarily fail the whole request,
      // as the video generation might have started. Maybe flag for admin review.
      let historyErrorMessage = 'Unknown error during history/usage update';
       if (error instanceof Error) {
         historyErrorMessage = error.message;
       }
      console.error(`Failed to increment usage or add history for user ${userId}:`, historyErrorMessage);
      // Decide if you want to return an error here or just log it.
      // For now, let's proceed but log it.
    }

    // 6. Return Success Response
    const successMessage = "Video generation started. If connection drops, check the provided URL after ~10 minutes.";
    return NextResponse.json({
        success: true,
        message: successMessage,
        videoUrl: (n8nResponseData as { videoUrl?: string })?.videoUrl || null // Type assertion
    }, { status: 202 }); // 202 Accepted is appropriate for async tasks

  } catch (error: unknown) { // Use unknown
    let finalErrorMessage = 'An internal server error occurred.';
    if (error instanceof Error) {
        finalErrorMessage = error.message;
        // Handle potential errors during user verification or subscription fetching
        if (finalErrorMessage.includes('Subscription not found')) {
             return NextResponse.json({ success: false, error: 'Subscription data error.' }, { status: 500 });
        }
    }
    console.error('API Error in /api/v1/generate-video:', finalErrorMessage);
    return NextResponse.json({ success: false, error: 'An internal server error occurred.' }, { status: 500 });
  }
}

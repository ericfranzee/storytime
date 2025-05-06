// import { put } from '@vercel/blob'; // Remove top-level static import
import { NextResponse, NextRequest } from 'next/server';
import { nanoid } from 'nanoid';

// Use NextRequest type for better type safety and access to nextUrl
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Use request.nextUrl.searchParams - preferred way in App Router
  const searchParams = request.nextUrl.searchParams;

  const filenameParam = searchParams.get('filename'); // No need for null check before get
  const uploadType = searchParams.get('type') || 'misc'; // Default directly

  if (!filenameParam) {
    console.error('Filename is required but not provided in search params');
    return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
  }

  // request.body is a ReadableStream | null
  if (!request.body) {
    return NextResponse.json({ error: 'No file body found' }, { status: 400 });
  }

  // Determine path based on type
  let basePath = 'storytime/misc'; // Default path
  if (uploadType === 'blog') {
    basePath = 'storytime/blog';
  } else if (uploadType === 'settings') {
    basePath = 'storytime/settings';
  } // Add more types as needed

  // Generate a unique filename and prepend the determined path
  // Ensure filenameParam is treated as a string
  // *** Restore nanoid usage ***
  const uniqueFilename = `${basePath}/${nanoid()}-${String(filenameParam)}`;
  // const uniqueFilename = `${basePath}/TEMP-${String(filenameParam)}`; // Keep temporary name commented

  try {
    // Dynamically import 'put' inside the handler
    const { put } = await import('@vercel/blob');

    // The request body is the file stream
    const blob = await put(uniqueFilename, request.body, {
      access: 'public',
      cacheControlMaxAge: 31536000, // Cache for 1 year
    });

    // Return the blob details (includes URL)
    return NextResponse.json(blob);
  } catch (error: unknown) {
    // Restore original error logging context
    console.error('Error uploading to Vercel Blob:', error);
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json(
      { error: `Failed to upload file: ${message}` },
      { status: 500 }
    );
  }
}

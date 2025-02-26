import { NextResponse } from 'next/server';
import { sendVideoReadyEmail } from '@/lib/email-utils';

export async function POST(request: Request) {
  try {
    const { email, videoUrl } = await request.json();

    if (!email || !videoUrl) {
      return NextResponse.json(
        { error: 'Email and videoUrl are required' },
        { status: 400 }
      );
    }

    const result = await sendVideoReadyEmail(email, videoUrl);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email notification' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
